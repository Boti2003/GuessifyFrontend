import { useEffect, useRef, useState } from "preact/hooks";
import { useGames } from "../hooks/useGames";
import { usePlayers } from "../hooks/usePlayers";
import { gameService } from "../services/GameService";
import { PlayerComponent } from "../components/PlayerComponent";
import { PLayerListComponent } from "../components/PlayerListComponent";
import { CounterComponent } from "../components/CounterComponent";

export function RemoteQuestionScreen() {
   const { actualRound, actualQuestion, isAnswerTime } = useGames();
   const { actualPlayer, players } = usePlayers();
   const [alreadyAnswered, setAlreadyAnswered] = useState(false);

   const audioRef = useRef(null);

   useEffect(() => {
      if (audioRef.current && actualQuestion && isAnswerTime) {
         setAlreadyAnswered(false);
         audioRef.current.src = actualQuestion.question.previewUrl;
         audioRef.current.load();
         audioRef.current.play();
      }
   }, [isAnswerTime, actualQuestion]);

   useEffect(() => {
      if (audioRef.current && !isAnswerTime) {
         audioRef.current.pause();
      }
   }, [isAnswerTime]);

   useEffect(() => {
      if (audioRef.current && alreadyAnswered) {
         audioRef.current.pause();
      }
   }, [alreadyAnswered]);

   return (
      <div className="w-full">
         {isAnswerTime && !alreadyAnswered && (
            <div className="flex flex-col gap-4">
               <CounterComponent
                  startTime={actualQuestion?.sendTime}
                  duration={actualQuestion?.duration}
                  visible={isAnswerTime}
               />
               <div className="flex flex-col md:grid md:grid-cols-2 items-center justify-center gap-6 text-center">
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
            </div>
         )}
         {isAnswerTime && alreadyAnswered && (
            <h2 className="text-2xl text-center font-bold">
               You already submitted your answer! Waiting for other players...
            </h2>
         )}
         {!isAnswerTime && actualQuestion && (
            <div className="flex flex-col gap-4 items-center">
               <div className="text-xl font-semibold text-center">
                  The correct answer was:
               </div>
               <div className="bg-base-200 rounded-xl text-center font-semibold text-lg p-4">
                  {actualQuestion?.correctAnswer}
               </div>
               <PLayerListComponent />
            </div>
         )}
         <audio className="invisible" controls ref={audioRef} />
      </div>
   );
}
