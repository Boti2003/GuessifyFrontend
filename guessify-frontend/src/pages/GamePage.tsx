import { ApplicationStatus } from "../enums/application_status.enum";
import { GameMode } from "../enums/game_mode.enum";
import { UserMode } from "../enums/user_mode.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { useGames } from "../hooks/useGames";
import { usePlayers } from "../hooks/usePlayers";
import { AnswerQuestionWindow } from "../windows/AnswerQuestionWindow";
import { LocalHostWindow } from "../windows/LocalHostWindow";
import { RemoteQuestionWindow } from "../windows/RemoteQuestionWindow";
import { VoteSubmittedWindow } from "../windows/VoteSubmittedWindow";
import { VotingWindow } from "../windows/VotingWindow";

export function GamePage() {
   const { actualGame } = useGames();
   const applicationState = useApplicationState();
   return (
      <div className="flex flex-col items-center w-3/4 overflow-x-hidden my-10 ">
         {actualGame?.mode === GameMode.LOCAL && (
            <div className="w-full">
               {applicationState?.userMode === UserMode.HOST && (
                  <LocalHostWindow />
               )}

               {applicationState?.userMode === UserMode.PLAYER && (
                  <AnswerQuestionWindow />
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
                     <VoteSubmittedWindow />
                  </div>
               )}
               {applicationState?.applicationStatus ===
                  ApplicationStatus.GAME_ROUND_STARTED && (
                  <div>
                     <RemoteQuestionWindow />
                  </div>
               )}
            </div>
         )}
      </div>
   );
}
