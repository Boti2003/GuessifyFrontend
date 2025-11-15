import { useCategories } from "../hooks/useCategories";

export function VoteSubmittedPage() {
   const { actualCategory } = useCategories();
   return (
      <div className="flex flex-col items-center">
         <h2 className="text-2xl text-center font-bold">
            Your vote has been submitted!
         </h2>
         {actualCategory === null ? (
            <p className="text-xl text-center font-semibold">
               Waiting for other players to submit their votes...
            </p>
         ) : (
            <div>
               <p className="text-xl font-bold">The chosen category is:</p>
               <p className="bg-base-200 rounded-xl text-center font-semibold text-lg p-4">
                  {actualCategory.name}
               </p>
            </div>
         )}
      </div>
   );
}
