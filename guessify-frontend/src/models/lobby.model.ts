import { GameMode } from "../enums/game_mode.enum";
import { LobbyStatus } from "../enums/lobby_status.enum";

export type Lobby = {
   id: string;
   name: string;
   capacity: number;
   numberOfPlayers: number;
   status: LobbyStatus;
   gameMode: GameMode;
   totalRoundCount: number;
   connectionCode?: string;
};
