import { useState } from "preact/hooks";
import { PlayerComponent } from "../components/PlayerComponent";
import { ApplicationMode } from "../enums/application_mode.enum";
import { ApplicationPage } from "../enums/application_page.enum";
import { GameMode } from "../enums/game_mode.enum";
import { UserMode } from "../enums/user_mode.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { useLobbies } from "../hooks/useLobbies";
import { usePlayers } from "../hooks/usePlayers";
import { Lobby } from "../models/lobby.model";
import { applicationStateService } from "../services/ApplicationStateService";
import { categoryService } from "../services/CategoryService";
import { gameService } from "../services/GameService";
import { playerService } from "../services/PlayerService";

/*export type LobbyPageProps = {
   setPage: (window: ApplicationPage) => void;
   applicationMode: ApplicationMode;
};*/

export function LobbyPage() {
   const [playerName, setName] = useState<string>("");
   const { players, actualPlayer } = usePlayers();
   const { lobbies, actualLobby } = useLobbies();
   const applicationState = useApplicationState();

   return (
      <div>
         <h1>Welcome to game lobby: {actualLobby?.name}</h1>
         {applicationState?.userMode === UserMode.HOST ? (
            <div>
               <p>
                  You host this game, you shall start the game if at least two
                  people join.
               </p>
               {actualLobby?.gameMode === GameMode.LOCAL &&
                  actualLobby?.connectionCode && (
                     <h2>Join with this code: {actualLobby?.connectionCode}</h2>
                  )}
               <h2>Players in this lobby:</h2>
               {players.map((player) => (
                  <PlayerComponent player={player} />
               ))}
               {actualLobby?.gameMode === GameMode.REMOTE && (
                  <div>
                     <h3>Set your name as a player in the remote game: </h3>
                     <input
                        type="text"
                        value={playerName}
                        onChange={(e) => {
                           setName(e.currentTarget.value);
                        }}
                        placeholder="Enter your name"
                     />
                  </div>
               )}
               <button
                  onClick={(e) => {
                     playerService.setPlayer({
                        id: null,
                        name: playerName?.trim(),
                        score: 0,
                     });
                     gameService.startGame(
                        actualLobby.name,
                        actualLobby?.gameMode,
                        actualLobby.totalRoundCount
                     );
                  }}
                  disabled={players.length < 1} //|| playerName?.trim() === ""}
               >
                  Start game
               </button>
            </div>
         ) : (
            <div>
               <p>
                  Hi {actualPlayer?.name}! You joined this lobby, wait for the
                  host to start the game.
               </p>
               <h2>Players in this lobby:</h2>
               {players.map((player) =>
                  player.id === actualPlayer?.id ? (
                     <PlayerComponent player={player} actualPlayer={true} />
                  ) : (
                     <PlayerComponent player={player} />
                  )
               )}
            </div>
         )}
      </div>
   );
}
