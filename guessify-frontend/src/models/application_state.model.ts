import { ApplicationPage } from "../enums/application_page.enum";
import { ApplicationStatus } from "../enums/application_status.enum";
import { UserMode } from "../enums/user_mode.enum";

export type ApplicationState = {
   userMode?: UserMode | null;
   applicationPage?: ApplicationPage | null;
   applicationStatus?: ApplicationStatus | null;
};
