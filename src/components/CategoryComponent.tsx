import { ApplicationStatus } from "../enums/application_status.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { Category } from "../models/category.model";
import { Player } from "../models/player.model";
import { gameService } from "../services/GameService";

export type CategoryComponentProps = {
   category: Category;
};

export function CategoryComponent({ category }: CategoryComponentProps) {
   console.log("Rendering CategoryComponent for category ID: " + category?.id);

   return (
      <div className="flex items-center p-4 justify-center min-w-32 h-40 md:w-48 md:h-40 card card-border border-3 border-secondary bg-accent text-center font-semibold shadow-sm my-2 ">
         {category !== null && (
            <div className="flex flex-col gap-4 items-center">
               <h3 className="text-accent-content backdrop-blur-sm rounded-lg font-bold text-lg mb-5">
                  {category.name}
               </h3>
               <button
                  className="btn btn-neutral"
                  onClick={(e) => gameService.startNewRound(category.id)}
               >
                  Start Round
               </button>
            </div>
         )}
      </div>
   );
}
