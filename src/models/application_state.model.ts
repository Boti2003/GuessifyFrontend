import { ApplicationPage } from "../enums/application_page.enum";
import { ApplicationStatus } from "../enums/application_status.enum";
import { UserMode } from "../enums/user_mode.enum";
import { UserType } from "../enums/user_type.enum";

export type ApplicationState = {
   userMode?: UserMode | null;
   userType?: UserType | null;
   applicationPage?: ApplicationPage | null;
   applicationStatus?: ApplicationStatus | null;
};
