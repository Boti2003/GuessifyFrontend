import { useEffect, useState } from "preact/hooks";
import { useCategories } from "../hooks/useCategories";
import { categoryService } from "../services/CategoryService";
import { useVoting } from "../hooks/useVoting";
import { GameHeaderComponent } from "../components/GameHeaderComponent";
import { useGames } from "../hooks/useGames";
import { CounterComponent } from "../components/CounterComponent";
import { useApplicationState } from "../hooks/useApplicationState";
import { ApplicationStatus } from "../enums/application_status.enum";

export function VotingWindow() {
   const { categoryGroups } = useCategories();
   const { actualGame, actualRoundNumber, actualRound } = useGames();
   const [selectedCategoryId, setSelectedCategoryId] = useState("");
   const { votingTime } = useVoting();
   const applicationState = useApplicationState();

   useEffect(() => {
      setSelectedCategoryId(categoryGroups[0]?.categories[0]?.id || "");
   }, [categoryGroups]);
   return (
      <div className="flex flex-col gap-3 items-center">
         <GameHeaderComponent
            roundNumber={actualRoundNumber}
            gameName={actualGame?.name}
            totalRoundCount={actualGame?.totalRoundCount}
         />
         <div className="text-xl font-bold mb-4">
            Vote for the category you would like to play in!
         </div>
         <CounterComponent
            startTime={votingTime?.startedAt}
            duration={votingTime?.duration}
            visible={
               applicationState?.applicationStatus === ApplicationStatus.VOTING
            }
         />

         {categoryGroups?.map((group) => (
            <div className=" bg-base-200 p-4 rounded-xl w-full md:w-1/2">
               <p className="text-xl font-semibold mb-2"> {group.name}</p>

               {group.categories.map((category) => (
                  <div>
                     <input
                        className="radio radio-neutral"
                        type="radio"
                        name={category.name}
                        checked={selectedCategoryId === category.id}
                        value={category.id}
                        onChange={(e) =>
                           setSelectedCategoryId(e.currentTarget.value)
                        }
                     />
                     <label
                        className="ml-1 text-lg font-semibold"
                        for={category.name}
                     >
                        {category.name}
                     </label>
                  </div>
               ))}
            </div>
         ))}
         <button
            className="btn btn-secondary w-3/4 md:w-1/2 mt-4 text-lg font-semibold"
            onClick={(e) => {
               console.log(
                  "Submitting vote for category id: " + selectedCategoryId
               );
               categoryService.submitVote(selectedCategoryId);
            }}
         >
            Submit vote
         </button>
      </div>
   );
}
