import { ApplicationStatus } from "../enums/application_status.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { usePlayers } from "../hooks/usePlayers";
import { PlayerComponent } from "./PlayerComponent";

export function PLayerListComponent() {
   const { players, actualPlayer } = usePlayers();
   const applicationState = useApplicationState();

   return (
      <div className="flex w-64 overflow-x-auto mx-auto h-auto">
         {players.map((player) => (
            <PlayerComponent
               player={player}
               actualPlayer={actualPlayer?.id === player.id}
               inGame={[
                  ApplicationStatus.IN_GAME,
                  ApplicationStatus.GAME_ROUND_STARTED,
               ].includes(applicationState?.applicationStatus)}
            />
         ))}
      </div>
   );
}
