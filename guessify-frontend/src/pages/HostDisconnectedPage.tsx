import { ApplicationPage } from "../enums/application_page.enum";
import { applicationStateService } from "../services/ApplicationStateService";

export function HostDisconnectedPage() {
   return (
      <div>
         <h1>The host has disconnected.</h1>
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
   );
}
