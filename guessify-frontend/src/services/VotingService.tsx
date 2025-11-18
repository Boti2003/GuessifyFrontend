import { ApplicationStatus } from "../enums/application_status.enum";
import { Category } from "../models/category.model";
import { VotingTime } from "../models/voting_time.model";
import { applicationStateService } from "./ApplicationStateService";
import { categoryService } from "./CategoryService";
import { hubService } from "./HubService";

class VotingService {
   private votingTime: VotingTime;

   private componentListeners: ((votingTime: VotingTime) => void)[] = [];

   constructor() {}

   registerGameConnections() {
      hubService.gameConnection.on(
         "ReceiveVotingStarted",
         (votingTime: VotingTime) => {
            applicationStateService.setApplicationStatus(
               ApplicationStatus.VOTING
            );
            categoryService.setChosenCategory(null);
            console.log("Voting started:", votingTime);
            this.votingTime = votingTime;
            this.notifyListeners();
         }
      );
      hubService.gameConnection.on(
         "ReceiveVotingEnded",
         (chosenCategory: Category) => {
            console.log("Voting ended. Chosen category:", chosenCategory);
            categoryService.setChosenCategory(chosenCategory);
            applicationStateService.setApplicationStatus(
               ApplicationStatus.VOTED
            );
            this.notifyListeners();
         }
      );
   }

   addListener(listener: (votingTime: VotingTime) => void) {
      listener(this.votingTime);
      this.componentListeners.push(listener);
   }

   removeListener(listener: (votingTime: VotingTime) => void) {
      this.componentListeners = this.componentListeners.filter(
         (l) => l !== listener
      );
   }

   notifyListeners() {
      this.componentListeners.forEach((listener) => listener(this.votingTime));
   }
}

export const votingService = new VotingService();
