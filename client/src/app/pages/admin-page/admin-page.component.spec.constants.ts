import { Dictionary } from '@app/../../../common/model/dictionary';
import { VirtualPlayerDifficulty } from '@app/../../../common/model/virtual-player-difficulty';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';

export const BEGINNER_PLAYERS: VirtualPlayerInfo[] = [
    { name: 'Arnold Le Gentil', difficulty: VirtualPlayerDifficulty.BEGINNER, default: true } as VirtualPlayerInfo,
    { name: 'Malin Le Lapin', difficulty: VirtualPlayerDifficulty.BEGINNER, default: true } as VirtualPlayerInfo,
    { name: 'Roger Le Robot', difficulty: VirtualPlayerDifficulty.BEGINNER, default: true } as VirtualPlayerInfo,
];
export const EXPERT_PLAYERS: VirtualPlayerInfo[] = [
    { name: 'Monique La Maléfique', difficulty: VirtualPlayerDifficulty.EXPERT, default: true } as VirtualPlayerInfo,
    { name: 'Johnny Le Terrible', difficulty: VirtualPlayerDifficulty.EXPERT, default: true } as VirtualPlayerInfo,
    { name: 'Edgar La Terreur', difficulty: VirtualPlayerDifficulty.EXPERT, default: true } as VirtualPlayerInfo,
];
export const DICTIONARIES: Dictionary[] = [
    { title: 'Dictionnaire 1', description: 'Description 1', words: ['loupe', 'se'] } as Dictionary,
    { title: 'Dictionnaire 2', description: 'Description 2', words: ['la', 'chocolat'] } as Dictionary,
];
