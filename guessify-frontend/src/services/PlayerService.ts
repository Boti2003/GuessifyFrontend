import { ApplicationPage } from "../enums/application_page.enum";
import { ApplicationStatus } from "../enums/application_status.enum";
import { GameMode } from "../enums/game_mode.enum";
import { UserType } from "../enums/user_type.enum";
import { Game } from "../models/game.model";
import { Player } from "../models/player.model";
import { applicationStateService } from "./ApplicationStateService";
import { categoryService } from "./CategoryService";
import { gameService } from "./GameService";
import { hubService } from "./HubService";

class PlayerService {
   private actualPlayer: Player;
   private players: Player[] = [];
   private isHost: boolean = false;

   private componentListeners: ((
      players: Player[],
      actualPlayer: Player
   ) => void)[] = [];

   constructor() {}

   registerGameConnections() {
      hubService.gameConnection.on(
         "ReceivePlayersInGame",
         (players: Player[]) => {
            console.log("Received players in game:", players);
            console.log("Current player ID:", this.actualPlayer?.id);
            this.players = [...players];
            console.log("Players in game updated:", this.players);
            this.notifyListeners();
         }
      );
   }

   registerLobbyConnections() {
      hubService.lobbyConnection.on(
         "ReceivePlayersInLobby",
         (players: Player[]) => {
            console.log("Received players in lobby:", players);
            console.log("Current player ID:", this.actualPlayer?.id);
            this.players = players;
            console.log("Players in lobby updated:", this.players);
            this.notifyListeners();
         }
      );
      hubService.lobbyConnection.on(
         "RequestConnectionToGame",
         async (game: Game) => {
            console.log(
               "Received request to connect to game with ID:",
               game.id
            );
            const nameRequired =
               this.actualPlayer ||
               applicationStateService.getApplicationState()?.userType ===
                  UserType.REGISTERED;
            if (
               (nameRequired && !this.isHost && game.mode === GameMode.LOCAL) ||
               (game.mode === GameMode.REMOTE && nameRequired)
            ) {
               console.log(
                  "Sent request to join game as player:",
                  this.actualPlayer
               );
               gameService.setGame(game);
               const player = await hubService.gameConnection.invoke(
                  "JoinGame",
                  this.actualPlayer?.name,
                  game.id
               );
               categoryService.getCategoryGroups();

               gameService.setActualRoundNumber(1);
               this.actualPlayer = player;

               console.log("Connected to game as player:", this.actualPlayer);
               this.notifyListeners();
               applicationStateService.setApplicationPage(
                  ApplicationPage.GAME_PAGE
               );
               applicationStateService.setApplicationStatus(
                  ApplicationStatus.IN_GAME
               );
            }
         }
      );
   }

   addListener(listener: (players: Player[], actualPlayer: Player) => void) {
      listener(this.players, this.actualPlayer);
      this.componentListeners.push(listener);
   }
   removeListener(listener: (players: Player[], actualPlayer: Player) => void) {
      this.componentListeners = this.componentListeners.filter(
         (l) => l !== listener
      );
   }
   notifyListeners() {
      this.componentListeners.forEach((listener) =>
         listener(this.players, this.actualPlayer)
      );
   }

   clearPlayers() {
      this.players = [];
      this.notifyListeners();
   }

   setPlayer(player: Player) {
      this.actualPlayer = player;
      this.notifyListeners();
   }

   setIsHost(isHost: boolean) {
      this.isHost = isHost;
      console.log("Player host status set to:", this.isHost);
   }
}

export const playerService = new PlayerService();
