import { Player } from '@common/model/player';
import { VirtualPlayerDifficulty } from '@common/model/virtual-player-difficulty';

export interface VirtualPlayer extends Player {
    difficulty: VirtualPlayerDifficulty;
}
