import { ApplicationStatus } from "../enums/application_status.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { usePlayers } from "../hooks/usePlayers";
import { PlayerComponent } from "./PlayerComponent";

export function PLayerListComponent() {
   const { players, actualPlayer } = usePlayers();
   const applicationState = useApplicationState();
   //"flex overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 w-80 md:w-200 "
   return (
      <div className="w-full overflow-x-auto -mx-4">
         <div className="grid grid-col-2 md:inline-flex items-center gap-3 min-w-max w-full justify-center">
            {players.map((player) => (
               <div key={player.id} className="flex-shrink-0">
                  <PlayerComponent
                     player={player}
                     actualPlayer={actualPlayer?.id === player.id}
                     inGame={[
                        ApplicationStatus.IN_GAME,
                        ApplicationStatus.GAME_ROUND_STARTED,
                     ].includes(applicationState?.applicationStatus)}
                  />
               </div>
            ))}
         </div>
      </div>
   );
}
