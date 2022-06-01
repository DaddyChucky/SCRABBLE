import { GameLog } from '@common/model/game-log';
import { PlayerInfoLog } from '@common/model/player-info-log';
import { ScorePack } from '@common/model/score-pack';
import { VirtualPlayerDifficulty } from '@common/model/virtual-player-difficulty';
import { VirtualPlayerInfo } from '@common/model/virtual-player-info';

export const DB_USERNAME = 'hidden';
export const DB_PASSWORD = 'hidden';
export const DATABASE_NAME = 'scrabbleDB';
export const DATABASE_COLLECTION_CLASSIC = 'classicScores';
export const DATABASE_COLLECTION_2990 = 'log2990Scores';
export const DATABASE_COLLECTION_GAMES_LOGS = 'gamesLogs';
export const DATABASE_COLLECTION_VP = 'virtualPlayers';
export const DATABASE_URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@hidden.hidden.mongodb.net/hidden?retryWrites=true&w=majority`;
export const SCORE1: ScorePack = { score: 55, names: ['Michel', 'Bob'] } as ScorePack;
export const SCORE2: ScorePack = { score: 44, names: ['Cléopâtre'] } as ScorePack;
export const SCORE3: ScorePack = { score: 33, names: ['Napoléon'] } as ScorePack;
export const SCORE4: ScorePack = { score: 22, names: ['Gina'] } as ScorePack;
export const SCORE5: ScorePack = { score: 11, names: ['Jean', 'Paul', 'Hamster64'] } as ScorePack;
export const SCORE6: ScorePack = { score: 61, names: ['Le Magicien'] } as ScorePack;
export const SCORE7: ScorePack = { score: 51, names: ['Oscar'] } as ScorePack;
export const SCORE8: ScorePack = { score: 47, names: ['Pablo'] } as ScorePack;
export const SCORE9: ScorePack = { score: 39, names: ['Picasso'] } as ScorePack;
export const SCORE10: ScorePack = { score: 15, names: ['Ronald', 'Alien231'] } as ScorePack;
export const DEFAULT_SCORES_CLASSIC = [SCORE1, SCORE2, SCORE3, SCORE4, SCORE5];
export const DEFAULT_SCORES_LOG2990 = [SCORE6, SCORE7, SCORE8, SCORE9, SCORE10];
export const DEFAULT_BEGINNER_PLAYERS: VirtualPlayerInfo[] = [
    { name: 'Arnold Le Gentil', difficulty: VirtualPlayerDifficulty.BEGINNER, default: true } as VirtualPlayerInfo,
    { name: 'Malin Le Lapin', difficulty: VirtualPlayerDifficulty.BEGINNER, default: true } as VirtualPlayerInfo,
    { name: 'Roger Le Robot', difficulty: VirtualPlayerDifficulty.BEGINNER, default: true } as VirtualPlayerInfo,
];
export const DEFAULT_EXPERT_PLAYERS: VirtualPlayerInfo[] = [
    { name: 'Monique La Maléfique', difficulty: VirtualPlayerDifficulty.EXPERT, default: true } as VirtualPlayerInfo,
    { name: 'Johnny Le Terrible', difficulty: VirtualPlayerDifficulty.EXPERT, default: true } as VirtualPlayerInfo,
    { name: 'Edgar La Terreur', difficulty: VirtualPlayerDifficulty.EXPERT, default: true } as VirtualPlayerInfo,
];
export const DEFAULT_DICTIONARY_TITLE = 'francais';
export const DEFAULT_GAME_LOG: GameLog = { playerInfos: [{} as PlayerInfoLog, {} as PlayerInfoLog] } as GameLog;
