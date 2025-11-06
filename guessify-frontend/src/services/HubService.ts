import * as signalR from "@microsoft/signalr";
import { lobbyService } from "./LobbyService";

class HubService {
   lobbyConnection: any;
   gameConnection: any;
   constructor() {
      this.lobbyConnection = new signalR.HubConnectionBuilder()
         .withUrl("https://localhost:7213/lobbyhub")
         .build();
      this.gameConnection = new signalR.HubConnectionBuilder()
         .withUrl("https://localhost:7213/gamehub")
         .build();
      this.lobbyConnection.start().then(() => {
         console.log("Lobby hub connected");
         lobbyService.fetchLobbies();
      });
      this.gameConnection.start().then(() => {
         console.log("Game hub connected");
      });
   }
}

export const hubService = new HubService();
