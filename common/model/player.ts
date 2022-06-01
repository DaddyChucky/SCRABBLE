import { Quest } from './quest';
import { Tile } from './tile';
import { VirtualPlayerDifficulty } from './virtual-player-difficulty';

export interface Player {
    name: string;
    score: number;
    playerId: string;
    tiles: Tile[];
    isTurn: boolean;
    host: boolean;
    sideQuest: Quest;
    difficulty?: VirtualPlayerDifficulty;
}
