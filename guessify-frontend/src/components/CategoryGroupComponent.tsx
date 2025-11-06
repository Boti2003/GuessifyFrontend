import { ApplicationStatus } from "../enums/application_status.enum";
import { useApplicationState } from "../hooks/useApplicationState";
import { Category } from "../models/category.model";
import { CategoryGroup } from "../models/category_group.model";
import { Player } from "../models/player.model";

export type CategoryGroupComponentProps = {
   categoryGroup: CategoryGroup;
   setGroupId: (id: string) => void;
};

export function CategoryGroupComponent({
   categoryGroup,
   setGroupId,
}: CategoryGroupComponentProps) {
   //const { id, name, score } = player;
   console.log(
      "Rendering CategoryComponent for category ID: " + categoryGroup?.id
   );

   return (
      <div>
         <h3>{categoryGroup?.name}</h3>
         <button onClick={(e) => setGroupId(categoryGroup.id)}>
            View Categories
         </button>
      </div>
   );
}
