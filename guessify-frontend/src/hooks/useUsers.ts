import { useEffect, useState } from "preact/hooks";
import { authService } from "../services/AuthService";
import { User } from "../models/user.model";

export function useUsers() {
   const [actualUser, setActualUser] = useState<User>();
   const [users, setUsers] = useState<User[]>([]);
   useEffect(() => {
      const listener = (actualUser: User, users: User[]) => {
         setActualUser(actualUser);
         setUsers(users);
      };

      authService.addListener(listener);

      return () => authService.removeListener(listener);
   }, []);

   return { actualUser, users };
}
