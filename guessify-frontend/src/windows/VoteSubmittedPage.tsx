import { useCategories } from "../hooks/useCategories";

export function VoteSubmittedPage() {
   const { actualCategory } = useCategories();
   return (
      <div class="vote-submitted-page">
         <h2>Your vote has been submitted!</h2>
         {actualCategory === null ? (
            <p>Waiting for other players to submit their votes...</p>
         ) : (
            <p>The chosen category is: {actualCategory.name}</p>
         )}
      </div>
   );
}
