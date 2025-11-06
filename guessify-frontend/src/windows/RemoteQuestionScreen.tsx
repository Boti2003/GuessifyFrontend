import { useEffect, useRef, useState } from "preact/hooks";
import { useGames } from "../hooks/useGames";
import { usePlayers } from "../hooks/usePlayers";
import { gameService } from "../services/GameService";
import { PlayerComponent } from "../components/PlayerComponent";

export function RemoteQuestionScreen() {
   const { actualRound, actualQuestion, isAnswerTime } = useGames();
   const { actualPlayer, players } = usePlayers();
   const [alreadyAnswered, setAlreadyAnswered] = useState(false);

   const audioRef = useRef(null);

   useEffect(() => {
      if (audioRef.current || !isAnswerTime) {
         audioRef.current.pause();
      }
      if (actualQuestion && isAnswerTime) {
         setAlreadyAnswered(false);
         audioRef.current.src = actualQuestion.previewUrl;
         audioRef.current.load();
         audioRef.current.play();
      }
   }, [actualQuestion, isAnswerTime]);

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
         {!isAnswerTime && (
            <div>
               <div>
                  The correct answer was: {actualQuestion?.correctAnswer}
               </div>
               {players.map((player) => (
                  <PlayerComponent
                     player={player}
                     actualPlayer={player.id === actualPlayer?.id}
                  />
               ))}
            </div>
         )}
         <audio controls ref={audioRef} />
      </div>
   );
}
