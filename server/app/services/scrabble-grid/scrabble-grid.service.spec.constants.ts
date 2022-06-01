/* eslint-disable @typescript-eslint/no-magic-numbers */
import { SQUARE_WITHOUT_MULTIPLIER } from '@app/classes/constants';
import { ColorName } from '@common/model/color-name';
import { DirectionType } from '@common/model/direction-type';
import { ParsedInfo } from '@common/model/parsed-info';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Square } from '@common/model/square';
import { Tile } from '@common/model/tile';
import { TilesValidation } from '@common/model/tiles-validation';
import { Vec2 } from '@common/model/vec2';

export const TILES_OF_GRID: Tile[] = [
    new Tile({ x: 7, y: 4 } as Vec2, 'L', 1),
    new Tile({ x: 7, y: 5 } as Vec2, 'E', 1),
    new Tile({ x: 7, y: 6 } as Vec2, 'S', 1),
    new Tile({ x: 7, y: 8 } as Vec2, 'L', 1),
    new Tile({ x: 7, y: 9 } as Vec2, 'A', 1),
    new Tile({ x: 7, y: 10 } as Vec2, 'P', 1),
    new Tile({ x: 7, y: 11 } as Vec2, 'I', 1),
    new Tile({ x: 7, y: 12 } as Vec2, 'N', 1),
    new Tile({ x: 7, y: 13 } as Vec2, 'S', 1),
    new Tile({ x: 8, y: 7 } as Vec2, 'H', 4),
    new Tile({ x: 9, y: 7 } as Vec2, 'U', 1),
    new Tile({ x: 10, y: 7 } as Vec2, 'M', 2),
    new Tile({ x: 11, y: 7 } as Vec2, 'A', 1),
    new Tile({ x: 12, y: 7 } as Vec2, 'I', 1),
    new Tile({ x: 13, y: 7 } as Vec2, 'N', 1),
    new Tile({ x: 6, y: 7 } as Vec2, 'N', 1),
    new Tile({ x: 5, y: 7 } as Vec2, 'U', 1),
    new Tile({ x: 3, y: 5 } as Vec2, 'A', 1),
    new Tile({ x: 3, y: 6 } as Vec2, 'L', 1),
    new Tile({ x: 3, y: 7 } as Vec2, 'L', 1),
    new Tile({ x: 3, y: 8 } as Vec2, 'O', 1),
    new Tile({ x: 5, y: 1 } as Vec2, 'A', 1),
    new Tile({ x: 6, y: 1 } as Vec2, 'L', 1),
    new Tile({ x: 7, y: 1 } as Vec2, 'L', 1),
    new Tile({ x: 8, y: 1 } as Vec2, 'O', 1),
    new Tile({ x: 9, y: 0 } as Vec2, 'L', 1),
    new Tile({ x: 10, y: 0 } as Vec2, 'A', 1),
    new Tile({ x: 11, y: 0 } as Vec2, 'M', 1),
    new Tile({ x: 12, y: 0 } as Vec2, 'A', 1),
    new Tile({ x: 13, y: 13 } as Vec2, 'A', 1),
    new Tile({ x: 14, y: 13 } as Vec2, 'N', 1),
    new Tile({ x: 13, y: 14 } as Vec2, 'N', 1),
    new Tile({ x: 0, y: 5 } as Vec2, 'S', 1),
    new Tile({ x: 0, y: 6 } as Vec2, 'U', 1),
    new Tile({ x: 0, y: 7 } as Vec2, 'C', 1),
    new Tile({ x: 0, y: 8 } as Vec2, 'R', 1),
    new Tile({ x: 0, y: 9 } as Vec2, 'E', 1),
    new Tile({ x: 2, y: 8 } as Vec2, 'D', 1),
];
export const PARSED_INFO_CREATE: ParsedInfo = {
    lobbyId: 'lobby',
    scrabbleGrid: { elements: [] } as ScrabbleGrid,
    lettersCommand: 'al',
    completeWord: 'allo',
    position: { x: 0, y: 0 } as Vec2,
    direction: DirectionType.HORIZONTAL,
} as ParsedInfo;
export const HORIZONTAL_BEFORE_WORD = 'un';
export const HORIZONTAL_AFTER_WORD = 'humain';
export const VERTICAL_BEFORE_WORD = 'les';
export const VERTICAL_AFTER_WORD = 'lapins';
export const MIDDLE_SQUARE_POSITION: Vec2 = { x: 7, y: 7 } as Vec2;
export const PARSED_INFO = {
    lettersCommand: 'A',
    position: MIDDLE_SQUARE_POSITION,
    direction: DirectionType.HORIZONTAL,
} as ParsedInfo;
export const PARSED_INFO_MULTIPLE_LETTERS = {
    lettersCommand: 'aa',
    position: MIDDLE_SQUARE_POSITION,
    direction: DirectionType.HORIZONTAL,
} as ParsedInfo;
export const POSITION_NO_DIRECTION_HORIZONTAL = { x: 4, y: 7 } as Vec2;
export const POSITION_NO_DIRECTION_VERTICAL = { x: 7, y: 2 } as Vec2;
export const WORD_NO_DIRECTION_HORIZONTAL = 'lAun';
export const WORD_NO_DIRECTION_VERTICAL = 'lA';
export const LETTER_L = 'l';
export const LETTER_A = 'a';
export const LETTER_C = 'c';
export const WORDS_TO_REVERSE: string[] = ['patins', 'manger', 'humain', 'survivre', 'trou', 'noir', 'depression', 'allo_', '1234', 'a'];
export const WORDS_REVERSED: string[] = ['snitap', 'regnam', 'niamuh', 'ervivrus', 'uort', 'rion', 'noisserped', '_olla', '4321', 'a'];
export const POSITION_FIND_BEFORE_NO_DIR: Vec2 = { x: 9, y: 1 } as Vec2;
export const POSITION_END_OF_GRID: Vec2 = { x: 14, y: 14 } as Vec2;
export const WORD_N = 'n';
export const WORD_HELLO = 'allo';
export const TILES_HELLO: Tile[] = [
    new Tile({ x: 5, y: 1 } as Vec2, 'A', 1),
    new Tile({ x: 6, y: 1 } as Vec2, 'L', 1),
    new Tile({ x: 7, y: 1 } as Vec2, 'L', 1),
    new Tile({ x: 8, y: 1 } as Vec2, 'O', 1),
];
export const TILES_LES: Tile[] = [
    new Tile({ x: 7, y: 4 } as Vec2, 'L', 1),
    new Tile({ x: 7, y: 5 } as Vec2, 'E', 1),
    new Tile({ x: 7, y: 6 } as Vec2, 'S', 1),
];
export const NEW_TILES_VALIDATION: TilesValidation = {
    tilesCompleteWord: [
        new Tile({ x: 2, y: 8 } as Vec2, 'D', 1),
        new Tile({ x: 3, y: 8 } as Vec2, 'O', 1),
        new Tile({ x: 7, y: 10 } as Vec2, 'P', 1),
        new Tile({ x: 7, y: 11 } as Vec2, 'I', 1),
    ],
    tilesOnGrid: [new Tile({ x: 7, y: 10 } as Vec2, 'P', 1), new Tile({ x: 7, y: 11 } as Vec2, 'I', 1)],
    newTilesToAdd: [new Tile({ x: 2, y: 8 } as Vec2, 'D', 1), new Tile({ x: 3, y: 8 } as Vec2, 'O', 1)],
    adjacentTiles: [],
    adjacentWords: [],
} as TilesValidation;
export const TILES_VALIDATION: TilesValidation = {
    tilesCompleteWord: [],
    tilesOnGrid: [],
    newTilesToAdd: [],
    adjacentWords: [],
    adjacentTiles: [],
} as TilesValidation;
export const TILE_A: Tile = new Tile(MIDDLE_SQUARE_POSITION, 'A', 1);
export const TILE_X: Tile = new Tile(MIDDLE_SQUARE_POSITION, 'X', 10);
export const TILES_HUMAN_HORIZONTAL: Tile[] = [
    new Tile({ x: 7, y: 7 } as Vec2, 'H', 4),
    new Tile({ x: 8, y: 7 } as Vec2, 'U', 1),
    new Tile({ x: 9, y: 7 } as Vec2, 'M', 2),
    new Tile({ x: 10, y: 7 } as Vec2, 'A', 1),
    new Tile({ x: 11, y: 7 } as Vec2, 'I', 1),
    new Tile({ x: 12, y: 7 } as Vec2, 'N', 1),
];
export const TILES_HUMAN_VERTICAL: Tile[] = [
    new Tile({ x: 7, y: 7 } as Vec2, 'H', 4),
    new Tile({ x: 7, y: 8 } as Vec2, 'U', 1),
    new Tile({ x: 7, y: 9 } as Vec2, 'M', 2),
    new Tile({ x: 7, y: 10 } as Vec2, 'A', 1),
    new Tile({ x: 7, y: 11 } as Vec2, 'I', 1),
    new Tile({ x: 7, y: 12 } as Vec2, 'N', 1),
];
export const TILES_HORIZONTAL_DIRECTION: Tile[] = [
    new Tile({ x: 5, y: 7 } as Vec2, 'U', 1),
    new Tile({ x: 6, y: 7 } as Vec2, 'N', 1),
    new Tile({ x: 7, y: 7 } as Vec2, 'A', 1),
    new Tile({ x: 8, y: 7 } as Vec2, 'H', 4),
    new Tile({ x: 9, y: 7 } as Vec2, 'U', 1),
    new Tile({ x: 10, y: 7 } as Vec2, 'M', 2),
    new Tile({ x: 11, y: 7 } as Vec2, 'A', 1),
    new Tile({ x: 12, y: 7 } as Vec2, 'I', 1),
    new Tile({ x: 13, y: 7 } as Vec2, 'N', 1),
];
export const TILES_VERTICAL_DIRECTION: Tile[] = [
    new Tile({ x: 7, y: 4 } as Vec2, 'L', 1),
    new Tile({ x: 7, y: 5 } as Vec2, 'E', 1),
    new Tile({ x: 7, y: 6 } as Vec2, 'S', 1),
    new Tile({ x: 7, y: 7 } as Vec2, 'A', 1),
    new Tile({ x: 7, y: 8 } as Vec2, 'L', 1),
    new Tile({ x: 7, y: 9 } as Vec2, 'A', 1),
    new Tile({ x: 7, y: 10 } as Vec2, 'P', 1),
    new Tile({ x: 7, y: 11 } as Vec2, 'I', 1),
    new Tile({ x: 7, y: 12 } as Vec2, 'N', 1),
    new Tile({ x: 7, y: 13 } as Vec2, 'S', 1),
];
export const TILES_VERTICAL_DIRECTION_COMPLEX: Tile[] = [
    new Tile({ x: 7, y: 1 } as Vec2, 'L', 1),
    new Tile(POSITION_NO_DIRECTION_VERTICAL, 'A', 1),
    new Tile({ x: 7, y: 3 } as Vec2, 'A', 1),
];
export const TILES_HORIZONTAL_DIRECTION_COMPLEX: Tile[] = [
    new Tile({ x: 0, y: 8 } as Vec2, 'R', 1),
    new Tile({ x: 1, y: 8 } as Vec2, 'A', 1),
    new Tile({ x: 2, y: 8 } as Vec2, 'D', 1),
    new Tile({ x: 3, y: 8 } as Vec2, 'O', 1),
    new Tile({ x: 4, y: 8 } as Vec2, 'A', 1),
    new Tile({ x: 5, y: 8 } as Vec2, 'A', 1),
];
export const TILES_COMPLETE_WORD: Tile[] = [TILE_X];
TILES_COMPLETE_WORD.push(...TILES_HUMAN_VERTICAL);
export const INITIAL_SQUARE: Square = {
    position: { x: 0, y: 0 },
    color: ColorName.BEIGE,
    wordMultiplier: SQUARE_WITHOUT_MULTIPLIER,
    letterMultiplier: SQUARE_WITHOUT_MULTIPLIER,
    name: 'A1',
    tile: null,
} as Square;
export const CHECK_SIDE_AFTER_POSITION_CALLS = 2;
export const INITIAL_WORD = 'A';
