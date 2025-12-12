import * as signalR from "@microsoft/signalr";
import { lobbyService } from "./LobbyService";
import { authService } from "./AuthService";
import { playerService } from "./PlayerService";
import { gameService } from "./GameService";
import { votingService } from "./VotingService";
import { toastService } from "./ToastService";

class HubService {
   lobbyConnection: any;
   gameConnection: any;
   constructor() {}

   async initializeConnections() {
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
      this.lobbyConnection.on("ExceptionThrown", (message: string) => {
         console.error("Exception from server:", message);
         toastService.showErrorToast("Unknown error occurred");
      });
      lobbyService.initialize();
      playerService.registerLobbyConnections();
   }

   registerGameConnections() {
      this.gameConnection.on("ExceptionThrown", (message: string) => {
         console.error("Exception from server:", message);
         toastService.showErrorToast("Unknown error occurred");
      });
      votingService.registerGameConnections();
      gameService.registerGameConnections();
      playerService.registerGameConnections();
   }

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
