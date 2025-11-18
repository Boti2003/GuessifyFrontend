import { ApplicationPage } from "../enums/application_page.enum";
import { UserType } from "../enums/user_type.enum";
import { useUsers } from "../hooks/useUsers";
import { useApplicationState } from "../hooks/useApplicationState";
import { applicationStateService } from "../services/ApplicationStateService";
import { authService } from "../services/AuthService";
import { ThemeToggle } from "./ThemeToggle";

export function NavBarComponent() {
   const applicationState = useApplicationState();
   const { actualUser, users } = useUsers();
   return (
      <div className="navbar bg-base-200 shadow-sm fixed top-0 z-1">
         <div className="flex-1">
            <a
               className="btn btn-ghost text-l "
               onClick={(e) => {
                  applicationStateService.setApplicationPage(
                     ApplicationPage.MAIN_PAGE
                  );
               }}
            >
               Guessify
            </a>
         </div>
         <div className="flex gap-1">
            <ThemeToggle />
            <div className="dropdown dropdown-end">
               {applicationState?.userType === UserType.GUEST ? (
                  <a
                     className="btn btn-ghost"
                     onClick={(e) => {
                        applicationStateService.setApplicationPage(
                           ApplicationPage.LOGIN_PAGE
                        );
                     }}
                  >
                     Login
                  </a>
               ) : (
                  <div>
                     <div tabIndex={0} role="button" className="btn btn-ghost">
                        <a className="text-l text-semibold">
                           Hi {actualUser?.displayName}!
                        </a>
                     </div>
                     <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-2 mt-3 w-40 p-2 shadow"
                     >
                        <li>
                           <a
                              onClick={() => {
                                 authService.logout();
                              }}
                           >
                              Logout
                           </a>
                        </li>
                     </ul>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
