import { ApplicationMode } from "../enums/application_mode.enum";
import { ApplicationPage } from "../enums/application_page.enum";
import { LobbyStatus } from "../enums/lobby_status.enum";
import { UserMode } from "../enums/user_mode.enum";
import { Lobby } from "../models/lobby.model";
import { applicationStateService } from "../services/ApplicationStateService";
import { lobbyService } from "../services/LobbyService";

export type LobbyComponentProps = {
   // Define props here if needed
   /*setPage: (page: ApplicationPage) => void;
   setApplicationMode: (mode: ApplicationMode) => void;*/
   lobby: Lobby;
   playerName: string;
};

export function LobbyComponent({ lobby, playerName }: LobbyComponentProps) {
   const { id, name, capacity, numberOfPlayers, status } = lobby;
   console.log("Rendering LobbyComponent for lobby ID: " + id);
   return (
      <div className="card card-border text-secondary-content bg-secondary my-2">
         <div className="card-body items-center text-center">
            <h2 className="card-title">{name}</h2>
            <p>
               Capacity: {numberOfPlayers}/{capacity}
            </p>
            <button
               className="btn btn-accent"
               disabled={
                  status === LobbyStatus.IN_GAME ||
                  numberOfPlayers >= capacity ||
                  playerName.trim() === "" ||
                  !playerName
               }
               onClick={(e) => {
                  lobbyService.joinLobby(id, playerName);
               }}
            >
               Join lobby
            </button>
         </div>
      </div>
   );
}
