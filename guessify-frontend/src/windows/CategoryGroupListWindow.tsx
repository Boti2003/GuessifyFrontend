import { useState } from "preact/hooks";
import { CategoryGroupComponent } from "../components/CategoryGroupComponent";
import { useCategories } from "../hooks/useCategories";
import { CategoryComponent } from "../components/CategoryComponent";

export function CategoryListWindow() {
   const { categoryGroups } = useCategories();
   const [groupId, setGroupId] = useState<string | null>(null);

   return (
      <div>
         {groupId === null ? (
            <div>
               <h2>Choose a style</h2>
               {categoryGroups.map((categoryGroup) => (
                  <CategoryGroupComponent
                     categoryGroup={categoryGroup}
                     setGroupId={setGroupId}
                  />
               ))}
            </div>
         ) : (
            <div>
               <button onClick={(e) => setGroupId(null)}>Back to Styles</button>
               <h2>Choose a category</h2>
               {categoryGroups
                  .find((group) => group.id === groupId)
                  ?.categories.map((category) => (
                     <CategoryComponent category={category} />
                  ))}
            </div>
         )}
      </div>
   );
}
