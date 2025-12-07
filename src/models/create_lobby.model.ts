import { LobbyCreateStatus } from "../enums/lobby_create_status.enum";
import { Lobby } from "./lobby.model";

export type CreateLobby = {
   createStatus: LobbyCreateStatus;
   lobby: Lobby;
};
