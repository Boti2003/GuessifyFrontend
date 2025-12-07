import { BackButton } from "../components/BackButton";
import { LeaderBoardComponent } from "../components/LeaderBoardComponent";
import { ApplicationPage } from "../enums/application_page.enum";
import { UserType } from "../enums/user_type.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { useUsers } from "../hooks/useUsers";
import { applicationStateService } from "../services/ApplicationStateService";

export function LeaderboardPage() {
   const { actualUser, users } = useUsers();
   const applicationState = useApplicationState();

   const userLeaderBoardElements = users.map((user) => ({
      displayName: user.displayName,
      score: user.sumScore,
      rank: user.rank,
   }));
   return (
      <div className="flex flex-col items-center mt-8">
         <BackButton
            delegate={(e) =>
               applicationStateService.setApplicationPage(
                  ApplicationPage.MAIN_PAGE
               )
            }
         />
         <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
         <div className="flex flex-col md:flex-row gap-3 md:gap-6">
            <div className="bg-base-200 p-6 rounded-lg min-w-70">
               {applicationState?.userType === UserType.REGISTERED ? (
                  <div>
                     <h2 className="text-2xl font-semibold mb-4">
                        Hi {actualUser.displayName}! <br />
                        Your stats:
                     </h2>
                     <p className="mb-2">Rank: {actualUser?.rank}</p>
                     <p className="mb-2">Total Score: {actualUser?.sumScore}</p>
                  </div>
               ) : (
                  <div>
                     <h2 className="text-2xl font-semibold mb-4">
                        Log in to see your stats!
                     </h2>
                  </div>
               )}
            </div>
            {userLeaderBoardElements.length > 0 && (
               <LeaderBoardComponent
                  leaderBoardElements={userLeaderBoardElements}
               />
            )}
         </div>
      </div>
   );
}
