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
   console.log("Rendering PlayerComponent for player ID: " + player?.id);

   return (
      <div className="min-w-20 md:min-w-35 card card-border text-secondary-content bg-secondary text-center p-4">
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
