import { ApplicationPage } from "../enums/application_page.enum";
import { ApplicationStatus } from "../enums/application_status.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { applicationStateService } from "../services/ApplicationStateService";

export function GameEndedPage() {
   const state = useApplicationState();
   return (
      <div>
         {state?.applicationStatus === ApplicationStatus.GAME_FINISHED ? (
            <div>
               <h1>The game has ended. Thank you for playing!</h1>
            </div>
         ) : (
            <div>
               <h1>
                  {state?.applicationStatus ===
                     ApplicationStatus.GAME_ABORTED_LACK_OF_PLAYERS &&
                     "The game ended, because all the other players left."}
                  {state?.applicationStatus ===
                     ApplicationStatus.GAME_ABORTED_HOST_LEFT &&
                     "The game ended, because the host left the game."}
               </h1>
               <p>Please return to the main menu.</p>
               <button
                  onClick={(e) => {
                     applicationStateService.setApplicationPage(
                        ApplicationPage.MAIN_PAGE
                     );
                  }}
               >
                  Go back to main menu.
               </button>
            </div>
         )}
      </div>
   );
}
