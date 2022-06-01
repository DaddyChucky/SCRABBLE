import { Player } from '@app/../../../common/model/player';
import { Quest } from '@app/../../../common/model/quest';
import { Tile } from '@app/../../../common/model/tile';

export const PLAYER1: Player = {
    name: 'Arnold LeGrand',
    playerId: 'arnoldLeGrand',
    score: 310,
    tiles: [
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
    ],
    isTurn: true,
    host: false,
    sideQuest: {} as Quest,
} as Player;
export const PLAYER2: Player = {
    name: 'Suzanne',
    playerId: 'suz',
    score: 4410,
    tiles: [
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
    ],
    host: true,
    isTurn: false,
    sideQuest: {} as Quest,
} as Player;
export const CSS_CLASS_IS_TURN = 'isTurn';
export const CSS_CLASS_IS_NOT_TURN = 'isNotTurn';
