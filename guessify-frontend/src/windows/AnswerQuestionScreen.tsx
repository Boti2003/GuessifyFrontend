import { useEffect, useRef, useState } from "preact/hooks";
import { useGames } from "../hooks/useGames";
import { usePlayers } from "../hooks/usePlayers";
import { gameService } from "../services/GameService";

export function AnswerQuestionScreen() {
   const { actualRound, actualQuestion, isAnswerTime } = useGames();
   const { actualPlayer } = usePlayers();
   const [alreadyAnswered, setAlreadyAnswered] = useState(false);

   useEffect(() => {
      setAlreadyAnswered(false);
   }, [actualQuestion]);

   return (
      <div>
         {isAnswerTime && !alreadyAnswered && (
            <div
               className=" grid grid-cols-2 items-center justify-center gap-6 text-center"
               style={{ gridAutoRows: "1fr" }}
            >
               {actualQuestion?.question?.answerOptions?.map((option) => (
                  <button
                     className="btn btn-neutral min-h-24 p-6 w-full h-full break-words text-wrap"
                     onClick={(e) => {
                        gameService.submitAnswer(option, actualPlayer.id);
                        setAlreadyAnswered(true);
                     }}
                  >
                     {option}
                  </button>
               ))}
            </div>
         )}
      </div>
   );
}
