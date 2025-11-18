import { GameHeaderComponent } from "../components/GameHeaderComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { PLayerListComponent } from "../components/PlayerListComponent";
import { ApplicationStatus } from "../enums/application_status.enum";
import { GameMode } from "../enums/game_mode.enum";
import { UserMode } from "../enums/user_mode.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { useGames } from "../hooks/useGames";
import { usePlayers } from "../hooks/usePlayers";
import { AnswerQuestionScreen } from "../windows/AnswerQuestionScreen";
import { CategoryListWindow } from "../windows/CategoryGroupListWindow";
import { LocalHostWindow } from "../windows/LocalHostWindow";
import { RemoteQuestionScreen } from "../windows/RemoteQuestionScreen";
import { ShowQuestionScreen } from "../windows/ShowQuestionScreen";
import { VoteSubmittedPage } from "../windows/VoteSubmittedPage";
import { VotingWindow } from "../windows/VotingWindow";

export function GamePage() {
   const { players, actualPlayer } = usePlayers();
   const { actualGame, actualRound } = useGames();
   const applicationState = useApplicationState();
   return (
      <div className="flex flex-col items-center w-3/4 overflow-x-hidden my-10 ">
         {actualGame?.mode === GameMode.LOCAL && (
            <div className="w-full">
               {applicationState?.userMode === UserMode.HOST && (
                  <LocalHostWindow />
               )}

               {applicationState?.userMode === UserMode.PLAYER && (
                  <AnswerQuestionScreen />
               )}
            </div>
         )}
         {actualGame?.mode === GameMode.REMOTE && (
            <div>
               {applicationState?.applicationStatus ===
                  ApplicationStatus.VOTING && (
                  <div>
                     <VotingWindow />
                  </div>
               )}
               {applicationState?.applicationStatus ===
                  ApplicationStatus.VOTED && (
                  <div>
                     <VoteSubmittedPage />
                  </div>
               )}
               {applicationState?.applicationStatus ===
                  ApplicationStatus.GAME_ROUND_STARTED && (
                  <div>
                     <RemoteQuestionScreen />
                  </div>
               )}
            </div>
         )}
      </div>
   );
}
