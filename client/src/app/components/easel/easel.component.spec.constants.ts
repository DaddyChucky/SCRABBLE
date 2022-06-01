import { Player } from '@app/../../../common/model/player';
import { Quest } from '@app/../../../common/model/quest';
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';

export const POSITION: Vec2 = { x: 0, y: 0 } as Vec2;
export const TILES: Tile[] = [
    new Tile(POSITION, 'A', 1),
    new Tile(POSITION, 'B', 1),
    new Tile(POSITION, 'C', 1),
    new Tile(POSITION, 'D', 1),
    new Tile(POSITION, 'E', 1),
    new Tile(POSITION, 'F', 1),
    new Tile(POSITION, 'G', 1),
];
export const PLAYER: Player = {
    name: 'Johhny Le Terrible',
    playerId: '',
    score: 1110,
    tiles: TILES,
    host: true,
    isTurn: true,
    sideQuest: {} as Quest,
};
export const LETTER_TO_EXCHANGE = 'a';
export const LETTERS_TO_EXCHANGE = 'bcdefg';
export const DISPLAY_ONE_LETTER_OUTPUT = 'A';
export const DISPLAY_LETTERS_OUTPUT = 'B - C - D - E - F - G';
export const INDEX_E = 4;
