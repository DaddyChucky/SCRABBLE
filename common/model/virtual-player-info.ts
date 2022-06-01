import { VirtualPlayerDifficulty } from './virtual-player-difficulty';

export class VirtualPlayerInfo {
    name: string = '';
    difficulty: VirtualPlayerDifficulty = VirtualPlayerDifficulty.BEGINNER;
    default: boolean;
}
