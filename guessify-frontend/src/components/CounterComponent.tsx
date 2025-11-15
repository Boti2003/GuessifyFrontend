import { useEffect, useState } from "preact/hooks";

export type CounterComponentProps = {
   startTime: number;
   duration: number;
   visible: boolean;
};

export function CounterComponent({
   startTime,
   duration,
   visible,
}: CounterComponentProps) {
   const [remaining, setRemaining] = useState(() => duration);

   useEffect(() => {
      if (!startTime) return;
      console.log("Counter started:", { startTime, duration });
      const interval = setInterval(() => {
         const remainingTime = duration - (Date.now() - startTime);
         console.log("Remaining time:", remainingTime);
         setRemaining(Math.max(remainingTime, 0));
      }, 200);
      return () => clearInterval(interval);
   }, [startTime, duration]);

   return (
      <div className="self-end">
         {visible && (
            <div className="bg-base-200 rounded-xl p-4 me-2 text-4xl font-bold">
               {Math.max(0, Math.ceil(remaining / 1000))}
            </div>
         )}
      </div>
   );
}
