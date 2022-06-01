import { VirtualPlayer } from '@app/classes/virtual-player';
import { ChatMessage } from '@common/model/chat-message';
import { DirectionType } from '@common/model/direction-type';
import { LetterBag } from '@common/model/letter-bag/letter-bag';
import { MultiplayerLobby } from '@common/model/lobby';
import { LobbyInfo } from '@common/model/lobby-info';
import { LobbyStatus } from '@common/model/lobby-status';
import { LobbyType } from '@common/model/lobby-type';
import { ParsedInfo } from '@common/model/parsed-info';
import { Player } from '@common/model/player';
import { Quest } from '@common/model/quest';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Tile } from '@common/model/tile';
import { TilesValidation } from '@common/model/tiles-validation';
import { TypeOfUser } from '@common/model/type-of-user';
import { Vec2 } from '@common/model/vec2';
import { VirtualPlayerDifficulty } from '@common/model/virtual-player-difficulty';
import { WordRequest } from '@common/model/word-request';
import { WordValidation } from '@common/model/word-validation';

export const URL_STRING = 'http://localhost:3000';
export const DEFAULT_DICT = 'francais';
export const PLAYER1: Player = {
    name: 'bob',
    score: 12,
    playerId: 'aihaidhs',
    isTurn: true,
    tiles: [new Tile()],
    host: true,
    sideQuest: {} as Quest,
} as Player;
export const PLAYER2: Player = {
    name: 'bobs friend',
    score: 14,
    playerId: 'no',
    isTurn: true,
    tiles: [new Tile()],
    host: true,
    sideQuest: {} as Quest,
} as Player;
export const EXPECTED_LOBBY: MultiplayerLobby = {
    dictionary: 'francais',
    lobbyType: LobbyType.CLASSIC,
    playerList: [PLAYER1, PLAYER2],
    baseTimerValue: 60,
    letterBag: new LetterBag(),
    timeLeft: 0,
    lobbyId: 'mylobbyid',
    lobbyStatus: LobbyStatus.CREATED,
} as MultiplayerLobby;
export const LOBBY_ID = 'mylobbyid';
export const CHAT_MSG: ChatMessage = {
    text: 'Hello, player2',
    lobbyId: EXPECTED_LOBBY.lobbyId,
    socketId: '',
    date: new Date(),
    author: TypeOfUser.OPPONENT_PLAYER,
} as ChatMessage;
export const VIRTUAL_PLAYER: VirtualPlayer = {
    name: 'Johhny Le Terrible Terrifiant',
    playerId: 'virtual-player',
    difficulty: VirtualPlayerDifficulty.BEGINNER,
    score: 10,
    tiles: [new Tile(undefined, 'A')],
    host: false,
    isTurn: true,
    sideQuest: {} as Quest,
};
export const LOBBY_INFO = {
    dictionary: 'francais',
    player: PLAYER1,
    lobbyType: LobbyType.CLASSIC,
    lobbyId: EXPECTED_LOBBY.lobbyId,
    timerValue: 60,
    virtualPlayer: { name: 'Johhny Le Terrible Terrifiant', difficulty: VirtualPlayerDifficulty.BEGINNER, default: true },
} as LobbyInfo;

export const WORD_REQUEST: WordRequest = {
    lobbyId: EXPECTED_LOBBY.lobbyId,
    socketId: 'this.socketService.socket.id',
    word: 'salut',
    startPosition: { x: 7, y: 7 } as Vec2,
    direction: DirectionType.HORIZONTAL,
} as WordRequest;
export const WORD_REQUEST_LOBBY_UNDEFINED: WordRequest = {
    socketId: 'this.socketService.socket.id',
    word: 'salut',
    startPosition: { x: 7, y: 7 } as Vec2,
    direction: DirectionType.HORIZONTAL,
} as WordRequest;
export const TILES: Tile[] = [
    new Tile({ x: 0, y: 4 } as Vec2, 'l', 1),
    new Tile({ x: 0, y: 5 } as Vec2, 'a', 1),
    new Tile({ x: 0, y: 6 } as Vec2, 'p', 3),
    new Tile({ x: 0, y: 7 } as Vec2, 'i', 1),
    new Tile({ x: 0, y: 8 } as Vec2, 'n', 1),
];
export const TILES_VALIDATION: TilesValidation = {
    tilesCompleteWord: TILES,
    tilesOnGrid: [],
    newTilesToAdd: TILES,
    adjacentWords: [],
    adjacentTiles: [],
} as TilesValidation;
export const WORD_VALIDATION: WordValidation = {
    tiles: TILES_VALIDATION,
    parsedInfo: {
        lettersCommand: 'placer',
        position: { x: 7, y: 7 } as Vec2,
        direction: DirectionType.HORIZONTAL,
        lobbyId: EXPECTED_LOBBY.lobbyId,
        scrabbleGrid: { elements: [] } as ScrabbleGrid,
    } as ParsedInfo,
};
export const EXPECTED_VIRTUAL_PLAYER: VirtualPlayer = {
    name: 'Greta Tremblay',
    playerId: 'Greta Tremblay',
    host: false,
    difficulty: VirtualPlayerDifficulty.BEGINNER,
} as VirtualPlayer;
export const ACTIVE_PLAYER: Player = {
    name: 'Bobby Louba',
    score: 12,
    playerId: 'PLAYER1_ID',
    isTurn: true,
    tiles: [],
    host: true,
    sideQuest: {} as Quest,
} as Player;
export const INACTIVE_PLAYER: Player = {
    name: 'Malin le lapin',
    score: 12,
    playerId: 'PLAYER1_ID',
    isTurn: false,
    tiles: [],
    host: false,
    sideQuest: {} as Quest,
} as Player;
export const LETTERS_TO_EXCHANGE = 'abc';
export const NEGATIVE_VALUE = -5;
export const VALID_USERNAME = 'usernameValid';
export const INVALID_USERNAME = 'usernameInvalid';
export const INVALID_LOBBY = '12345';
export const RESPONSE_DELAY = 300;
export const SECOND_VIRTUAL_PLAYER_PLAY = 3000;
