import { PlayerMock } from '@app/classes/player-mock';
import { Q_CORNERS_2X, Q_FIVE_SECONDS_MOVE } from '@app/services/quest-verify/quest-verify.service.spec.constants';
import { DirectionType } from '@common/model/direction-type';
import { GridTiles } from '@common/model/grid-tiles';
import { LetterBag } from '@common/model/letter-bag/letter-bag';
import { MultiplayerLobby } from '@common/model/lobby';
import { LobbyStatus } from '@common/model/lobby-status';
import { LobbyType } from '@common/model/lobby-type';
import { ParsedInfo } from '@common/model/parsed-info';
import { Player } from '@common/model/player';
import { Quest } from '@common/model/quest';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Tile } from '@common/model/tile';
import { TilesValidation } from '@common/model/tiles-validation';
import { Vec2 } from '@common/model/vec2';
import { WordValidation } from '@common/model/word-validation';
import { Guid } from 'guid-typescript';

export const MAX_NUMBER_TURN_PASSED = 6;
export const PLAYER_1: PlayerMock = {
    name: 'Roger',
    score: 0,
    playerId: '0',
    tiles: [] as Tile[],
    isTurn: true,
    host: true,
} as PlayerMock;
export const PLAYER_2: PlayerMock = {
    name: 'Gontrand',
    score: 0,
    playerId: '1',
    tiles: [] as Tile[],
    isTurn: false,
    host: false,
} as PlayerMock;
export const TURN_NB_RESET = 0;
export const TURN_PASSED_BASE = 3;
export const TURN_PASSED_INC = 4;
export const TURN_PASSED_LIMIT = 5;
export const WORD = 'human';
export const TILES: Tile[] = [
    new Tile({ x: 0, y: 4 } as Vec2, 'L', 1),
    new Tile({ x: 0, y: 5 } as Vec2, 'A', 1),
    new Tile({ x: 0, y: 6 } as Vec2, 'P', 3),
    new Tile({ x: 0, y: 7 } as Vec2, 'I', 1),
    new Tile({ x: 0, y: 8 } as Vec2, 'N', 1),
];
export const INVALID_WORD: Tile[] = [
    new Tile({ x: 1, y: 4 } as Vec2, 'A', 1),
    new Tile({ x: 1, y: 5 } as Vec2, 'A', 1),
    new Tile({ x: 1, y: 6 } as Vec2, 'E', 1),
    new Tile({ x: 1, y: 7 } as Vec2, 'E', 1),
    new Tile({ x: 1, y: 8 } as Vec2, 'E', 1),
];
export const GRID_TILES: GridTiles = {
    grid: { elements: [] } as ScrabbleGrid,
    tiles: TILES,
};
export const NEW_POINTS = 7;
export const INITAL_SCORE = 15;
export const TILES_VALIDATION: TilesValidation = {
    tilesCompleteWord: TILES,
    tilesOnGrid: [],
    newTilesToAdd: [],
    adjacentWords: [],
    adjacentTiles: [],
} as TilesValidation;
export const INVALID_TILES_VALIDATION: TilesValidation = {
    tilesCompleteWord: INVALID_WORD,
    tilesOnGrid: [],
    newTilesToAdd: [],
    adjacentWords: [],
    adjacentTiles: [],
} as TilesValidation;
export const COMPLETE_WORD_MOCK = 'maiSon';
export const PARSED_INFO: ParsedInfo = {
    lobbyId: 'secretLobby',
    lettersCommand: 'maiSon',
    position: { x: 0, y: 0 } as Vec2,
    direction: DirectionType.HORIZONTAL,
    completeWord: COMPLETE_WORD_MOCK,
    scrabbleGrid: { elements: [] } as ScrabbleGrid,
} as ParsedInfo;
export const VALID_WORD_VALIDATION: WordValidation = {
    parsedInfo: PARSED_INFO,
    tiles: TILES_VALIDATION,
};
export const INVALID_WORD_VALIDATION: WordValidation = {
    parsedInfo: PARSED_INFO,
    tiles: INVALID_TILES_VALIDATION,
};
export const WORD_VALIDATION_WITH_ONLY_BLANK_TILES: WordValidation = {
    parsedInfo: {
        lobbyId: '',
        lettersCommand: '',
        position: { x: 0, y: 0 } as Vec2,
        direction: DirectionType.HORIZONTAL,
        scrabbleGrid: { elements: [] } as ScrabbleGrid,
    } as ParsedInfo,
    tiles: {
        tilesCompleteWord: [],
        tilesOnGrid: [],
        newTilesToAdd: [
            new Tile({ x: 0, y: 4 } as Vec2, 'A', 1),
            new Tile({ x: 0, y: 5 } as Vec2, 'B', 1),
            new Tile({ x: 0, y: 6 } as Vec2, 'C', 3),
            new Tile({ x: 0, y: 7 } as Vec2, 'D', 1),
            new Tile({ x: 0, y: 8 } as Vec2, 'E', 1),
            new Tile({ x: 0, y: 8 } as Vec2, 'F', 3),
        ],
        adjacentWords: [],
        adjacentTiles: [],
    } as TilesValidation,
};
export const WORD_VALIDATION_BLANK_TILE: WordValidation = {
    parsedInfo: {
        lobbyId: '',
        lettersCommand: '',
        position: { x: 0, y: 0 } as Vec2,
        direction: DirectionType.HORIZONTAL,
        completeWord: 'ABCDEF',
        scrabbleGrid: { elements: [] } as ScrabbleGrid,
    } as ParsedInfo,
    tiles: {
        tilesCompleteWord: [],
        tilesOnGrid: [],
        newTilesToAdd: [],
        adjacentWords: [],
        adjacentTiles: [],
    } as TilesValidation,
};
export const WORD_WITH_NO_BLANK_TILE = 'lapin';
export const WORD_ALL_BLANK_TILES = 'ABCDEF';
export const TILES_RU: Tile[] = [new Tile({ x: 0, y: 4 } as Vec2, 'R', 1), new Tile({ x: 0, y: 5 } as Vec2, 'U', 1)];
export const NULL_TIMER = 0;
export const POSITIVE_TIMER = 10;
export const WORD_WITH_BLANK_TILE = 'Ru';
export const PLAYER1: Player = {
    name: 'bob',
    score: 12,
    playerId: 'aihaidhs',
    isTurn: true,
    tiles: [],
    host: true,
    sideQuest: {} as Quest,
} as Player;
export const PLAYER2: Player = {
    name: 'bobs friend',
    score: 14,
    playerId: 'no',
    isTurn: true,
    tiles: [],
    host: true,
    sideQuest: {} as Quest,
} as Player;
export const EXPECTED_LOBBY: MultiplayerLobby = {
    dictionary: 'FRENCH',
    lobbyType: LobbyType.CLASSIC,
    playerList: [PLAYER1, PLAYER2],
    baseTimerValue: 60,
    letterBag: new LetterBag(),
    timeLeft: 0,
    lobbyId: Guid.create().toString(),
    lobbyStatus: LobbyStatus.CREATED,
    sideQuests: [Q_CORNERS_2X, Q_FIVE_SECONDS_MOVE] as Quest[],
} as MultiplayerLobby;
export const ACCOMPLISHED_QUEST = [Q_CORNERS_2X, Q_FIVE_SECONDS_MOVE] as Quest[];
