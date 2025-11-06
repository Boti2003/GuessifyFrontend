import { GameMode } from "../enums/game_mode.enum";

export type Game = {
   id: string;
   name: string;
   mode: GameMode;
   totalRoundCount: number;
};
