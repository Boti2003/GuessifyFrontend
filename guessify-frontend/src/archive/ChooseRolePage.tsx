import { ApplicationMode } from "../enums/application_mode.enum";

export type ChooseRolePageProps = {
   stepBack: (mode: ApplicationMode) => void;
};

export function ChooseRolePage({ stepBack }: ChooseRolePageProps) {
   return (
      <div>
         <button onClick={(e) => stepBack(null)}>Back</button>
         <h1>Choose Role Page</h1>
         <button>Host</button>
         <button>Player</button>
      </div>
   );
}
