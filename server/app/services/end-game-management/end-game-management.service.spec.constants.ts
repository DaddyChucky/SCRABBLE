import { PlayerMock } from '@app/classes/player-mock';
import { Quest } from '@common/model/quest';
import { Tile } from '@common/model/tile';
export const TILES_1: Tile[] = [
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
];
export const TILES_2: Tile[] = [
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'B', 2),
    new Tile({ x: 0, y: 0 }, 'C', 3),
    new Tile({ x: 0, y: 0 }, 'D', 3),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
];
export const TEST_SCORE = 100;
export const TEST_SCORE_2 = 100;
export const TEST_SCORE_3 = 500;
export const EXPECTED_SCORE_MARGIN_2 = 12;
export const EXPECTED_SCORE_MARGIN_1 = 7;
export const LETTER_BAG_SIZE_MESSAGE: string[] = ['Fin de partie - ', '102', ' lettres'];

export const PLAYER_1: PlayerMock = {
    name: 'Roger',
    score: 1000,
    playerId: '0',
    tiles: TILES_1,
    isTurn: false,
    host: true,
    sideQuest: {} as Quest,
} as PlayerMock;
export const PLAYER_2: PlayerMock = {
    name: 'Gontrand',
    score: 500,
    playerId: '1',
    tiles: TILES_2,
    isTurn: false,
    host: false,
    sideQuest: {} as Quest,
} as PlayerMock;
