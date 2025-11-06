import { useEffect, useState } from "preact/hooks";
import { Lobby } from "../models/lobby.model";
import { lobbyService } from "../services/LobbyService";
import { JoinStatus } from "../enums/join_status.enum";

export function useLobbies() {
   const [lobbies, setLobbies] = useState<Lobby[]>([]);
   const [actualLobby, setActualLobby] = useState<Lobby | null>(null);
   const [joinStatus, setJoinStatus] = useState<JoinStatus | null>(null);

   useEffect(() => {
      const listener = (
         newLobbies: Lobby[],
         actualLobby: Lobby,
         joinStatus: JoinStatus
      ) => {
         setLobbies(newLobbies);
         setActualLobby(actualLobby);
         setJoinStatus(joinStatus);
      };

      lobbyService.addListener(listener);

      return () => lobbyService.removeListener(listener);
   }, []);

   return { lobbies, actualLobby, joinStatus };
}
