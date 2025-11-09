import { useEffect, useState } from "preact/hooks";
import { authService } from "../services/AuthService";
import { User } from "../models/user.model";

export function useActualUser() {
   const [actualUser, setActualUser] = useState<User>();
   useEffect(() => {
      const listener = (actualUser: User) => {
         setActualUser(actualUser);
      };

      authService.addListener(listener);

      return () => authService.removeListener(listener);
   }, []);

   return actualUser;
}
