import { VirtualPlayerDifficulty } from '@app/../../../common/model/virtual-player-difficulty';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';

export const BEGINNER_VP_TEST: VirtualPlayerInfo = {
    name: 'ppman',
    difficulty: VirtualPlayerDifficulty.BEGINNER,
    default: false,
} as VirtualPlayerInfo;
export const EXPERT_VP_TEST: VirtualPlayerInfo = { name: 'ppman', difficulty: VirtualPlayerDifficulty.EXPERT, default: false } as VirtualPlayerInfo;
export const URL_STRING = 'http://localhost:3000/vp/';
export const URL_STRING_ADMIN = 'http://localhost:3000/admin';
export const URL_STRING_LOGS = 'http://localhost:3000/logs/';
export const INVALID_PLAYER_NAME = '____';
export const VALID_PLAYER_NAME = 'Malin le lapin';
