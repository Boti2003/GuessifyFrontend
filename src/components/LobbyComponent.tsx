import { LobbyStatus } from "../enums/lobby_status.enum";

import { Lobby } from "../models/lobby.model";

import { lobbyService } from "../services/LobbyService";

export type LobbyComponentProps = {
   lobby: Lobby;
   playerName: string;
   isGuest: boolean;
};

export function LobbyComponent({
   lobby,
   playerName,
   isGuest,
}: LobbyComponentProps) {
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
                  ((playerName?.trim() === "" || !playerName) && isGuest)
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
