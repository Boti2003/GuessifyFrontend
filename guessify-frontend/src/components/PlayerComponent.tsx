import { ApplicationMode } from "../enums/application_mode.enum";
import { ApplicationPage } from "../enums/application_page.enum";
import { ApplicationStatus } from "../enums/application_status.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { Player } from "../models/player.model";

export type LobbyComponentProps = {
   player: Player;
   actualPlayer?: boolean;
};

export function PlayerComponent({ player, actualPlayer }: LobbyComponentProps) {
   //const { id, name, score } = player;
   console.log("Rendering PlayerComponent for player ID: " + player?.id);
   const applicationState = useApplicationState();
   return (
      <div>
         {actualPlayer ? (
            <div>
               <h3>{player?.name} (You)</h3>
               {[
                  ApplicationStatus.IN_GAME,
                  ApplicationStatus.GAME_ROUND_STARTED,
               ].includes(applicationState?.applicationStatus) && (
                  <p>Score: {player?.score}</p>
               )}
            </div>
         ) : (
            <div>
               <h3>{player?.name}</h3>
               {[
                  ApplicationStatus.IN_GAME,
                  ApplicationStatus.GAME_ROUND_STARTED,
               ].includes(applicationState?.applicationStatus) && (
                  <p>Score: {player?.score}</p>
               )}
            </div>
         )}
      </div>
   );
}
