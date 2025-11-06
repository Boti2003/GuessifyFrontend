import { ApplicationStatus } from "../enums/application_status.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { Category } from "../models/category.model";
import { Player } from "../models/player.model";
import { gameService } from "../services/GameService";

export type CategoryComponentProps = {
   category: Category;
};

export function CategoryComponent({ category }: CategoryComponentProps) {
   //const { id, name, score } = player;
   console.log("Rendering CategoryComponent for category ID: " + category?.id);
   const applicationState = useApplicationState();
   return (
      <div>
         {category !== null && (
            <div>
               <h3>{category.name}</h3>
               <button onClick={(e) => gameService.startNewRound(category.id)}>
                  Select Category
               </button>
            </div>
         )}
      </div>
   );
}
