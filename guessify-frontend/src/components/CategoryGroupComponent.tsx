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
      <div
         onClick={() => setGroupId(categoryGroup.id)}
         className="flex items-center justify-center w-32 h-24 md:w-48 md:h-40 card card-border border-3 border-secondary bg-warning text-center font-semibold shadow-sm my-2 hover:shadow-md transition-all duration-200 cursor-pointer"
      >
         <h3 className="text-warning-content backdrop-blur-sm rounded-lg font-bold text-lg flex items-center justify-center">
            {categoryGroup?.name}
         </h3>
      </div>
   );
}
