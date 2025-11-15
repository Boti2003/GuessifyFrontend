import { ApplicationPage } from "../enums/application_page.enum";
import { ApplicationStatus } from "../enums/application_status.enum";
import { GameEndReason } from "../enums/game_end_reason.enum";
import { GameMode } from "../enums/game_mode.enum";
import { GameStatus } from "../enums/game_status.enum";
import { Game } from "../models/game.model";
import { GameEnd } from "../models/game_end.model";
import { GameRound } from "../models/game_round.model";
import { Question, QuestionWithAnswer } from "../models/question.model";
import { applicationStateService } from "./ApplicationStateService";
import { categoryService } from "./CategoryService";
import { hubService } from "./HubService";
import { lobbyService } from "./LobbyService";
import { playerService } from "./PlayerService";

class GameService {
   private actualGame: Game;
   private actualRound: GameRound;
   private actualRoundNumber: number;
   private actualQuestion: QuestionWithAnswer;
   private isAnswerTime: boolean = false;

   constructor() {}

   registerGameConnections() {
      hubService.gameConnection.on(
         "ReceiveNewRoundStarted",
         (newRound: GameRound) => {
            this.actualRound = newRound;
            applicationStateService.setApplicationStatus(
               ApplicationStatus.GAME_ROUND_STARTED
            );
            console.log("New round started:", newRound);
            this.notifyListeners();
         }
      );
      hubService.gameConnection.on(
         "ReceiveNextQuestion",
         (newQuestion: Question) => {
            console.log("Received new question:", newQuestion);
            this.actualQuestion = { ...newQuestion, correctAnswer: null };
            this.isAnswerTime = true;
            this.notifyListeners();
         }
      );
      hubService.gameConnection.on(
         "ReceiveEndAnswerTime",
         (correctAnswer: string) => {
            console.log("Answer time ended.");
            this.isAnswerTime = false;
            this.actualQuestion.correctAnswer = correctAnswer;
            this.notifyListeners();
         }
      );
      hubService.gameConnection.on(
         "ReceiveEndGameRound",
         (nextRoundNumber: number) => {
            console.log("Game round ended.");
            this.actualRoundNumber = nextRoundNumber;
            this.actualRound = null;
            this.actualQuestion = null;
            this.notifyListeners();
            if (
               ![
                  ApplicationStatus.GAME_ABORTED_HOST_LEFT,
                  ApplicationStatus.GAME_ABORTED_LACK_OF_PLAYERS,
                  ApplicationStatus.GAME_FINISHED,
               ].includes(
                  applicationStateService.getApplicationState()
                     .applicationStatus
               )
            ) {
               applicationStateService.setApplicationStatus(
                  ApplicationStatus.IN_GAME
               );
            }
         }
      );
      hubService.gameConnection.on("ReceiveGameEnd", (gameEnd: GameEnd) => {
         console.log("Game ended.");
         applicationStateService.setApplicationStatus(null);
         applicationStateService.setApplicationPage(
            ApplicationPage.GAME_ENDED_PAGE
         );
         playerService.clearPlayers();
         this.actualGame = null;
         this.actualRound = null;
         this.actualQuestion = null;
         this.isAnswerTime = false;
         switch (gameEnd.reason) {
            case GameEndReason.ALL_ROUNDS_COMPLETED:
               applicationStateService.setApplicationStatus(
                  ApplicationStatus.GAME_FINISHED
               );
               break;
            case GameEndReason.HOST_LEFT_GAME:
               applicationStateService.setApplicationStatus(
                  ApplicationStatus.GAME_ABORTED_HOST_LEFT
               );
               break;
            case GameEndReason.TOO_MANY_PLAYERS_LEFT_GAME:
               applicationStateService.setApplicationStatus(
                  ApplicationStatus.GAME_ABORTED_LACK_OF_PLAYERS
               );
               break;
         }
         this.notifyListeners();
      });
   }

   private componentListeners: ((
      actualGame: Game,
      actualRound: GameRound,
      actualRoundNumber: number,
      actualQuestion: Question,
      isAnswerTime: boolean
   ) => void)[] = [];

   setActualRoundNumber(roundNumber: number) {
      this.actualRoundNumber = roundNumber;
      this.notifyListeners();
   }

   async startGame(
      gameName: string,
      gameMode: GameMode,
      totalRoundCount: number
   ) {
      console.log("Starting game:", gameName, gameMode, totalRoundCount);
      this.actualGame = await hubService.gameConnection
         .invoke("StartGame", gameName, gameMode, totalRoundCount)
         .catch((err) => console.error("Invoke failed:", err));
      console.log("Game started with ID: " + this.actualGame.id);
      this.actualRoundNumber = 1;
      await lobbyService.startGameAndAbandonLobby(this.actualGame.id);
      applicationStateService.setApplicationStatus(ApplicationStatus.IN_GAME);
      this.notifyListeners();
      applicationStateService.setApplicationPage(ApplicationPage.GAME_PAGE);
      if (gameMode === GameMode.REMOTE) {
         hubService.gameConnection.send("ManageRemoteGame", this.actualGame.id);
      }
      categoryService.getCategoryGroups();
   }

   async startNewRound(categoryId: string) {
      await hubService.gameConnection.invoke(
         "StartNewRound",
         this.actualGame.id,
         categoryId
      );
   }

   async submitAnswer(answer: string, playerId: string) {
      await hubService.gameConnection.invoke(
         "SubmitAnswer",
         this.actualGame.id,
         this.actualRound.id,
         this.actualQuestion.question.id,
         answer,
         playerId
      );
   }

   addListener(
      listener: (
         actualGame: Game,
         actualRound: GameRound,
         actualRoundNumber: number,
         actualQuestion: Question,
         isAnswerTime: boolean
      ) => void
   ) {
      listener(
         this.actualGame,
         this.actualRound,
         this.actualRoundNumber,
         this.actualQuestion,
         this.isAnswerTime
      );
      this.componentListeners.push(listener);
   }
   removeListener(
      listener: (
         actualGame: Game,
         actualRound: GameRound,
         actualRoundNumber: number,
         actualQuestion: Question,
         isAnswerTime: boolean
      ) => void
   ) {
      this.componentListeners = this.componentListeners.filter(
         (l) => l !== listener
      );
   }

   private notifyListeners() {
      this.componentListeners.forEach((listener) =>
         listener(
            this.actualGame,
            this.actualRound,
            this.actualRoundNumber,
            this.actualQuestion,
            this.isAnswerTime
         )
      );
   }

   getGame(): Game {
      return this.actualGame;
   }

   setGame(game: Game) {
      this.actualGame = game;
      this.notifyListeners();
   }
   setRound(round: GameRound) {
      this.actualRound = round;
      this.notifyListeners();
   }
   /*setQuestion(question: Question) {
      this.actualQuestion = question;
      this.notifyListeners();
   }*/
}

export const gameService = new GameService();
