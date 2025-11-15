import { LeaderBoardComponent } from "../components/LeaderBoardComponent";
import { PlayerLeaderBoardComponent } from "../components/PlayerLeaderBoardComponent";
import { PodiumComponent } from "../components/PodiumComponent";
import { ApplicationPage } from "../enums/application_page.enum";
import { ApplicationStatus } from "../enums/application_status.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { usePlayers } from "../hooks/usePlayers";
import { applicationStateService } from "../services/ApplicationStateService";

export function GameEndedPage() {
   const state = useApplicationState();
   const { players } = usePlayers();

   const sortedPlayers = players.sort((a, b) => b.score - a.score);
   const topPlayers = sortedPlayers?.slice(0, 3)?.map((player, index) => {
      return { displayName: player.name, score: player.score, rank: index + 1 };
   });
   const remainingPlayers = sortedPlayers?.slice(3).map((player, index) => {
      return { displayName: player.name, score: player.score, rank: index + 4 };
   });

   return (
      <div class="flex flex-col items-center gap-6">
         {state?.applicationStatus === ApplicationStatus.GAME_FINISHED ? (
            <div className="flex flex-col items-center">
               <div>
                  <h1 className="text-xl md:text-2xl font-bold mb-2 text-center mt-25">
                     The game has ended. Thank you for playing!
                  </h1>
               </div>
               <div className="flex flex-col gap-6 items-center md:flex-row">
                  <PodiumComponent topPlayers={topPlayers} />

                  {players?.length > 3 && (
                     <LeaderBoardComponent
                        heightClass="h-75"
                        leaderBoardElements={remainingPlayers}
                     />
                  )}
               </div>
            </div>
         ) : (
            <div>
               <h1 className="text-xl md:text-2xl font-bold mb-2 text-center mt-10">
                  {state?.applicationStatus ===
                     ApplicationStatus.GAME_ABORTED_LACK_OF_PLAYERS &&
                     "The game ended, because all the other players left."}
                  {state?.applicationStatus ===
                     ApplicationStatus.GAME_ABORTED_HOST_LEFT &&
                     "The game ended, because the host left the game."}
               </h1>
               <p>Please return to the main menu.</p>
            </div>
         )}
         <button
            className="btn btn-secondary mb-10"
            onClick={(e) => {
               applicationStateService.setApplicationPage(
                  ApplicationPage.MAIN_PAGE
               );
               applicationStateService.setApplicationStatus(
                  ApplicationStatus.INIT
               );
            }}
         >
            Main Menu
         </button>
      </div>
   );
}
