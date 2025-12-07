import { ApplicationPage } from "../enums/application_page.enum";
import { ApplicationStatus } from "../enums/application_status.enum";
import { GameMode } from "../enums/game_mode.enum";
import { JoinStatus } from "../enums/join_status.enum";
import { LobbyCreateStatus } from "../enums/lobby_create_status.enum";
import { StartGameStatus } from "../enums/start_game_status.enum";
import { UserMode } from "../enums/user_mode.enum";
import { CreateLobby } from "../models/create_lobby.model";
import { Lobby } from "../models/lobby.model";
import { applicationStateService } from "./ApplicationStateService";
import { hubService } from "./HubService";
import { playerService } from "./PlayerService";

class LobbyService {
   private actualLobby: Lobby;
   private joinStatus: JoinStatus;
   private createStatus: LobbyCreateStatus;
   private startGameStatus: StartGameStatus;
   private lobbies: Lobby[] = [];

   private lobbyListeners: ((
      lobbies: Lobby[],
      lobby: Lobby,
      joinStatus: JoinStatus,
      createStatus: LobbyCreateStatus,
      startGameStatus: StartGameStatus
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
         playerService.clearPlayers();
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
         listener(
            this.lobbies,
            this.actualLobby,
            this.joinStatus,
            this.createStatus,
            this.startGameStatus
         )
      );
   }

   addListener(
      listener: (
         lobbies: Lobby[],
         lobby: Lobby,
         joinStatus: JoinStatus,
         createStatus: LobbyCreateStatus,
         startGameStatus: StartGameStatus
      ) => void
   ) {
      listener(
         this.lobbies,
         this.actualLobby,
         this.joinStatus,
         this.createStatus,
         this.startGameStatus
      );
      this.lobbyListeners.push(listener);
   }

   removeListener(
      listener: (
         lobbies: Lobby[],
         lobby: Lobby,
         joinStatus: JoinStatus,
         createStatus: LobbyCreateStatus,
         startGameStatus: StartGameStatus
      ) => void
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
         .then((createLobby: CreateLobby) => {
            this.createStatus = createLobby.createStatus;
            if (createLobby.createStatus === LobbyCreateStatus.CREATED) {
               this.actualLobby = createLobby.lobby;
               playerService.clearPlayers();
               console.log("Lobby created with ID: " + createLobby);
               playerService.setIsHost(true);
               applicationStateService.setUserMode(UserMode.HOST);
               applicationStateService.setApplicationStatus(
                  ApplicationStatus.IN_LOBBY
               );
               applicationStateService.setApplicationPage(
                  ApplicationPage.LOBBY_PAGE
               );
            }
            this.notifyListeners();
         });
   }

   async abandonLobby(gameId: string) {
      await hubService.lobbyConnection.invoke(
         "AbandonLobby",
         this.actualLobby.id,
         gameId
      );
      this.actualLobby = null;
      this.notifyListeners();
   }

   async joinLobby(lobbyId: string, playerName?: string) {
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

         console.log("Joined lobby with ID: " + lobbyId);
         console.log("Assigned player ID: " + joinStatusDto.playerId);

         playerService.setPlayer(joinStatusDto.player);

         applicationStateService.setUserMode(UserMode.PLAYER);
         applicationStateService.setApplicationStatus(
            ApplicationStatus.IN_LOBBY
         );
         applicationStateService.setApplicationPage(ApplicationPage.LOBBY_PAGE);
      }
      this.notifyListeners();
   }

   async checkWhetherGameCanBeStarted(): Promise<StartGameStatus> {
      const name = playerService.getPlayer().name;
      this.startGameStatus = await hubService.lobbyConnection.invoke(
         "CheckWhetherGameCanBeStarted",
         this.actualLobby.id,
         name
      );
      console.log(
         "CheckWhetherGameCanBeStarted response:",
         this.startGameStatus
      );
      this.notifyListeners();
      return this.startGameStatus;
   }

   async joinLobbyWithCode(connectionCode: string, playerName: string) {
      const joinStatusDto = await hubService.lobbyConnection.invoke(
         "JoinLobbyWithCode",
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
