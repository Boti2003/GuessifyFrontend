import { useState } from "preact/hooks";
import { PLayerListComponent } from "../components/PlayerListComponent";
import { GameMode } from "../enums/game_mode.enum";
import { StartGameStatus } from "../enums/start_game_status.enum";
import { UserMode } from "../enums/user_mode.enum";
import { UserType } from "../enums/user_type.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { useLobbies } from "../hooks/useLobbies";
import { usePlayers } from "../hooks/usePlayers";
import { useUsers } from "../hooks/useUsers";
import { gameService } from "../services/GameService";
import { playerService } from "../services/PlayerService";

export function LobbyPage() {
   const [playerName, setName] = useState<string>(null);
   const { players, actualPlayer } = usePlayers();
   const { actualLobby, startGameStatus } = useLobbies();
   const applicationState = useApplicationState();
   const { actualUser } = useUsers();

   return (
      <div className="flex flex-col gap-4 items-center bg-base-200 md:border-5 md:border-double md:rounded-xl p-8">
         <h1 className="text-3xl md:text-4xl font-bold text-center">
            Welcome to game lobby: {actualLobby?.name}
         </h1>
         {applicationState?.userMode === UserMode.HOST ? (
            <div className="flex flex-col items-center gap-2">
               {actualLobby?.gameMode === GameMode.LOCAL &&
                  actualLobby?.connectionCode && (
                     <div className="flex flex-row items-center gap-2 self-end bg-base-300 px-4 py-2 rounded-xl mb-4 border border-2 border-accent">
                        <h2 className="text-md md:text-xl font-semibold">
                           Join lobby:
                        </h2>
                        <p className="card card-border border-secondary text-center text-warning-content bg-warning p-2 font-bold">
                           {actualLobby?.connectionCode}
                        </p>
                     </div>
                  )}
               <p className="text-lg md:text-xl font-semibold">
                  You host this game, you shall start the game if at least two
                  people join.
               </p>

               {actualLobby?.gameMode === GameMode.REMOTE && (
                  <div>
                     {applicationState?.userType === UserType.GUEST ? (
                        <div className="flex flex-col gap-4 items-center">
                           <h3 className="text-center">
                              Set your name as a player in the remote game:
                           </h3>
                           <input
                              className="input input-secondary"
                              type="text"
                              value={playerName}
                              onChange={(e) => {
                                 setName(e.currentTarget.value);
                              }}
                              placeholder="Enter your name"
                           />
                        </div>
                     ) : (
                        <h3 className="text-center">
                           Hi {actualUser?.displayName}! You will use this name
                           in the game!
                        </h3>
                     )}
                  </div>
               )}

               <button
                  className="btn btn-secondary text-xl font-semibold p-5"
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
                  disabled={
                     (actualLobby?.gameMode === GameMode.REMOTE &&
                        players.length < 1) ||
                     (actualLobby?.gameMode === GameMode.REMOTE &&
                        (playerName?.trim() === "" || !playerName) &&
                        applicationState?.userType === UserType.GUEST) ||
                     (actualLobby?.gameMode === GameMode.LOCAL &&
                        players.length < 2)
                  }
               >
                  Start game
               </button>
               {startGameStatus === StartGameStatus.HOST_PLAYER_NAME_TAKEN && (
                  <p className="text-error text-center">
                     This name is already taken by another player, please choose
                     another!
                  </p>
               )}
               {startGameStatus === StartGameStatus.NOT_ENOUGH_PLAYERS && (
                  <p className="text-error text-center">
                     There are not enough players to start the game!
                  </p>
               )}
            </div>
         ) : (
            <div className="flex flex-col items-center">
               <p className="text-lg md:text-xl font-semibold">
                  Hi {actualPlayer?.name}! You joined this lobby, wait for the
                  host to start the game.
               </p>
            </div>
         )}
         <div className="w-3/4">
            <h2 className="self-start text-lg md:text-xl font-semibold">
               Players in this lobby:
            </h2>
            <PLayerListComponent />
         </div>
      </div>
   );
}
