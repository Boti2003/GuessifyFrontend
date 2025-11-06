import { useEffect, useRef, useState } from "preact/hooks";
import { useGames } from "../hooks/useGames";
import { usePlayers } from "../hooks/usePlayers";
import { gameService } from "../services/GameService";

export function AnswerQuestionScreen() {
   const { actualRound, actualQuestion, isAnswerTime } = useGames();
   const { actualPlayer } = usePlayers();
   const [alreadyAnswered, setAlreadyAnswered] = useState(false);

   /*const audioRef = useRef(null);

   useEffect(() => {
      if (audioRef.current || !isAnswerTime) {
         audioRef.current.pause();
      }
      if (actualQuestion && isAnswerTime) {
         audioRef.current.src = actualQuestion.previewUrl;
         audioRef.current.load();
         audioRef.current.play();
      }
   }, [actualQuestion, isAnswerTime]);*/

   useEffect(() => {
      setAlreadyAnswered(false);
   }, [actualQuestion]);

   return (
      <div>
         {isAnswerTime && !alreadyAnswered && (
            <div>
               {actualQuestion?.answerOptions.map((option) => (
                  <button
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
