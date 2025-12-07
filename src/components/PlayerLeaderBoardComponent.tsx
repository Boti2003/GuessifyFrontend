import { LeaderBoardElement } from "../models/leader_board_element.model";
import { PlayerRank } from "../models/player_rank.model";

export type PlayerLeaderBoardComponentProps = {
   leaderBoardElement: LeaderBoardElement;
};

export function PlayerLeaderBoardComponent({
   leaderBoardElement,
}: PlayerLeaderBoardComponentProps) {
   return (
      <div className="flex items-center w-70 justify-between p-3 bg-base-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-base-200">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-content font-bold">
               {leaderBoardElement?.rank}.
            </div>
            <span className="font-medium">
               {leaderBoardElement?.displayName}
            </span>
         </div>
         <span className="max-ml-25 mr-2 ">{leaderBoardElement?.score}</span>
      </div>
   );
}
