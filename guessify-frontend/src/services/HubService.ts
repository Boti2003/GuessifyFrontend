import * as signalR from "@microsoft/signalr";
import { lobbyService } from "./LobbyService";
import { authService } from "./AuthService";
import { User } from "../models/user.model";
import { playerService } from "./PlayerService";
import { categoryService } from "./CategoryService";
import { gameService } from "./GameService";
import { register } from "module";
import { votingService } from "./VotingService";

class HubService {
   lobbyConnection: any;
   gameConnection: any;
   constructor() {
      authService.initialize().then(() => {
         this.lobbyConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7213/lobbyhub", {
               accessTokenFactory: () => authService.getAccessToken(),
            })
            .withAutomaticReconnect()
            .build();
         this.gameConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7213/gamehub", {
               accessTokenFactory: () => authService.getAccessToken(),
            })
            .withAutomaticReconnect()
            .build();
         this.lobbyConnection.start().then(() => {
            console.log("Lobby hub connected");
            this.registerLobbyConnections();
         });
         this.gameConnection.start().then(() => {
            console.log("Game hub connected");
            this.registerGameConnections();
         });
      });
   }

   registerLobbyConnections() {
      lobbyService.initialize();
      playerService.registerLobbyConnections();
   }

   registerGameConnections() {
      votingService.registerGameConnections();
      gameService.registerGameConnections();
      playerService.registerGameConnections();
   }

   /*if (authService.getActualUser()) {
            this.reconnectLobbyHub();
            console.log("Reconnecting lobby hub for logged in user");
         }
         authService.addListener((actualUser: User) => {
            console.log("AuthService listener triggered in HubService");
            if (actualUser) {
               console.log(
                  "AuthService listener with user triggered in HubService",
                  actualUser
               );
               this.reconnectLobbyHub();
            } else {
               console.log(
                  "AuthService listener without triggered in HubService",
                  actualUser
               );
               this.setLobbyHubToStartingPoint();
            }
         });*/

   async reconnectLobbyHub() {
      const token = authService.getAccessToken();
      if (token) {
         await this.lobbyConnection.stop();

         this.lobbyConnection = await new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7213/lobbyhub", {
               accessTokenFactory: () => authService.getAccessToken(),
            })
            .withAutomaticReconnect()
            .build();

         await this.lobbyConnection.start().then(() => {
            this.registerLobbyConnections();
         });
      }
   }

   async reconnectGameHub() {
      const token = authService.getAccessToken();
      if (token) {
         await this.gameConnection.stop();

         this.gameConnection = await new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7213/gamehub", {
               accessTokenFactory: () => authService.getAccessToken(),
            })
            .withAutomaticReconnect()
            .build();

         await this.gameConnection.start().then(() => {
            this.registerGameConnections();
         });
      }
   }

   async setLobbyHubToStartingPoint() {
      await this.lobbyConnection.stop();
      this.lobbyConnection = await new signalR.HubConnectionBuilder()
         .withUrl("https://localhost:7213/lobbyhub")
         .build();

      await this.lobbyConnection
         .start()
         .then(() => lobbyService.fetchLobbies());
   }
}

export const hubService = new HubService();
