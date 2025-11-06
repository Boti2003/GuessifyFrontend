import { useEffect, useRef } from "preact/hooks";
import { useGames } from "../hooks/useGames";

export function ShowQuestionScreen() {
   const { actualQuestion, isAnswerTime } = useGames();

   const audioRef = useRef(null);

   useEffect(() => {
      if (audioRef.current || !isAnswerTime) {
         audioRef.current.pause();
      }
      if (actualQuestion && isAnswerTime) {
         audioRef.current.src = actualQuestion.previewUrl;
         audioRef.current.load();
         audioRef.current.play();
      }
   }, [actualQuestion, isAnswerTime]);

   return (
      <div>
         {actualQuestion?.answerOptions.map((option) => (
            <div>
               {!isAnswerTime && actualQuestion.correctAnswer === option ? (
                  <div style="border: 2px;">{option} EZ HELYES</div>
               ) : (
                  <div>{option}</div>
               )}
            </div>
         ))}
         <audio controls ref={audioRef} />
      </div>
   );
}
