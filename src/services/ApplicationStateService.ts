import { ApplicationPage } from "../enums/application_page.enum";
import { ApplicationStatus } from "../enums/application_status.enum";
import { UserMode } from "../enums/user_mode.enum";
import { UserType } from "../enums/user_type.enum";
import { ApplicationState } from "../models/application_state.model";

class ApplicationStateService {
   private applicationState: ApplicationState;
   private componentListeners: ((
      applicationState: ApplicationState
   ) => void)[] = [];

   constructor() {
      this.applicationState = {
         userMode: null,
         userType: UserType.GUEST,
         applicationPage: ApplicationPage.MAIN_PAGE,
         applicationStatus: ApplicationStatus.INIT,
      };
      this.notifyListeners();
   }
   addListener(listener: (applicationState: ApplicationState) => void) {
      listener(this.applicationState);
      this.componentListeners.push(listener);
   }
   removeListener(listener: (applicationState: ApplicationState) => void) {
      this.componentListeners = this.componentListeners.filter(
         (l) => l !== listener
      );
   }
   notifyListeners() {
      this.componentListeners.forEach((listener) =>
         listener(this.applicationState)
      );
   }

   getApplicationState(): ApplicationState {
      return this.applicationState;
   }
   setUserMode(newMode: UserMode): void {
      if (newMode !== undefined) {
         this.applicationState = {
            ...this.applicationState,
            userMode: newMode,
         };
      }

      this.notifyListeners();
   }
   setApplicationStatus(newStatus: ApplicationStatus): void {
      if (newStatus !== undefined) {
         this.applicationState = {
            ...this.applicationState,
            applicationStatus: newStatus,
         };
      }

      this.notifyListeners();
   }
   setApplicationPage(newPage: ApplicationPage): void {
      if (newPage !== undefined) {
         this.applicationState = {
            ...this.applicationState,
            applicationPage: newPage,
         };
      }

      this.notifyListeners();
   }

   setUserType(newType: UserType): void {
      if (newType !== undefined) {
         this.applicationState = {
            ...this.applicationState,
            userType: newType,
         };
      }
      this.notifyListeners();
   }
}
export const applicationStateService = new ApplicationStateService();
