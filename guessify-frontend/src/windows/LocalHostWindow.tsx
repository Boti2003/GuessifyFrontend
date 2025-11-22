import { useState } from "preact/hooks";
import { GameHeaderComponent } from "../components/GameHeaderComponent";
import { PLayerListComponent } from "../components/PlayerListComponent";
import { ApplicationStatus } from "../enums/application_status.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { useGames } from "../hooks/useGames";
import { usePlayers } from "../hooks/usePlayers";
import { CategoryListWindow } from "./CategoryGroupListWindow";
import { ShowQuestionScreen } from "./ShowQuestionScreen";
import { CounterComponent } from "../components/CounterComponent";

export function LocalHostWindow() {
   const {
      actualGame,
      actualRound,
      actualRoundNumber,
      actualQuestion,
      isAnswerTime,
   } = useGames();
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
            ApplicationStatus.GAME_ROUND_STARTED && <ShowQuestionScreen />}
         <div className="divider" />
         <PLayerListComponent />
      </div>
   );
}
