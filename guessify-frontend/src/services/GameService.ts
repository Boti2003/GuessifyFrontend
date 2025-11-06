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

class GameService {
   private actualGame: Game;
   private actualRound: GameRound;
   private actualQuestion: QuestionWithAnswer;
   private isAnswerTime: boolean = false;

   constructor() {
      hubService.gameConnection.on(
         "ReceiveNewRoundStarted",
         (newRound: GameRound) => {
            this.actualRound = newRound;
            applicationStateService.setApplicationStatus(
               ApplicationStatus.GAME_ROUND_STARTED
            );
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
      hubService.gameConnection.on("ReceiveEndGameRound", () => {
         console.log("Game round ended.");
         applicationStateService.setApplicationStatus(
            ApplicationStatus.IN_GAME
         );
         this.notifyListeners();
      });
      hubService.gameConnection.on("ReceiveGameEnd", (gameEnd: GameEnd) => {
         console.log("Game ended.");
         applicationStateService.setApplicationStatus(null);
         applicationStateService.setApplicationPage(
            ApplicationPage.GAME_ENDED_PAGE
         );
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
      actualQuestion: Question,
      isAnswerTime: boolean
   ) => void)[] = [];

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
      await lobbyService.startGameAndAbandonLobby(this.actualGame.id);
      applicationStateService.setApplicationStatus(ApplicationStatus.IN_GAME);
      this.notifyListeners();
      applicationStateService.setApplicationPage(ApplicationPage.GAME_PAGE);
      if (gameMode === GameMode.REMOTE) {
         hubService.gameConnection.send("ManageRemoteGame", this.actualGame.id);
      } else if (gameMode === GameMode.LOCAL) {
         categoryService.getCategoryGroups();
      }
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
         this.actualQuestion.id,
         answer,
         playerId
      );
   }

   addListener(
      listener: (
         actualGame: Game,
         actualRound: GameRound,
         actualQuestion: Question,
         isAnswerTime: boolean
      ) => void
   ) {
      listener(
         this.actualGame,
         this.actualRound,
         this.actualQuestion,
         this.isAnswerTime
      );
      this.componentListeners.push(listener);
   }
   removeListener(
      listener: (
         actualGame: Game,
         actualRound: GameRound,
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
