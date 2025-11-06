import { useEffect, useState } from "preact/hooks";
import { Player } from "../models/player.model";
import { playerService } from "../services/PlayerService";
import { ApplicationState } from "../models/application_state.model";
import { applicationStateService } from "../services/ApplicationStateService";

export function useApplicationState() {
   const [applicationState, setApplicationState] = useState<ApplicationState>();
   useEffect(() => {
      const listener = (applicationState: ApplicationState) => {
         setApplicationState(applicationState);
      };

      applicationStateService.addListener(listener);

      return () => applicationStateService.removeListener(listener);
   }, []);

   return applicationState;
}
