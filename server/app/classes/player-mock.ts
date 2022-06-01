import { Quest } from '@common/model/quest';
import { Tile } from '@common/model/tile';

export interface PlayerMock {
    name: string;
    score: number;
    playerId: string;
    tiles: Tile[];
    isTurn: boolean;
    host: boolean;
    sideQuest: Quest;
}
