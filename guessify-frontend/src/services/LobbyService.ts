import { ApplicationPage } from "../enums/application_page.enum";
import { ApplicationStatus } from "../enums/application_status.enum";
import { GameMode } from "../enums/game_mode.enum";
import { JoinStatus } from "../enums/join_status.enum";
import { UserMode } from "../enums/user_mode.enum";
import { Game } from "../models/game.model";
import { Lobby } from "../models/lobby.model";
import { applicationStateService } from "./ApplicationStateService";
import { hubService } from "./HubService";
import { playerService } from "./PlayerService";

class LobbyService {
   actualLobby: Lobby;
   private joinStatus: JoinStatus;
   lobbies: Lobby[] = [];

   private lobbyListeners: ((
      lobbies: Lobby[],
      lobby: Lobby,
      joinStatus: JoinStatus
   ) => void)[] = [];

   constructor() {}

   initialize() {
      this.registerLobbyConnections();
      this.fetchLobbies();
   }

   registerLobbyConnections() {
      hubService.lobbyConnection.on("ReceiveLobbies", (lobbies: Lobby[]) => {
         this.lobbies = lobbies;
         console.log("Lobbies updated:", this.lobbies);
         this.notifyListeners();
      });
      hubService.lobbyConnection.on("ReceiveHostDisconnectedFromLobby", () => {
         console.log("Host disconnected from lobby.");
         this.actualLobby = null;
         this.notifyListeners();
         applicationStateService.setApplicationPage(
            ApplicationPage.HOST_DISCONNECTED_PAGE
         );
         applicationStateService.setApplicationStatus(null);
      });
   }

   async fetchLobbies() {
      this.lobbies = await hubService.lobbyConnection.invoke("GetLobbies");
      this.notifyListeners();
   }

   private notifyListeners() {
      this.lobbyListeners.forEach((listener) =>
         listener(this.lobbies, this.actualLobby, this.joinStatus)
      );
   }

   addListener(
      listener: (lobbies: Lobby[], lobby: Lobby, joinStatus: JoinStatus) => void
   ) {
      listener(this.lobbies, this.actualLobby, this.joinStatus);
      this.lobbyListeners.push(listener);
   }

   removeListener(
      listener: (lobbies: Lobby[], lobby: Lobby, joinStatus: JoinStatus) => void
   ) {
      this.lobbyListeners = this.lobbyListeners.filter((l) => l !== listener);
   }

   async createLobby(
      lobbyName: string,
      capacity: number,
      gameMode: GameMode,
      totalRoundCount: number
   ) {
      console.log(
         "Creating lobby with name:",
         lobbyName,
         "capacity:",
         capacity,
         "gameMode:",
         gameMode,
         "totalRoundCount:",
         totalRoundCount
      );
      hubService.lobbyConnection
         .invoke("CreateLobby", lobbyName, capacity, gameMode, totalRoundCount)
         .then((lobby: Lobby) => {
            this.actualLobby = lobby;
            console.log("Lobby created with ID: " + lobby);
            playerService.setIsHost(true);
            this.notifyListeners();
         });

      applicationStateService.setUserMode(UserMode.HOST);
      applicationStateService.setApplicationStatus(ApplicationStatus.IN_LOBBY);
      applicationStateService.setApplicationPage(ApplicationPage.LOBBY_PAGE);
   }

   async startGameAndAbandonLobby(gameId: string) {
      await hubService.lobbyConnection.invoke(
         "StartGame",
         this.actualLobby.id,
         gameId
      );
      this.actualLobby = null;
      this.notifyListeners();
   }

   async joinLobby(lobbyId: string, playerName?: string): Promise<JoinStatus> {
      console.log("Attempting to join lobby with ID: " + lobbyId);
      const joinStatusDto = await hubService.lobbyConnection.invoke(
         "JoinLobby",
         lobbyId,
         playerName
      );
      this.joinStatus = joinStatusDto.joinStatus;
      console.log("Join lobby response:", joinStatusDto);
      if (joinStatusDto.joinStatus === JoinStatus.SUCCESS) {
         this.actualLobby = this.lobbies.find((lobby) => lobby.id === lobbyId);
         this.notifyListeners();
         console.log("Joined lobby with ID: " + lobbyId);
         console.log("Assigned player ID: " + joinStatusDto.playerId);
         playerService.setPlayer(joinStatusDto.player);

         await hubService.lobbyConnection.invoke(
            "RefreshPlayersInLobby",
            lobbyId
         );
         applicationStateService.setUserMode(UserMode.PLAYER);
         applicationStateService.setApplicationStatus(
            ApplicationStatus.IN_LOBBY
         );
         applicationStateService.setApplicationPage(ApplicationPage.LOBBY_PAGE);
      }
      return joinStatusDto;
   }

   async joinLobbyWithCode(connectionCode: string, playerName: string) {
      const joinStatusDto = await hubService.lobbyConnection.invoke(
         "JoinLobbyAsGuestWithCode",
         connectionCode,
         playerName
      );
      console.log("Join lobby with code response:", joinStatusDto);
      this.joinStatus = joinStatusDto.joinStatus;
      if (joinStatusDto.joinStatus === JoinStatus.SUCCESS) {
         this.actualLobby = this.lobbies.find(
            (lobby) => lobby.id === joinStatusDto.lobbyId
         );
         console.log("Joined lobby with ID: " + joinStatusDto.lobbyId);
         console.log("Assigned player ID: " + joinStatusDto.playerId);
         playerService.setPlayer(joinStatusDto.player);

         await hubService.lobbyConnection.invoke(
            "RefreshPlayersInLobby",
            joinStatusDto.lobbyId
         );
         applicationStateService.setUserMode(UserMode.PLAYER);
         applicationStateService.setApplicationStatus(
            ApplicationStatus.IN_LOBBY
         );
         applicationStateService.setApplicationPage(ApplicationPage.LOBBY_PAGE);
      }
      this.notifyListeners();
   }
}

export const lobbyService = new LobbyService();
