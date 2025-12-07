import { LeaderBoardElement } from "../models/leader_board_element.model";

export type PodiumComponentProps = {
   topPlayers: LeaderBoardElement[];
};

export function PodiumComponent({ topPlayers }: PodiumComponentProps) {
   const maxScore = Math.max(...topPlayers?.map((p) => p?.score));
   const maxHeight = 200;

   const positions = topPlayers
      ? topPlayers?.length == 2
         ? [topPlayers?.[0], topPlayers?.[1]]
         : [topPlayers?.[1], topPlayers?.[0], topPlayers?.[2]]
      : [];
   const colors = ["bg-warning", "bg-error", "bg-info"];

   return (
      <div className="flex items-end justify-center gap-6 w-90 h-75 p-6 bg-base-200 rounded-2xl">
         {positions.map((p, i) => {
            const height = (p?.score / maxScore) * maxHeight;

            return (
               <div key={p?.displayName} className="flex flex-col items-center">
                  <div className="text-sm text-accent mb-2">{p?.score}</div>
                  <div
                     className={`${
                        colors[p?.rank - 1]
                     } w-20 rounded-t-lg flex items-center justify-center text-white font-bold text-xl transition-all duration-500`}
                     style={{ height: `${height}px` }}
                  >
                     {p?.rank}
                  </div>
                  <div className="mt-2 text-lg font-semibold">
                     {p?.displayName}
                  </div>
               </div>
            );
         })}
      </div>
   );
}
