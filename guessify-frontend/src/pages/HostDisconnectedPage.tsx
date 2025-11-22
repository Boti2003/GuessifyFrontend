import { ApplicationPage } from "../enums/application_page.enum";
import { applicationStateService } from "../services/ApplicationStateService";

export function HostDisconnectedPage() {
   return (
      <div className="flex flex-col items-center justify-center gap-4">
         <h1 className="text-xl md:text-2xl font-bold mb-2 text-center mt-10">
            The host has disconnected.
         </h1>
         <p>Please return to the main menu.</p>
         <button
            className="btn btn-secondary mb-10"
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
