import { LetterBag } from '@app/../../../common/model/letter-bag/letter-bag';
import { MultiplayerLobby } from '@app/../../../common/model/lobby';
import { LobbyStatus } from '@app/../../../common/model/lobby-status';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { Player } from '@app/../../../common/model/player';
import { Quest } from '@app/../../../common/model/quest';
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';

export const PLAYER_WITH_HIGHEST_SCORE: Player = {
    name: 'Johhny Le Terrible',
    playerId: '',
    score: 1110,
    tiles: [],
    host: true,
    isTurn: true,
    sideQuest: {} as Quest,
};
export const PLAYER_WITH_LOWEST_SCORE: Player = {
    name: 'Arnold LeGentil',
    score: 30,
    playerId: '',
    host: false,
    tiles: [],
    isTurn: false,
    sideQuest: {} as Quest,
};
export const PLAYERS_IN_RIGHT_ORDER: Player[] = [PLAYER_WITH_HIGHEST_SCORE, PLAYER_WITH_LOWEST_SCORE];
export const PLAYERS_IN_WRONG_ORDER: Player[] = [PLAYER_WITH_LOWEST_SCORE, PLAYER_WITH_HIGHEST_SCORE];
export const INDEX_HIGHEST_SCORE = 0;
export const INDEX_LOWEST_SCORE = 1;
export const LOBBY: MultiplayerLobby = {
    playerList: PLAYERS_IN_RIGHT_ORDER,
    lobbyType: LobbyType.CLASSIC,
    dictionary: 'ENGLISH',
    baseTimerValue: 60,
    timeLeft: 0,
    lobbyId: 'thisismylobby',
    lobbyStatus: LobbyStatus.CREATED,
    letterBag: new LetterBag(),
} as MultiplayerLobby;
export const LETTERS_PLAYER_1 = 'salutA*';
export const LETTERS_PLAYER_2 = 'salutB*';
export const BLANK_TILE_NAMES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ';
export const NORMAL_TILE_NAMES = 'abcdefghijklmnopqrtuvwxyz';
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
export const INITIAL_PLAYER_TILES: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'L', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'I', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'C', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'O', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'R', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'N', 1),
    new Tile({ x: 0, y: 0 } as Vec2, '*', 0),
];
export const PLAYER_TILES_REMOVE_ALL: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'W', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'A', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'Z', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'A', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'B', 1),
    new Tile({ x: 0, y: 0 } as Vec2, '*', 0),
];
export const LONGER_TILE_NAMES: string[] = ['Enter', 'Escape', 'Backspace'];
export const END_GAME_MESSAGE = 'Victore!';
