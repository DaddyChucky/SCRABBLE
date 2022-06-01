import { DirectionType } from '@app/../../../common/model/direction-type';
import { LetterBag } from '@app/../../../common/model/letter-bag/letter-bag';
import { MultiplayerLobby } from '@app/../../../common/model/lobby';
import { LobbyStatus } from '@app/../../../common/model/lobby-status';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { Player } from '@app/../../../common/model/player';
import { Quest } from '@app/../../../common/model/quest';
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';
import { WordRequest } from '@app/../../../common/model/word-request';
import { CommandType } from '@app/classes/command-type';
import { PlaceCommand } from '@app/classes/place-command';
import * as serviceConstants from './place-letters.service.constants';

export const INITIAL_PLAYER_TILES: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'L', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'I', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'C', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'O', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'R', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'N', 1),
    new Tile({ x: 0, y: 0 } as Vec2, '*', 0),
];
export const PLAYER: Player = {
    name: 'Malin Le Lapin',
    playerId: 'playerId',
    score: 88,
    tiles: INITIAL_PLAYER_TILES,
    host: true,
    isTurn: true,
    sideQuest: {} as Quest,
};
export const LOBBY: MultiplayerLobby = {
    playerList: [PLAYER],
    lobbyType: LobbyType.CLASSIC,
    dictionary: 'ENGLISH',
    baseTimerValue: 60,
    timeLeft: 0,
    lobbyId: 'secretLobbyId',
    lobbyStatus: LobbyStatus.CREATED,
    letterBag: new LetterBag(),
} as MultiplayerLobby;
export const KEY_L = 'l';
export const VALID_KEYS = 'licornïîôöç';
export const VALID_KEYS_BLANK = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ';
export const INVALID_KEYS = 'abdefghjkmpqstuv1234567890-=+<>./`~àâäéèêëùûüÿ!@#$%^&*(){}[]';
export const START_POSITION = { x: 7, y: 7 } as Vec2;
export const NEW_POSITION = { x: 1, y: 0 } as Vec2;
export const WORD = 'pumpkin';
export const TILES_PUMPKIN: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'P', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'U', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'M', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'P', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'K', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'I', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'N', 0),
];
export const WORD_REQUEST: WordRequest = {
    lobbyId: LOBBY.lobbyId,
    socketId: PLAYER.playerId,
    word: WORD,
    startPosition: START_POSITION,
    direction: DirectionType.HORIZONTAL,
    tiles: TILES_PUMPKIN,
} as WordRequest;
export const PLACE_COMMAND: PlaceCommand = {
    name: CommandType.PLACE,
    startPosition: serviceConstants.DEFAULT_POSITION,
    direction: DirectionType.HORIZONTAL,
    letters: '',
} as PlaceCommand;
export const WORD_WITH_ACCENT = 'ÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇàâäéèêëïîôöùûüÿçabcdefghijklmnopqrtuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const WORD_WITHOUT_ACCENT = 'AAAEEEEIIOOUUUYCaaaeeeeiioouuuycabcdefghijklmnopqrtuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const VALID_TILE_NAMES = 'licorn*LICORN';
export const INVALID_TILE_NAMES = 'abdefghjkmpqtuvwxyzABDEFGHJKMPQSTUVWXYZ';
export const INVALID_START_POSITIONS: Vec2[] = [
    { x: 0, y: 1 } as Vec2,
    { x: 1, y: 0 } as Vec2,
    { x: 2, y: 3 } as Vec2,
    { x: 4, y: 2 } as Vec2,
    { x: 14, y: 0 } as Vec2,
    { x: 0, y: 4 } as Vec2,
    { x: 7, y: 7 } as Vec2,
    { x: 8, y: 9 } as Vec2,
    { x: 3, y: 6 } as Vec2,
    { x: 9, y: 11 } as Vec2,
    { x: 12, y: 11 } as Vec2,
    { x: 14, y: 14 } as Vec2,
];
export const INVALID_TILE_NAME_TO_REMOVE = 'abdefghjkmpqtuvwxyz';
export const PLAYER_TILES: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'H', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'U', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'M', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'A', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'I', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'N', 1),
    new Tile({ x: 0, y: 0 } as Vec2, '*', 0),
];
export const ALL_LETTERS_TO_REMOVE = 'wazabY';
export const ONE_LETTER_TO_REMOVE = 'u';
export const PLAYER_TILES_REMOVE_U: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'H', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'M', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'A', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'I', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'N', 1),
    new Tile({ x: 0, y: 0 } as Vec2, '*', 0),
];
export const ALL_TILE_NAMES = 'abcdefghijklmnopqrtuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const WORD_TO_ADD = 'licornX';
export const WORD_TO_ADD_NORMAL_TILES = 'licorn';
export const PLAYER_TILES_REMOVE_ALL: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'W', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'A', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'Z', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'A', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'B', 1),
    new Tile({ x: 0, y: 0 } as Vec2, '*', 0),
];
export const SQUARE_NAME_A1 = 'a1';
export const PLACE_COMMAND_TEXT_HORIZONTAL = '!placer a1h wazabY';
export const PLACE_COMMAND_TEXT_VERTICAL = '!placer a1v licornX';
export const INVALID_GRID_POSITION = { x: 15, y: 15 } as Vec2;
export const NEXT_POSITION = { x: 7, y: 8 } as Vec2;
export const NEXT_POSITION_CALLS = 2;
export const CLICK_POSITIONS: Vec2[] = [
    { x: 53, y: 53 } as Vec2,
    { x: 54, y: 54 } as Vec2,
    { x: 72, y: 61 } as Vec2,
    { x: 89, y: 90 } as Vec2,
    { x: 111, y: 73 } as Vec2,
    { x: 666, y: 87 } as Vec2,
    { x: 366, y: 162 } as Vec2,
    { x: 154, y: 279 } as Vec2,
    { x: 347, y: 346 } as Vec2,
    { x: 527, y: 438 } as Vec2,
    { x: 335, y: 472 } as Vec2,
    { x: 60, y: 664 } as Vec2,
    { x: 295, y: 668 } as Vec2,
    { x: 635, y: 668 } as Vec2,
    { x: 684, y: 675 } as Vec2,
];
export const GRID_POSITIONS_OF_CLICK: Vec2[] = [
    { x: -1, y: -1 } as Vec2,
    { x: 0, y: 0 } as Vec2,
    { x: 0, y: 0 } as Vec2,
    { x: 0, y: 0 } as Vec2,
    { x: 1, y: 0 } as Vec2,
    { x: 14, y: 0 } as Vec2,
    { x: 7, y: 2 } as Vec2,
    { x: 2, y: 5 } as Vec2,
    { x: 7, y: 7 } as Vec2,
    { x: 11, y: 9 } as Vec2,
    { x: 6, y: 10 } as Vec2,
    { x: 0, y: 14 } as Vec2,
    { x: 5, y: 14 } as Vec2,
    { x: 14, y: 14 } as Vec2,
    { x: 15, y: 15 } as Vec2,
];
export const FIND_GRID_AXIS_CALLS = 2;
export const EXPECTED_PLACE_COMMAND: PlaceCommand = {
    name: CommandType.PLACE,
    startPosition: START_POSITION,
    direction: DirectionType.HORIZONTAL,
    letters: '',
} as PlaceCommand;
export const LETTER_A = 'a';
export const SQUARE_LENGTH = 41.16667;
export const LAST_TILE: Tile[] = [new Tile({ x: 0, y: 0 } as Vec2, 'N', 1)];
export const TILES_JAZZ: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'J', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'A', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'Z', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'Z', 1),
];
export const WORD_JAZZ = 'jazz';
export const TILE_X: Tile = new Tile(NEW_POSITION, 'X', 1);
export const PLAYER_TILES_UNICORN: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'L', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'I', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'C', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'O', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'R', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'N', 1),
    new Tile({ x: 0, y: 0 } as Vec2, '*', 0),
];
export const TILE_Y: Tile = new Tile({ x: 4, y: 4 } as Vec2, 'Y', 1);
export const NOT_START_POSITION: Vec2 = { x: 4, y: 5 } as Vec2;
export const ONE_TILE_TO_ADD: Tile = new Tile({ x: 4, y: 4 } as Vec2, 'A', 1);
