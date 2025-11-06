import { useEffect, useState } from "preact/hooks";
import { Player } from "../models/player.model";
import { playerService } from "../services/PlayerService";
import { Game } from "../models/game.model";
import { GameRound } from "../models/game_round.model";
import { gameService } from "../services/GameService";
import { Question, QuestionWithAnswer } from "../models/question.model";

export function useGames() {
   const [actualGame, setActualGame] = useState<Game | null>(null);
   const [actualRound, setActualRound] = useState<GameRound | null>(null);
   const [actualQuestion, setActualQuestion] =
      useState<QuestionWithAnswer | null>(null);
   const [isAnswerTime, setIsAnswerTime] = useState<boolean>(false);

   useEffect(() => {
      const listener = (
         actualGame: Game,
         actualRound: GameRound,
         actualQuestion: QuestionWithAnswer,
         isAnswerTime: boolean
      ) => {
         setActualRound(actualRound);
         setActualGame(actualGame);
         setActualQuestion(actualQuestion);
         setIsAnswerTime(isAnswerTime);
      };

      gameService.addListener(listener);

      return () => gameService.removeListener(listener);
   }, []);

   return { actualGame, actualRound, actualQuestion, isAnswerTime };
}
