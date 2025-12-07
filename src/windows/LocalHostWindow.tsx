import { GameHeaderComponent } from "../components/GameHeaderComponent";
import { PLayerListComponent } from "../components/PlayerListComponent";
import { ApplicationStatus } from "../enums/application_status.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { useGames } from "../hooks/useGames";
import { CategoryListWindow } from "./CategoryGroupListWindow";
import { ShowQuestionWindow } from "./ShowQuestionWindow";

export function LocalHostWindow() {
   const { actualGame, actualRoundNumber } = useGames();
   const applicationState = useApplicationState();

   return (
      <div className="flex flex-col gap-2 items-center max-w-full overflow-x-hidden ">
         <GameHeaderComponent
            roundNumber={actualRoundNumber}
            gameName={actualGame?.name}
            totalRoundCount={actualGame?.totalRoundCount}
         />
         {applicationState?.applicationStatus === ApplicationStatus.IN_GAME && (
            <CategoryListWindow />
         )}
         {applicationState?.applicationStatus ===
            ApplicationStatus.GAME_ROUND_STARTED && <ShowQuestionWindow />}
         <div className="divider" />
         <PLayerListComponent />
      </div>
   );
}
