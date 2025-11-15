import { useEffect, useRef } from "preact/hooks";
import { useGames } from "../hooks/useGames";
import { CounterComponent } from "../components/CounterComponent";

export function ShowQuestionScreen() {
   const { actualQuestion, isAnswerTime } = useGames();

   const audioRef = useRef(null);

   useEffect(() => {
      if (audioRef.current || !isAnswerTime) {
         audioRef.current.pause();
      }
      if (actualQuestion && isAnswerTime) {
         audioRef.current.src = actualQuestion.question.previewUrl;
         audioRef.current.load();
         audioRef.current.play();
      }
   }, [actualQuestion, isAnswerTime]);

   return (
      <div className="flex flex-col gap-6 items-center w-full">
         <CounterComponent
            startTime={actualQuestion?.sendTime}
            duration={actualQuestion?.duration}
            visible={isAnswerTime}
         />
         <div className="flex flex-col md:grid md:grid-cols-2 items-center justify-center gap-6 text-center">
            {actualQuestion?.question?.answerOptions?.map((option) => (
               <div>
                  {!isAnswerTime && actualQuestion.correctAnswer === option ? (
                     <div className="border border-2 border-secondary bg-success font-semibold text-success-content rounded-xl p-4 min-w-48 ">
                        {option}
                     </div>
                  ) : (
                     <div className="border border-2 border-secondary font-semibold bg-base-300 rounded-xl p-4 min-w-48">
                        {option}
                     </div>
                  )}
               </div>
            ))}
         </div>

         <audio className="invisible" controls ref={audioRef} />
      </div>
   );
}
