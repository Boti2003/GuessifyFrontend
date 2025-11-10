import { LoginStatus } from "../enums/login_status.enum";
import { RefreshTokenStatus } from "../enums/refresh_token_status.enum";
import { RegisterStatus } from "../enums/register_status.enum";
import { UserType } from "../enums/user_type.enum";
import { User } from "../models/user.model";
import { applicationStateService } from "./ApplicationStateService";
import { hubService } from "./HubService";

class AuthService {
   private actualUser: User;

   constructor() {}

   async initialize() {
      const accessToken = localStorage.getItem("accessToken");
      console.log("Access Token on AuthService init:", accessToken);
      if (!accessToken) {
         this.getGuestToken().then((token) => {
            this.setupForGuest(token);
         });
      } else if (accessToken) {
         this.validateToken(accessToken).then((isValid) => {
            console.log("Is access token valid?", isValid);
            if (localStorage.getItem("isGuest") === "true") {
               console.log("User is a guest.");
               if (!isValid) {
                  this.getGuestToken().then((token) => {
                     this.setupForGuest(token);
                  });
               }
            } else {
               console.log("User is a user.");
               if (!isValid) {
                  this.refreshToken().then((result: any) => {
                     if (result.status === RefreshTokenStatus.REFRESHED) {
                        this.setupForUser(
                           result.accessToken,
                           result.refreshToken
                        );
                     } else {
                        this.getGuestToken().then((token) => {
                           this.setupForGuest(token);
                        });
                     }
                  });
               } else {
                  this.fetchCurrentUser(accessToken).then((user) => {
                     this.setUser(user);
                  });
               }
            }
         });
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

         if (!userResponse.ok) {
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
      const user = await this.fetchCurrentUser(accessToken);
      this.setUser(user);
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
