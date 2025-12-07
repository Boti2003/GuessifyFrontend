import { LeaderBoardElement } from "../models/leader_board_element.model";
import { PlayerRank } from "../models/player_rank.model";
import { PlayerLeaderBoardComponent } from "./PlayerLeaderBoardComponent";

export type LeaderBoardComponentProps = {
   leaderBoardElements: LeaderBoardElement[];
   heightClass?: string;
};

export function LeaderBoardComponent({
   leaderBoardElements,
   heightClass,
}: LeaderBoardComponentProps) {
   return (
      <div
         className={`flex overflow-y-auto flex-col gap-4 ${
            heightClass ?? "h-64"
         } p-4 bg-base-200 rounded-2xl`}
      >
         {leaderBoardElements?.map((lbe) => (
            <PlayerLeaderBoardComponent leaderBoardElement={lbe} />
         ))}
      </div>
   );
}
