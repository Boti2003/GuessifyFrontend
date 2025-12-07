import { useEffect, useState } from "preact/hooks";
import { VotingTime } from "../models/voting_time.model";
import { votingService } from "../services/VotingService";

export function useVoting() {
   const [votingTime, setVotingTime] = useState<VotingTime>(null);

   useEffect(() => {
      const listener = (votingTime: VotingTime) => {
         setVotingTime(votingTime);
      };

      votingService.addListener(listener);

      return () => votingService.removeListener(listener);
   }, []);

   return { votingTime };
}
