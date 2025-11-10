import { useEffect, useState } from "preact/hooks";
import { ApplicationMode } from "../enums/application_mode.enum";
import { ApplicationPage } from "../enums/application_page.enum";
import { Lobby } from "../models/lobby.model";
import { playerService } from "../services/PlayerService";
import { lobbyService } from "../services/LobbyService";
import { LobbyComponent } from "../components/LobbyComponent";
import { useLobbies } from "../hooks/useLobbies";
import { GameMode } from "../enums/game_mode.enum";
import { JoinStatus } from "../enums/join_status.enum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { applicationStateService } from "../services/ApplicationStateService";
import { BackButton } from "../components/BackButton";
import { useApplicationState } from "../hooks/useApplicationState";
import { UserType } from "../enums/user_type.enum";
import { useActualUser } from "../hooks/useActualUser";

/*export type LobbyListPageProps = {
   setPage: (page: ApplicationPage) => void;
   setApplicationMode: (mode: ApplicationMode) => void;
};*/
//flex flex-col gap-8

export function LobbyListPage() {
   const [playerName, setPlayerName] = useState<string>(null);
   const [connectionCode, setConnectionCode] = useState<string>("");

   const { lobbies, actualLobby, joinStatus } = useLobbies();
   const applicationState = useApplicationState();
   const actualUser = useActualUser();
   return (
      <div className="p-8 items-center text-center flex flex-col md:border-5 md:border-double md:rounded-xl bg-base-200 mt-15">
         <div className="place-self-start">
            <BackButton targetPage={ApplicationPage.MAIN_PAGE} />
         </div>
         <div>
            <h1 className="text-xl md:text-2xl font-bold mb-2">Join a game!</h1>
            {applicationState?.userType === UserType.GUEST ? (
               <div>
                  <h2 className="font-semibold my-1">Your name</h2>
                  <input
                     className="input input-secondary"
                     type="text"
                     value={playerName}
                     onChange={(e) => {
                        setPlayerName(e.currentTarget.value);
                     }}
                     placeholder="Enter your name"
                  />
               </div>
            ) : (
               <div>
                  <h2 className="font-semibold my-1">
                     Hi {actualUser?.displayName}!
                  </h2>
               </div>
            )}
         </div>
         <div className="divider "></div>

         <div className="flex w-full flex-col md:flex-row md:w-full items-center">
            <div>
               <h1 className="font-semibold">Available remote lobbies</h1>
               <div className="h-64 overflow-y-auto md:w-full mx-auto md:h-92">
                  {lobbies.map(
                     (lobby) =>
                        lobby.gameMode === GameMode.REMOTE && (
                           <LobbyComponent
                              lobby={lobby}
                              playerName={playerName}
                              isGuest={
                                 applicationState?.userType === UserType.GUEST
                              }
                           />
                        )
                  )}
               </div>
            </div>

            <div className="divider md:divider-horizontal">OR</div>
            <div className="gap-4">
               <h1 className=" font-semibold">
                  Join a local lobby with a code shown on the host screen
               </h1>
               <input
                  className="input input-secondary my-2"
                  type="text"
                  value={connectionCode}
                  onChange={(e) => {
                     setConnectionCode(e.currentTarget.value);
                  }}
                  placeholder="#Enter connection code"
               />
               <button
                  className="btn btn-accent mb-2"
                  disabled={
                     (connectionCode.trim() === "" ||
                        playerName.trim() === "") &&
                     applicationState?.userType === UserType.GUEST
                  }
                  onClick={(e) => {
                     lobbyService.joinLobbyWithCode(connectionCode, playerName);
                  }}
               >
                  Join lobby with code
               </button>
               {joinStatus === JoinStatus.LOBBY_NOT_FOUND && (
                  <p className="text-error">Lobby not found with code!</p>
               )}
               {joinStatus === JoinStatus.LOBBY_FULL && (
                  <p className="text-error">Lobby you try to join is full!</p>
               )}
            </div>
         </div>
      </div>
   );
}
