import { useState } from "preact/hooks";
import { CategoryGroupComponent } from "../components/CategoryGroupComponent";
import { useCategories } from "../hooks/useCategories";
import { CategoryComponent } from "../components/CategoryComponent";
import { BackButton } from "../components/BackButton";

export function CategoryListWindow() {
   const { categoryGroups } = useCategories();
   const [groupId, setGroupId] = useState<string | null>(null);

   /*const mockCategories = [
      { id: "1", name: "Category 1" },
      { id: "2", name: "Category 2" },
      { id: "3", name: "Category 3" },
      { id: "4", name: "Category 3" },
      { id: "5", name: "Category 3" },
      { id: "6", name: "Category 3" },
   ];*/

   return (
      <div className="max-w-full w-full">
         {groupId === null ? (
            <div className="max-w-full w-full flex flex-col items-center overflow-x-hidden">
               <h2 className="self-start text-xl md:text-2xl font-bold">
                  Choose a style
               </h2>
               <div className="overflow-x-auto w-full">
                  <div className="inline-flex items-center gap-4 min-w-max w-full  justify-center">
                     {categoryGroups.map((categoryGroup) => (
                        <div className="flex-shrink-0" key={categoryGroup.id}>
                           <CategoryGroupComponent
                              categoryGroup={categoryGroup}
                              setGroupId={setGroupId}
                           />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         ) : (
            <div className="max-w-full w-full flex flex-col items-center overflow-x-hidden p-4">
               <BackButton delegate={(e) => setGroupId(null)} />
               <h2 className="self-start text-xl md:text-2xl font-bold">
                  Choose a category
               </h2>
               <div className="overflow-x-auto w-full">
                  <div className="inline-flex items-center gap-4 min-w-max w-full  justify-center">
                     {categoryGroups
                        .find((group) => group.id === groupId)
                        ?.categories.map((category) => (
                           <div className="flex-shrink-0" key={category.id}>
                              <CategoryComponent category={category} />
                           </div>
                        ))}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
