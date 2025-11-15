export type GameHeaderProps = {
   roundNumber: number;
   gameName: string;
   totalRoundCount: number;
};

export function GameHeaderComponent({
   roundNumber,
   gameName,
   totalRoundCount,
}: GameHeaderProps) {
   return (
      <div className="w-full flex flex-col items-center ">
         <h1 className="text-2xl md:text-3xl font-bold ">Game: {gameName}</h1>
         <p className="text-lg md:text-xl font-semibold">
            Rounds: {roundNumber ?? "1"}/{totalRoundCount}
         </p>
         <div className="divider " />
      </div>
   );
}
