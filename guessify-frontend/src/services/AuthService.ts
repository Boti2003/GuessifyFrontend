import { LoginStatus } from "../enums/login_status.enum";
import { RefreshTokenStatus } from "../enums/refresh_token_status.enum";
import { RegisterStatus } from "../enums/register_status.enum";
import { UserType } from "../enums/user_type.enum";
import { User } from "../models/user.model";
import { applicationStateService } from "./ApplicationStateService";

class AuthService {
   private actualUser: User;

   constructor() {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
         this.fetchCurrentUser(accessToken).then((user) => {
            this.setUser(user);
         });
      } else {
         this.actualUser = null;
      }
   }

   private componentListeners: ((actualUser: User) => void)[] = [];

   addListener(listener: (actualUser: User) => void) {
      listener(this.actualUser);
      this.componentListeners.push(listener);
   }

   removeListener(listener: (actualUser: User) => void) {
      this.componentListeners = this.componentListeners.filter(
         (l) => l !== listener
      );
   }
   notifyListeners() {
      this.componentListeners.forEach((listener) => listener(this.actualUser));
   }

   async registerUser(username: string, email: string, password: string) {
      try {
         const response = await fetch(
            `https://localhost:7213/api/auth/register`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ username, email, password }),
            }
         );
         console.log("Registration response:", response);

         return RegisterStatus.SUCCESSFUL;
      } catch (error) {
         console.error("Error during registration:", error);
         return RegisterStatus.WRONG_CREDENTIALS;
      }
   }

   setUser(user: User) {
      if (!user) {
         applicationStateService.setUserType(UserType.GUEST);
         this.actualUser = null;
         this.notifyListeners();
         return;
      }
      this.actualUser = user;
      this.notifyListeners();
      applicationStateService.setUserType(UserType.REGISTERED);
   }

   async fetchCurrentUser(accessToken: string): Promise<User> {
      try {
         const userResponse = await fetch(
            `https://localhost:7213/api/user/me`,
            {
               method: "GET",
               headers: {
                  Authorization: `Bearer ${accessToken}`,
                  Accept: "application/json",
               },
            }
         );
         if (userResponse.status == 401) {
            const refreshResult = await this.refreshToken();
            if (refreshResult === RefreshTokenStatus.REFRESHED) {
               const newAccessToken = localStorage.getItem("accessToken");
               return this.fetchCurrentUser(newAccessToken);
            } else {
               return null;
            }
         } else if (!userResponse.ok) {
            return null;
         } else if (userResponse.ok) {
            const userData = await userResponse.json();
            return { displayName: userData.displayName, email: userData.email };
         }
      } catch (error) {
         console.error("Error fetching current user:", error);
         return null;
      }
   }

   async refreshToken(): Promise<RefreshTokenStatus> {
      try {
         const refreshToken = localStorage.getItem("refreshToken");
         const refreshResponse = await fetch(
            `https://localhost:7213/api/auth/refresh`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ refreshToken }),
            }
         );
         if (!refreshResponse.ok) {
            localStorage.setItem("accessToken", undefined);
            localStorage.setItem("refreshToken", undefined);
            return RefreshTokenStatus.FAILED;
         }
         const res = await refreshResponse.json();
         localStorage.setItem("accessToken", res.accessToken);
         localStorage.setItem("refreshToken", res.refreshToken);
         return RefreshTokenStatus.REFRESHED;
      } catch (error) {
         console.error("Error during token refresh:", error);
      }
   }

   async login(email: string, password: string) {
      try {
         const loginResponse = await fetch(
            `https://localhost:7213/api/auth/login`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ email, password }),
            }
         );
         if (!loginResponse.ok) {
            return LoginStatus.AUTHENTICATION_FAILED;
         }
         console.log("Login response:", loginResponse);
         const res = await loginResponse.json();
         localStorage.setItem("accessToken", res.accessToken);
         localStorage.setItem("refreshToken", res.refreshToken);
         const user = await this.fetchCurrentUser(res.accessToken);
         this.setUser(user);
         return LoginStatus.SUCCESSFUL;
      } catch (error) {
         console.error("Error during login:", error);
         return LoginStatus.AUTHENTICATION_FAILED;
      }
   }
}

export const authService = new AuthService();
