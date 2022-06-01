/* eslint-disable @typescript-eslint/no-magic-numbers */
import { LetterBag } from '@app/../../../common/model/letter-bag/letter-bag';
import { MultiplayerLobby } from '@app/../../../common/model/lobby';
import { LobbyStatus } from '@app/../../../common/model/lobby-status';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { Player } from '@app/../../../common/model/player';
import { Quest } from '@app/../../../common/model/quest';
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';
import * as serviceConstants from './easel.service.constants';

export const INITIAL_PLAYER_TILES: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'b', 3),
    new Tile({ x: 0, y: 0 } as Vec2, 'o', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'n', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'j', 8),
    new Tile({ x: 0, y: 0 } as Vec2, 'o', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'u', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'r', 1),
];
export const PLAYER: Player = {
    name: 'Johhny Le Terrible',
    playerId: 'playerId',
    score: 1110,
    tiles: INITIAL_PLAYER_TILES,
    host: true,
    isTurn: true,
    sideQuest: {} as Quest,
};
export const INITIAL_LETTER_BAG_SIZE = 102;
export const LETTER_BAG_SIZE_LESS_THAN_SEVEN = 6;
export const FONT_SIZE = 30;
export const SELECTED_TILE = new Tile(undefined, 'a');
export const TILE_TO_SWAP = new Tile(undefined, 'b');
export const INDEX_OF_SELECTED_TILE = 5;
export const INDEX_OF_SWAP = 0;
export const LETTER_PRESSED = 'a';
export const LETTERS_TO_EXCHANGE_UNICORN = 'licorne';
export const NUMBER_OF_CALLS_TO_SEND = 2;
export const LOBBY_ID = 'secretLobbyId';
export const LOBBY: MultiplayerLobby = {
    playerList: [PLAYER],
    lobbyType: LobbyType.CLASSIC,
    dictionary: 'ENGLISH',
    baseTimerValue: 60,
    timeLeft: 0,
    lobbyId: LOBBY_ID,
    lobbyStatus: LobbyStatus.CREATED,
    letterBag: new LetterBag(),
} as MultiplayerLobby;
export const EVENT_ARROW_LEFT = new KeyboardEvent('keypress', {
    key: serviceConstants.ARROW_LEFT,
});
export const EVENT_ARROW_RIGHT = new KeyboardEvent('keypress', {
    key: serviceConstants.ARROW_RIGHT,
});
export const EVENT_WHEEL_LEFT = new WheelEvent('scroll', {
    deltaY: -1,
});
export const EVENT_WHEEL_RIGHT = new WheelEvent('scroll', {
    deltaY: 1,
});
export const LETTERS_AFTER_REMOVE_IN_BETWEEN = 'bcdfg';
export const INDEX_E = 4;
export const LETTERS_AFTER_REMOVE = 'cdefg';
export const LETTER_TO_EXCHANGE = 'a';
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
export const LETTERS_TO_EXCHANGE = 'bcdefg';
