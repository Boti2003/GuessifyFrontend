import { ApplicationMode } from "../enums/application_mode.enum";
import { ApplicationPage } from "../enums/application_page.enum";
import { ApplicationStatus } from "../enums/application_status.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { Player } from "../models/player.model";

export type LobbyComponentProps = {
   player: Player;
   actualPlayer?: boolean;
   inGame: boolean;
};

export function PlayerComponent({
   player,
   actualPlayer,
   inGame,
}: LobbyComponentProps) {
   //const { id, name, score } = player;
   console.log("Rendering PlayerComponent for player ID: " + player?.id);

   return (
      <div className="w-48 card card-border text-secondary-content bg-secondary text-center my-2 p-4">
         {actualPlayer ? (
            <div>
               <h3>{player?.name} (You)</h3>
               {inGame && <p>Score: {player?.score}</p>}
            </div>
         ) : (
            <div>
               <h3>{player?.name}</h3>
               {inGame && <p>Score: {player?.score}</p>}
            </div>
         )}
      </div>
   );
}
