import { useState } from "preact/hooks";
import { ApplicationPage } from "../enums/application_page.enum";
import { CreateLobbyPage } from "./CreateLobbyPage";
import { ApplicationMode } from "../enums/application_mode.enum";
import { LobbyListPage } from "./LobbyListPage";
import { LobbyPage } from "./LobbyPage";
import { useApplicationState } from "../hooks/useApplicationState";
import { applicationStateService } from "../services/ApplicationStateService";
import { GamePage } from "./GamePage";
import { HostDisconnectedPage } from "./HostDisconnectedPage";
import { GameEndedPage } from "./GameEndedPage";
import bootstrap from "bootstrap";
import { authService } from "../services/AuthService";
import { NavBarComponent } from "../components/NavBarComponent";
import { LoginPage } from "./LoginPage";
import { LeaderBoardComponent } from "../components/LeaderBoardComponent";
import { LeaderboardPage } from "./LeaderBoardPage";
import { UserType } from "../enums/user_type.enum";

export function MainPage() {
   const applicationState = useApplicationState();

   return (
      <div className="min-h-screen w-full grid place-items-center">
         {![ApplicationPage.GAME_PAGE, ApplicationPage.LOBBY_PAGE].includes(
            applicationState?.applicationPage
         ) && <NavBarComponent />}
         {applicationState?.applicationPage === ApplicationPage.MAIN_PAGE && (
            <div className=" grid grid-cols-1 gap-4 place-items-center w-full">
               <div className="text-3xl md:text-4xl font-bold mb-5">
                  <h1>Welcome to Guessify!</h1>
               </div>

               <button
                  className="w-1/2 md:w-1/5 btn btn-neutral"
                  onClick={(e) =>
                     applicationStateService.setApplicationPage(
                        ApplicationPage.CREATE_LOBBY_PAGE
                     )
                  }
               >
                  Host a game
               </button>
               <button
                  className="w-1/2 md:w-1/5 btn btn-neutral"
                  onClick={(e) =>
                     applicationStateService.setApplicationPage(
                        ApplicationPage.LOBBY_LIST_PAGE
                     )
                  }
               >
                  Join a game
               </button>
               <button
                  className="w-1/2 md:w-1/5 btn btn-neutral"
                  onClick={(e) => {
                     applicationStateService.setApplicationPage(
                        ApplicationPage.LEADERBOARD_PAGE
                     );
                     if (applicationState?.userType !== UserType.GUEST) {
                        authService.fetchCurrentUser();
                     }
                     authService.getScoreboard();
                  }}
               >
                  Leaderboard
               </button>
            </div>
         )}
         {applicationState?.applicationPage ===
            ApplicationPage.CREATE_LOBBY_PAGE && <CreateLobbyPage />}
         {applicationState?.applicationPage ===
            ApplicationPage.LOBBY_LIST_PAGE && <LobbyListPage />}
         {applicationState?.applicationPage === ApplicationPage.LOBBY_PAGE && (
            <LobbyPage />
         )}
         {applicationState?.applicationPage === ApplicationPage.GAME_PAGE && (
            <GamePage />
         )}
         {applicationState?.applicationPage ===
            ApplicationPage.HOST_DISCONNECTED_PAGE && <HostDisconnectedPage />}
         {applicationState?.applicationPage ===
            ApplicationPage.GAME_ENDED_PAGE && <GameEndedPage />}
         {applicationState?.applicationPage === ApplicationPage.LOGIN_PAGE && (
            <LoginPage />
         )}

         {applicationState?.applicationPage ===
            ApplicationPage.LEADERBOARD_PAGE && <LeaderboardPage />}
      </div>
   );
}
