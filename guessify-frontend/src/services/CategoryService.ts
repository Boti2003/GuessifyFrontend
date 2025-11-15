import { ApplicationStatus } from "../enums/application_status.enum";
import { Category } from "../models/category.model";
import { CategoryGroup } from "../models/category_group.model";
import { Player } from "../models/player.model";
import { applicationStateService } from "./ApplicationStateService";
import { gameService } from "./GameService";
import { hubService } from "./HubService";

class CategoryService {
   private chosenCategory: Category;
   private categoryGroups: CategoryGroup[] = [];

   private componentListeners: ((
      categoryGroups: CategoryGroup[],
      chosenCategory: Category
   ) => void)[] = [];

   constructor() {}

   submitVote(categoryId: string) {
      console.log("Submitting vote for category ID:", categoryId);
      console.log("Current game ID:", gameService.getGame().id);
      hubService.gameConnection
         .invoke("RegisterVote", gameService.getGame().id, categoryId)
         .then(() => {
            console.log("Vote submitted for category ID:", categoryId);
            applicationStateService.setApplicationStatus(
               ApplicationStatus.VOTED
            );
         })
         .catch((err) => {
            console.error("Error submitting vote:", err);
         });
   }

   addListener(
      listener: (
         categoryGroups: CategoryGroup[],
         choosenCategory: Category
      ) => void
   ) {
      listener(this.categoryGroups, this.chosenCategory);
      this.componentListeners.push(listener);
   }
   removeListener(
      listener: (
         categoryGroups: CategoryGroup[],
         choosenCategory: Category
      ) => void
   ) {
      this.componentListeners = this.componentListeners.filter(
         (l) => l !== listener
      );
   }
   notifyListeners() {
      this.componentListeners.forEach((listener) =>
         listener(this.categoryGroups, this.chosenCategory)
      );
   }

   getCategoryGroups() {
      hubService.gameConnection
         .invoke("GetCategoryGroups")
         .then((categoryGroups: CategoryGroup[]) => {
            console.log("Fetched category groups:", categoryGroups);
            this.categoryGroups = categoryGroups;
            this.notifyListeners();
         });
   }

   setChosenCategory(category: Category) {
      this.chosenCategory = category;
      this.notifyListeners();
   }
}

export const categoryService = new CategoryService();
