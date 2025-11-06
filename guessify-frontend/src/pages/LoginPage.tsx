import { ApplicationMode } from "../enums/application_mode.enum";

export type LoginPageProps = {
   stepBack: (mode: ApplicationMode) => void;
};

export function LoginPage({ stepBack }: LoginPageProps) {
   return (
      <div>
         <button onClick={(e) => stepBack(null)}>Back</button>
         <h1>Login Page</h1>
      </div>
   );
}
