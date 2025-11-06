import { PlayerComponent } from "../components/PlayerComponent";
import { ApplicationStatus } from "../enums/application_status.enum";
import { GameMode } from "../enums/game_mode.enum";
import { UserMode } from "../enums/user_mode.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { useGames } from "../hooks/useGames";
import { usePlayers } from "../hooks/usePlayers";
import { AnswerQuestionScreen } from "../windows/AnswerQuestionScreen";
import { CategoryListWindow } from "../windows/CategoryGroupListWindow";
import { RemoteQuestionScreen } from "../windows/RemoteQuestionScreen";
import { ShowQuestionScreen } from "../windows/ShowQuestionScreen";
import { VoteSubmittedPage } from "../windows/VoteSubmittedPage";
import { VotingWindow } from "../windows/VotingWindow";

export function GamePage() {
   const { players, actualPlayer } = usePlayers();
   const { actualGame, actualRound } = useGames();
   const applicationState = useApplicationState();
   return (
      <div>
         {actualGame?.mode === GameMode.LOCAL && (
            <div>
               {applicationState?.userMode === UserMode.HOST && (
                  <div>
                     <h1>Game: {actualGame?.name}</h1>
                     {applicationState?.applicationStatus ===
                        ApplicationStatus.IN_GAME && (
                        <div>
                           <p>
                              Rounds: {actualRound?.roundNumber ?? "1"}/
                              {actualGame?.totalRoundCount}
                           </p>
                           <CategoryListWindow />
                        </div>
                     )}
                     {applicationState?.applicationStatus ===
                        ApplicationStatus.GAME_ROUND_STARTED && (
                        <div>
                           <ShowQuestionScreen />
                        </div>
                     )}
                     {players.map((player) => (
                        <PlayerComponent player={player} actualPlayer={false} />
                     ))}
                  </div>
               )}
               {applicationState?.userMode === UserMode.PLAYER && (
                  <div>
                     <h1>Game: {actualGame?.name}</h1>
                     <AnswerQuestionScreen />
                  </div>
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
