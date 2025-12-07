import { LoginStatus } from "../enums/login_status.enum";
import { RefreshTokenStatus } from "../enums/refresh_token_status.enum";
import { RegisterStatus } from "../enums/register_status.enum";
import { UserType } from "../enums/user_type.enum";
import { User } from "../models/user.model";
import { applicationStateService } from "./ApplicationStateService";
import { hubService } from "./HubService";

class AuthService {
   private actualUser: User;
   private users: User[] = [];

   constructor() {}

   async initialize() {
      const accessToken = localStorage.getItem("accessToken");
      console.log("Access Token on AuthService init:", accessToken);
      if (!accessToken) {
         const token = await this.getGuestToken();
         this.setupForGuest(token);
      } else if (accessToken) {
         const isValid = await this.validateToken(accessToken);
         console.log("Is access token valid?", isValid);
         if (localStorage.getItem("isGuest") === "true") {
            console.log("User is a guest.");
            if (!isValid) {
               const token = await this.getGuestToken();
               this.setupForGuest(token);
            }
         } else {
            console.log("User is a user.");
            if (!isValid) {
               const result = await this.refreshToken();
               if (result.status === RefreshTokenStatus.REFRESHED) {
                  await this.setupForUser(
                     result.accessToken,
                     result.refreshToken
                  );
               } else {
                  const token = await this.getGuestToken();
                  this.setupForGuest(token);
               }
            } else {
               await this.fetchCurrentUser();
            }
         }
      }
   }

   private componentListeners: ((actualUser: User, users: User[]) => void)[] =
      [];

   addListener(listener: (actualUser: User, users: User[]) => void) {
      listener(this.actualUser, this.users);
      this.componentListeners.push(listener);
   }

   removeListener(listener: (actualUser: User, users: User[]) => void) {
      this.componentListeners = this.componentListeners.filter(
         (l) => l !== listener
      );
   }
   notifyListeners() {
      this.componentListeners.forEach((listener) =>
         listener(this.actualUser, this.users)
      );
   }

   async registerUser(email: string, username: string, password: string) {
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
         if (!response.ok) {
            return RegisterStatus.WRONG_CREDENTIALS;
         }
         await this.login(email, password);
         return RegisterStatus.SUCCESSFUL;
      } catch (error) {
         console.error("Error during registration:", error);
         return RegisterStatus.WRONG_CREDENTIALS;
      }
   }

   setUser(user: User) {
      if (user) {
         this.actualUser = user;
         this.notifyListeners();
         applicationStateService.setUserType(UserType.REGISTERED);
      } else {
         this.actualUser = null;
         this.notifyListeners();
         applicationStateService.setUserType(UserType.GUEST);
         return;
      }
   }

   async fetchCurrentUser(): Promise<User> {
      try {
         const token = this.getAccessToken();
         const userResponse = await fetch(
            `https://localhost:7213/api/user/me`,
            {
               method: "GET",
               headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
               },
            }
         );

         if (!userResponse.ok) {
            return null;
         } else if (userResponse.ok) {
            const userData = await userResponse.json();
            this.setUser({
               displayName: userData.displayName,
               sumScore: userData.sumScore,
               rank: userData.rank,
            });
            return {
               displayName: userData.displayName,
               sumScore: userData.sumScore,
               rank: userData.rank,
            };
         }
      } catch (error) {
         console.error("Error fetching current user:", error);
         return null;
      }
   }

   async refreshToken(): Promise<{
      status: RefreshTokenStatus;
      accessToken?: string;
      refreshToken?: string;
   }> {
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
            return {
               status: RefreshTokenStatus.FAILED,
               accessToken: null,
               refreshToken: null,
            };
         }
         const res = await refreshResponse.json();

         return {
            status: RefreshTokenStatus.REFRESHED,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
         };
      } catch (error) {
         console.error("Error during token refresh:", error);
      }
   }

   async setupForUser(accessToken: string, refreshToken: string) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("isGuest", "false");
      await this.fetchCurrentUser();
   }

   setupForGuest(accessToken: string) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("isGuest", "true");
      localStorage.removeItem("refreshToken");
      this.setUser(null);
   }

   async getGuestToken(): Promise<string> {
      try {
         const response = await fetch(
            `https://localhost:7213/api/auth/guest-token`,
            {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );
         if (response.status !== 200) {
            throw new Error("Failed to fetch guest token");
         }
         const res = await response.json();
         return res.accessToken;
      } catch (error) {
         console.error("Error fetching guest token:", error);
         return null;
      }
   }

   async validateToken(accessToken: string): Promise<boolean> {
      try {
         const response = await fetch(
            `https://localhost:7213/api/auth/validate-token`,
            {
               method: "GET",
               headers: {
                  Authorization: `Bearer ${accessToken}`,
                  Accept: "application/json",
               },
            }
         );
         return response.ok;
      } catch (error) {
         console.error("Error validating token:", error);
         return false;
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
         await this.setupForUser(res.accessToken, res.refreshToken);
         await hubService.reconnectLobbyHub();
         await hubService.reconnectGameHub();
         return LoginStatus.SUCCESSFUL;
      } catch (error) {
         console.error("Error during login:", error);
         return LoginStatus.AUTHENTICATION_FAILED;
      }
   }

   async getScoreboard(): Promise<User[]> {
      try {
         const accessToken = this.getAccessToken();
         const response = await fetch(
            `https://localhost:7213/api/user/scores`,
            {
               method: "GET",
               headers: {
                  Authorization: `Bearer ${accessToken}`,
                  Accept: "application/json",
               },
            }
         );
         if (!response.ok) {
            console.error("Failed to fetch scoreboard:", response.status);
            return [];
         }
         const scoreboardData = await response.json();
         const scoresBoard = scoreboardData.map(
            (userData: any) =>
               ({
                  displayName: userData.displayName,
                  sumScore: userData.sumScore,
                  rank: userData.rank,
               } as User)
         );
         this.users = scoresBoard;
         this.notifyListeners();
         return scoresBoard;
      } catch (error) {
         console.error("Error fetching scoreboard:", error);
         return [];
      }
   }

   async logout() {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await fetch(`https://localhost:7213/api/auth/logout`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getAccessToken()}`,
         },
         body: JSON.stringify({
            refreshToken,
         }),
      });
      if (response.ok) {
         console.log("Logout successful on server.");
         const accessToken = await this.getGuestToken();
         this.setupForGuest(accessToken);
         await hubService.reconnectLobbyHub();
         await hubService.reconnectGameHub();
      }
   }

   getAccessToken(): string {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
         return null;
      }
      return accessToken;
   }

   getActualUser(): User {
      return this.actualUser;
   }
}

export const authService = new AuthService();
