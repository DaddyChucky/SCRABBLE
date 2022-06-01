/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ChatMessage } from '@app/../../../common/model/chat-message';
import { DirectionType } from '@app/../../../common/model/direction-type';
import { ParsedInfo } from '@app/../../../common/model/parsed-info';
import { Player } from '@app/../../../common/model/player';
import { Quest } from '@app/../../../common/model/quest';
import { Tile } from '@app/../../../common/model/tile';
import { TilesValidation } from '@app/../../../common/model/tiles-validation';
import { TypeOfUser } from '@app/../../../common/model/type-of-user';
import { Vec2 } from '@app/../../../common/model/vec2';
import { VIRTUAL_PLAYER_ID } from '@app/services/game-manager/game-manager.service.constants';

export const HINT_COMMAND = '!indice';
export const HELP_COMMAND = '!aide';
export const INITIAL_PLAYER_TILES: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'b', 3),
    new Tile({ x: 0, y: 0 } as Vec2, 'o', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'n', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'j', 8),
    new Tile({ x: 0, y: 0 } as Vec2, 'o', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'u', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'r', 1),
];
export const LOBBY_ID = 'secretId';
export const PLAYER_ID = 'id1';
export const PLAYER2_ID = 'id2';
export const VIRTUAL_PLAYER: Player = {
    name: 'Johhny Le Terrible Terrifiant',
    playerId: VIRTUAL_PLAYER_ID,
    score: 10,
    tiles: INITIAL_PLAYER_TILES,
    host: false,
    isTurn: true,
    sideQuest: {} as Quest,
};
export const PLAYER: Player = {
    name: 'Johhny Le Terrible Terrifiant',
    playerId: PLAYER_ID,
    score: 1110,
    tiles: INITIAL_PLAYER_TILES,
    host: true,
    isTurn: true,
    sideQuest: {} as Quest,
};
export const NOT_CURRENT_PLAYER: Player = {
    name: 'Malin le lapin',
    playerId: PLAYER2_ID,
    score: 1330,
    tiles: INITIAL_PLAYER_TILES,
    host: false,
    isTurn: false,
    sideQuest: {} as Quest,
};
export const PARSED_INFO: ParsedInfo = {
    lettersCommand: 'manger',
    position: { x: 0, y: 0 } as Vec2,
    direction: DirectionType.HORIZONTAL,
} as ParsedInfo;
export const PLAYERS: Player[] = [PLAYER, NOT_CURRENT_PLAYER];
export const RESULT_MESSAGE_COMMAND = '!placer a1h manger';
export const POSITION_A1 = 'a1';
export const POSITION_DIRECTION: [Vec2, DirectionType] = [{ x: 0, y: 0 } as Vec2, DirectionType.HORIZONTAL];
export const WORD: [string, string] = ['a1h', 'manger'];

export const BEGINNING_COMMAND_NAME = 1;
export const SKIP_MESSAGE: ChatMessage = {
    author: TypeOfUser.CURRENT_PLAYER,
    text: '!passer',
    date: new Date(),
    lobbyId: LOBBY_ID,
    socketId: PLAYER_ID,
};
export const LETTERS_TO_EXCHANGE = 'wally';
export const EXCHANGE_COMMAND = '!échanger';
export const EXCHANGE_MESSAGE: ChatMessage = {
    author: TypeOfUser.CURRENT_PLAYER,
    text: EXCHANGE_COMMAND + ' ' + LETTERS_TO_EXCHANGE,
    date: new Date(),
    lobbyId: LOBBY_ID,
    socketId: PLAYER_ID,
};
export const HINT_MESSAGE: ChatMessage = {
    author: TypeOfUser.CURRENT_PLAYER,
    text: HINT_COMMAND,
    date: new Date(),
    lobbyId: LOBBY_ID,
    socketId: PLAYER_ID,
};
export const HELP_MESSAGE: ChatMessage = {
    author: TypeOfUser.CURRENT_PLAYER,
    text: HELP_COMMAND,
    date: new Date(),
    lobbyId: LOBBY_ID,
    socketId: PLAYER_ID,
};
export const INVALID_COMMAND_MESSAGE: ChatMessage = {
    author: TypeOfUser.CURRENT_PLAYER,
    text: '!passer skip',
    date: new Date(),
    lobbyId: LOBBY_ID,
    socketId: PLAYER_ID,
};
export const SOCKET_ID_CURRENT_PLAYER = 'id1';
export const SOCKET_ID_OPPONENT_PLAYER = 'id2';
export const MESSAGE_FROM_PLAYER: ChatMessage = {
    author: TypeOfUser.CURRENT_PLAYER,
    text: 'Player',
    date: new Date(),
    lobbyId: '',
    socketId: '',
} as ChatMessage;
export const MESSAGE_FROM_SYSTEM: ChatMessage = {
    author: TypeOfUser.SYSTEM,
    text: 'System',
    date: new Date(),
    lobbyId: '',
    socketId: '',
} as ChatMessage;
export const DATE_WITH_DOUBLE_DIGITS: Date = new Date('December 25, 2022 11:13:00');
export const DATE_WITH_ONE_DIGIT_MINUTES: Date = new Date('December 25, 2022 11:07:00');
export const DATE_WITH_ONE_DIGIT_HOURS: Date = new Date('December 25, 2022 4:13:00');
export const DATE_WITH_ONE_DIGIT: Date = new Date('December 25, 2022 4:01:00');
export const EMPTY_MESSAGE = '';
export const MESSAGE = 'TESTING';
export const POSITION: Vec2 = { x: 0, y: 0 } as Vec2;
export const USER_MESSAGE = 'salut';
export const MESSAGE_CURRENT_PLAYER: ChatMessage = {
    author: TypeOfUser.CURRENT_PLAYER,
    text: 'Current player message',
    date: new Date(),
    lobbyId: 'lobby',
    socketId: 'socketId',
} as ChatMessage;
export const MESSAGE_OPPONENT_PLAYER: ChatMessage = {
    author: TypeOfUser.OPPONENT_PLAYER,
    text: 'Opponent player message',
    date: new Date(),
    lobbyId: 'lobby',
    socketId: 'socketId',
} as ChatMessage;
export const MESSAGE_ERROR: ChatMessage = {
    author: TypeOfUser.ERROR,
    text: 'Error 404',
    date: new Date(),
    lobbyId: 'lobby',
    socketId: 'socketId',
} as ChatMessage;
export const WAIT_TIME_TO_REMOVE_TILES = 3000;
export const TILES_WORD: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'M', 2),
    new Tile({ x: 1, y: 0 } as Vec2, 'A', 1),
    new Tile({ x: 2, y: 0 } as Vec2, 'N', 1),
    new Tile({ x: 3, y: 0 } as Vec2, 'G', 2),
    new Tile({ x: 4, y: 0 } as Vec2, 'E', 1),
    new Tile({ x: 5, y: 0 } as Vec2, 'R', 1),
];
export const TILES_VALIDATION: TilesValidation = {
    tilesCompleteWord: TILES_WORD,
    tilesOnGrid: [],
    newTilesToAdd: TILES_WORD,
    adjacentWords: [],
    adjacentTiles: [],
} as TilesValidation;
