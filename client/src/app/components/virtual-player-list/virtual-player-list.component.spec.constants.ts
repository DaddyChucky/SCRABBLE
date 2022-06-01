import { VirtualPlayerDifficulty } from '@app/../../../common/model/virtual-player-difficulty';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';

export const DEFAULT_PLAYER: VirtualPlayerInfo = {
    name: 'Arnold Le Gentil',
    difficulty: VirtualPlayerDifficulty.BEGINNER,
    default: true,
} as VirtualPlayerInfo;
export const PLAYER_LIST: VirtualPlayerInfo[] = [
    { name: 'Arnold Le Gentil', difficulty: VirtualPlayerDifficulty.BEGINNER, default: true } as VirtualPlayerInfo,
    { name: 'Malin Le Lapin', difficulty: VirtualPlayerDifficulty.BEGINNER, default: true } as VirtualPlayerInfo,
    { name: 'Roger Le Robot', difficulty: VirtualPlayerDifficulty.BEGINNER, default: false } as VirtualPlayerInfo,
];
export const VIRTUAL_PLAYER_NAMES: string[] = ['Arnold Le Gentil', 'Malin Le Lapin', 'Roger Le Robot'];
export const PLAYER_SAVED = 'Suzanne';
export const SECOND_PLAYER_LIST: VirtualPlayerInfo[] = [
    { name: 'Roger', difficulty: VirtualPlayerDifficulty.EXPERT, default: true } as VirtualPlayerInfo,
    { name: 'LaMuerte', difficulty: VirtualPlayerDifficulty.EXPERT, default: false } as VirtualPlayerInfo,
];
export const VIRTUAL_PLAYER_NAMES2: string[] = ['Roger', 'LaMuerte'];
