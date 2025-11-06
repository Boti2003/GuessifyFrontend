import { useEffect, useState } from "preact/hooks";
import { useCategories } from "../hooks/useCategories";
import { categoryService } from "../services/CategoryService";

export function VotingWindow() {
   const { categoryGroups } = useCategories();
   const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

   useEffect(() => {
      setSelectedCategoryId(categoryGroups[0]?.categories[0]?.id || "");
   }, [categoryGroups]);
   return (
      <div>
         <div>Vote for the category you would like to play in!</div>;
         {categoryGroups?.map((group) => (
            <div>
               <div>{group.name}</div>
               <div>
                  {group.categories.map((category) => (
                     <div>
                        <input
                           type="radio"
                           name={category.name}
                           checked={selectedCategoryId === category.id}
                           value={category.id}
                           onChange={(e) =>
                              setSelectedCategoryId(e.currentTarget.value)
                           }
                        />
                        <label for={category.name}>{category.name}</label>
                     </div>
                  ))}
               </div>
            </div>
         ))}
         <button
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
