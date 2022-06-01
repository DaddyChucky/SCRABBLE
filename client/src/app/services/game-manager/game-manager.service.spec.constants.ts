/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ChatMessage } from '@app/../../../common/model/chat-message';
import { DirectionType } from '@app/../../../common/model/direction-type';
import { LetterBag } from '@app/../../../common/model/letter-bag/letter-bag';
import { MultiplayerLobby } from '@app/../../../common/model/lobby';
import { LobbyStatus } from '@app/../../../common/model/lobby-status';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { ParsedInfo } from '@app/../../../common/model/parsed-info';
import { Player } from '@app/../../../common/model/player';
import { Quest } from '@app/../../../common/model/quest';
import { ScrabbleGrid } from '@app/../../../common/model/scrabble-grid';
import { Tile } from '@app/../../../common/model/tile';
import { TilesValidation } from '@app/../../../common/model/tiles-validation';
import { TypeOfUser } from '@app/../../../common/model/type-of-user';
import { Vec2 } from '@app/../../../common/model/vec2';
import { WordValidation } from '@app/../../../common/model/word-validation';
import { CommandType } from '@app/classes/command-type';
import { MESSAGE_PLAYER_TURN } from '@app/classes/constants';
import { PlaceCommand } from '@app/classes/place-command';
import * as serviceConstants from './game-manager.service.constants';

export const MAX_RANDOM_INT_VALUES: number[] = [0, 5, 20, 35, 57, 115, 1059];
export const LETTER_BAG_STUB: LetterBag = new LetterBag();
export const RARE_LETTERS_WEIGHT = 10;
export const LOBBY_TEST_VALUE = 'lobbyExists';
export const SECOND_PLAYER_INDEX = 1;
export const DEFAULT_PLAYER_STUB: Player = {
    name: 'Jean Brillant',
    score: 0,
    tiles: [
        new Tile({ x: 0, y: 0 }, 'a', 1),
        new Tile({ x: 0, y: 0 }, 'a', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
    ],
    isTurn: false,
    playerId: '',
    host: true,
} as Player;
export const LINK_INITIAL_VALUE = 'TESTING1';
export const LINK_NEW_VALUE = 'TESTING2';
export const PLAYER_IS_TURN: Player = {
    name: 'Johhny Le Terrible',
    playerId: 'Johhny',
    score: 1110,
    tiles: [],
    host: true,
    isTurn: true,
    sideQuest: {} as Quest,
};
export const PLAYER_IS_NOT_TURN: Player = {
    name: 'Arnold LeGentil',
    score: 30,
    playerId: 'Arnold',
    host: false,
    tiles: [],
    isTurn: false,
    sideQuest: {} as Quest,
};
export const VIRTUAL_PLAYER: Player = {
    name: 'Monique La Maléfique',
    score: 30,
    playerId: serviceConstants.VIRTUAL_PLAYER_ID,
    host: false,
    tiles: [],
    isTurn: false,
    sideQuest: {} as Quest,
};
export const PLAYERS: Player[] = [PLAYER_IS_TURN, PLAYER_IS_NOT_TURN];
export const INITIAL_PLAYERS: Player[] = [PLAYER_IS_NOT_TURN, PLAYER_IS_TURN];
export const FIRST_PLAYER = 0;
export const SECOND_PLAYER = 1;
export const LOBBY_MOCK_INITIAL: MultiplayerLobby = {
    playerList: PLAYERS,
    lobbyType: LobbyType.LOG2990,
    dictionary: 'ENGLISH',
    baseTimerValue: 60,
    timeLeft: 0,
    lobbyId: 'thisismylobby',
    lobbyStatus: LobbyStatus.CREATED,
    letterBag: new LetterBag(),
};
export const LOBBY_MOCK_NEW_VALUE: MultiplayerLobby = {
    playerList: PLAYERS,
    lobbyType: LobbyType.CLASSIC,
    dictionary: 'ENGLISH',
    baseTimerValue: 60,
    timeLeft: 0,
    lobbyId: 'lobby2',
    lobbyStatus: LobbyStatus.CREATED,
    letterBag: new LetterBag(),
};
export const DEFAULT_PLAYERS: Player[] = [
    {
        name: 'Arnold Lamotte',
        playerId: 'arnoldLamotte',
        score: 0,
        tiles: [
            new Tile({ x: 0, y: 0 }, 'a', 1),
            new Tile({ x: 0, y: 0 }, 'a', 1),
            new Tile({ x: 0, y: 0 }, 'A', 1),
            new Tile({ x: 0, y: 0 }, 'A', 1),
            new Tile({ x: 0, y: 0 }, 'A', 1),
            new Tile({ x: 0, y: 0 }, 'A', 1),
            new Tile({ x: 0, y: 0 }, 'A', 1),
        ],
        isTurn: true,
        host: true,
        sideQuest: {} as Quest,
    },
    {
        name: 'Johhny Le Terrible',
        playerId: 'johnyLeTerrible',
        score: 0,
        tiles: [
            new Tile({ x: 0, y: 0 }, 'A', 1),
            new Tile({ x: 0, y: 0 }, 'A', 1),
            new Tile({ x: 0, y: 0 }, 'A', 1),
            new Tile({ x: 0, y: 0 }, 'A', 1),
            new Tile({ x: 0, y: 0 }, 'A', 1),
            new Tile({ x: 0, y: 0 }, 'A', 1),
            new Tile({ x: 0, y: 0 }, 'A', 1),
        ],
        isTurn: false,
        host: false,
        sideQuest: {} as Quest,
    },
];
export const DEFAULT_LOBBY_ID = 'testingTimer';
export const INITIAL_SCORE = 0;
export const CHAT_MESSAGE_EXEMPLE = {
    author: TypeOfUser.SYSTEM,
    text: MESSAGE_PLAYER_TURN + 'wrap',
    date: new Date(),
    lobbyId: LOBBY_TEST_VALUE,
    socketId: '',
} as ChatMessage;
export const VP_MESSAGE: ChatMessage = {
    author: TypeOfUser.OPPONENT_PLAYER,
    text: '',
    date: new Date(),
    lobbyId: 'LOBBY_ID',
    socketId: 'ppp',
} as ChatMessage;
export const WORD_VALIDATION: WordValidation = {
    parsedInfo: {
        lobbyId: DEFAULT_LOBBY_ID,
        lettersCommand: '',
        position: { x: 0, y: 0 } as Vec2,
        direction: DirectionType.HORIZONTAL,
        scrabbleGrid: { elements: [] } as ScrabbleGrid,
    } as ParsedInfo,
    tiles: { newTilesToAdd: [], tilesOnGrid: [], tilesCompleteWord: [], adjacentWords: [], adjacentTiles: [] } as TilesValidation,
} as WordValidation;
export const PLACE_COMMAND: PlaceCommand = {
    name: CommandType.PLACE,
    startPosition: { x: 0, y: 0 } as Vec2,
    direction: DirectionType.HORIZONTAL,
    letters: '',
} as PlaceCommand;
