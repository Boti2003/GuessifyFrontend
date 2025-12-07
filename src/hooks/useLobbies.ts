import { useEffect, useState } from "preact/hooks";
import { Lobby } from "../models/lobby.model";
import { lobbyService } from "../services/LobbyService";
import { JoinStatus } from "../enums/join_status.enum";
import { LobbyCreateStatus } from "../enums/lobby_create_status.enum";
import { StartGameStatus } from "../enums/start_game_status.enum";

export function useLobbies() {
   const [lobbies, setLobbies] = useState<Lobby[]>([]);
   const [actualLobby, setActualLobby] = useState<Lobby | null>(null);
   const [joinStatus, setJoinStatus] = useState<JoinStatus | null>(null);
   const [createStatus, setCreateStatus] = useState<LobbyCreateStatus | null>(
      null
   );
   const [startGameStatus, setStartGameStatus] =
      useState<StartGameStatus | null>(null);

   useEffect(() => {
      const listener = (
         newLobbies: Lobby[],
         actualLobby: Lobby,
         joinStatus: JoinStatus,
         createStatus: LobbyCreateStatus,
         startGameStatus: StartGameStatus
      ) => {
         setLobbies(newLobbies);
         setActualLobby(actualLobby);
         setJoinStatus(joinStatus);
         setCreateStatus(createStatus);
         setStartGameStatus(startGameStatus);
      };

      lobbyService.addListener(listener);

      return () => lobbyService.removeListener(listener);
   }, []);

   return { lobbies, actualLobby, joinStatus, createStatus, startGameStatus };
}
