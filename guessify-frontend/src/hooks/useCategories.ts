import { useEffect, useState } from "preact/hooks";
import { CategoryGroup } from "../models/category_group.model";
import { categoryService } from "../services/CategoryService";
import { Category } from "../models/category.model";

export function useCategories() {
   const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
   const [actualCategory, setActualCategory] = useState<Category | null>(null);

   useEffect(() => {
      const listener = (
         newCategoryGroups: CategoryGroup[],
         actualCategory: Category
      ) => {
         setCategoryGroups(newCategoryGroups);
         setActualCategory(actualCategory);
      };

      categoryService.addListener(listener);

      return () => categoryService.removeListener(listener);
   }, []);

   return { actualCategory, categoryGroups };
}
