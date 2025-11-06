import { useEffect, useState } from "preact/hooks";
import { Player } from "../models/player.model";
import { playerService } from "../services/PlayerService";

export function usePlayers() {
   const [players, setPlayers] = useState<Player[]>([]);
   const [actualPlayer, setActualPlayer] = useState<Player | null>(null);

   useEffect(() => {
      const listener = (newPlayers: Player[], actualPlayer: Player) => {
         setPlayers(newPlayers);
         setActualPlayer(actualPlayer);
      };

      playerService.addListener(listener);

      return () => playerService.removeListener(listener);
   }, []);

   return { players, actualPlayer };
}
