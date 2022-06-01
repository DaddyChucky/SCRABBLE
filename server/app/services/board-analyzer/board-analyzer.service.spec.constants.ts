/* eslint-disable @typescript-eslint/no-magic-numbers */
import { GRID_SQUARES_PER_LINE } from '@app/classes/constants';
import { TestHelper } from '@app/classes/test-helper';
import { ColorName } from '@common/model/color-name';
import { DirectionType } from '@common/model/direction-type';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Square } from '@common/model/square';
import { Tile } from '@common/model/tile';
import { Vec2 } from '@common/model/vec2';
import * as serviceConstants from './board-analyzer.service.constants';

export type FictionPointsPercolationData = {
    index: number;
    letters: string;
    fictionPoints: number;
    anchor: Vec2;
    boardPositionsArray: string[];
    multiplier: number;
};
export type WordAndLettersUsed = { word: string; playerLetters: string };
export const DEFAULT = 'francais';
export const TILES: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'b', 3),
    new Tile({ x: 0, y: 1 } as Vec2, 'o', 1),
    new Tile({ x: 0, y: 2 } as Vec2, 'n', 1),
    new Tile({ x: 0, y: 3 } as Vec2, 'j', 8),
    new Tile({ x: 0, y: 4 } as Vec2, 'o', 1),
    new Tile({ x: 0, y: 5 } as Vec2, 'u', 1),
    new Tile({ x: 0, y: 6 } as Vec2, 'r', 1),
    new Tile({ x: 2, y: 3 } as Vec2, 'a', 2),
    new Tile({ x: 2, y: 4 } as Vec2, 'm', 2),
    new Tile({ x: 2, y: 5 } as Vec2, 'i', 2),
    new Tile({ x: 5, y: 2 } as Vec2, 'b', 3),
    new Tile({ x: 6, y: 2 } as Vec2, 'o', 1),
    new Tile({ x: 7, y: 2 } as Vec2, 'n', 1),
    new Tile({ x: 8, y: 2 } as Vec2, 'j', 8),
    new Tile({ x: 9, y: 2 } as Vec2, 'o', 1),
    new Tile({ x: 10, y: 2 } as Vec2, 'u', 1),
    new Tile({ x: 11, y: 2 } as Vec2, 'r', 1),
    new Tile({ x: 6, y: 4 } as Vec2, 'm', 3),
    new Tile({ x: 7, y: 4 } as Vec2, 'i', 1),
    new Tile({ x: 8, y: 4 } as Vec2, 'c', 1),
    new Tile({ x: 9, y: 4 } as Vec2, 'h', 8),
    new Tile({ x: 10, y: 4 } as Vec2, 'e', 1),
    new Tile({ x: 11, y: 4 } as Vec2, 'l', 1),
    new Tile({ x: 12, y: 6 } as Vec2, 'a', 1),
    new Tile({ x: 13, y: 6 } as Vec2, 'i', 1),
    new Tile({ x: 14, y: 6 } as Vec2, 'n', 1),
    new Tile({ x: 14, y: 7 } as Vec2, 'l', 3),
    new Tile({ x: 14, y: 8 } as Vec2, 'l', 1),
    new Tile({ x: 14, y: 9 } as Vec2, 'e', 1),
];
export const TEST_HELPER: TestHelper = new TestHelper({ elements: [] } as ScrabbleGrid);
export const VALID_SQUARE: Square = {
    position: { x: 0, y: 0 } as Vec2,
    color: ColorName.TILE_DEFAULT,
    wordMultiplier: 0,
    letterMultiplier: 0,
    name: '',
    tile: TILES[0],
} as Square;
export const POSITION_STUB = 8;
export const INVALID_POSITION = -1;
export const OUT_OF_BOUNDS_POSITION = GRID_SQUARES_PER_LINE * GRID_SQUARES_PER_LINE + 1;
export const TIME_FACTOR_TO_SECONDS = 1000;
export const EXPECTED_PERCOLATE_NUMBERS: number[] = [-14, 16, -29, 31, -44, 46, -59, 61, -74, 76, -89, 91, -104, 106, 1];
export const DEFAULT_PERCOLATE_OFFSET = 1;
export const LIST_OF_1D_POS: number[] = [0, 1, 15, 17, 43, 70, 224];
export const EXPECTED_VEC2: Vec2[] = [
    { x: 0, y: 0 } as Vec2,
    { x: 1, y: 0 } as Vec2,
    { x: 0, y: 1 } as Vec2,
    { x: 2, y: 1 } as Vec2,
    { x: 13, y: 2 } as Vec2,
    { x: 10, y: 4 } as Vec2,
    { x: 14, y: 14 } as Vec2,
];
export const INDEXABLE_ANCHORS: serviceConstants.LetPos[][] = [
    [
        { letter: null } as serviceConstants.LetPos,
        { letter: null, pos: EXPECTED_VEC2[0] } as serviceConstants.LetPos,
        { letter: 'a', pos: EXPECTED_VEC2[1] } as serviceConstants.LetPos,
        { letter: null } as serviceConstants.LetPos,
    ],
];
export const ANCHOR_INDEX = 1;
export const IMPOSSIBLE_ANCHOR_INDEX = 2;
export const STUB_PATHS: string[] = ['abcd', 'e', 'cca', 'cca', 'zz'];
export const STUB_POSSIBILITIES: serviceConstants.LetPos[][] = [
    [{ letter: 'a' } as serviceConstants.LetPos, { letter: 'c' } as serviceConstants.LetPos],
    [{ letter: 'a' } as serviceConstants.LetPos, { letter: 'c' } as serviceConstants.LetPos],
    [{ letter: 'c' } as serviceConstants.LetPos, { letter: 'c' } as serviceConstants.LetPos],
    [{ letter: 'c' } as serviceConstants.LetPos, { letter: 'd' } as serviceConstants.LetPos],
    [{ letter: 'z' } as serviceConstants.LetPos, { letter: 'z' } as serviceConstants.LetPos],
];
export const EXPECTED_LETTERS_LEFT: string[] = ['bd', 'e', 'a', 'ca', ''];
export const STUB_LETTERS: string[] = ['a', 'b', 'c', 'z'];
export const STUB_OCCURRENCES: string[] = ['baaa', 'a', 'abcdef', 'zzzzz'];
export const EXPECTED_OCCURRENCES: number[] = [3, 0, 1, 5];
export const LETTER_ADDITION_INFORMATION_STUB: serviceConstants.LetterAdditionInformation = {
    letters: 'b',
    reverse: true,
    percolationDirection: serviceConstants.PercolationDirection.UP,
} as serviceConstants.LetterAdditionInformation;
export const STUB_SET_PATH: Set<string> = new Set<string>();
export const VALID_WORD = 'bete';
export const INVALID_WORD = 'zyote';
export const HOT_LETTER_POS: Vec2 = { x: 0, y: 0 } as Vec2;
export const NON_HOT_LETTER_POS: Vec2 = { x: 3, y: 4 } as Vec2;
export const EXPECTED_POINTS_HOT_A = 2;
export const EXPECTED_POINTS_NON_HOT_A = 1;
export const DEFAULT_HOT_FACTOR = 1;
export const POSSIBLE_WORD_FORMING_DATA = {
    possibleWords: [new Set<string>()],
    index: 0,
    from: 0,
    ofLetPos: 0,
    listOfLetPos: [[{ letter: 'a' } as serviceConstants.LetPos]],
    playerLetters: STUB_LETTERS[0],
} as serviceConstants.PossibleWordFormingData;
export const TILES_ONE_WORD: Tile[] = [new Tile({ x: 7, y: 7 } as Vec2, 'l', 3), new Tile({ x: 8, y: 7 } as Vec2, 'a', 1)];
export const INITIAL_WORD_POSSIBILITY: serviceConstants.WordPossibility = {
    word: 'lapins',
    playerLetters: 'lapins',
    weight: 0,
    anchor: { x: 7, y: 8 } as Vec2,
    wordDirection: DirectionType.HORIZONTAL,
} as serviceConstants.WordPossibility;
export const EXPECTED_WORD_POSSIBILITY: serviceConstants.WordPossibility = {
    word: 'lapins',
    playerLetters: 'lapins',
    weight: 0,
    anchor: { x: 7, y: 8 } as Vec2,
    wordDirection: DirectionType.HORIZONTAL,
} as serviceConstants.WordPossibility;
export const GRID_SIZE = 15;
export const EXPECTED_WORD_POSSIBILITY_VERTICAL: serviceConstants.WordPossibility = {
    word: 'lapins',
    playerLetters: 'lapins',
    weight: 0,
    anchor: { x: 7, y: 7 } as Vec2,
    wordDirection: DirectionType.VERTICAL,
} as serviceConstants.WordPossibility;
export const ANCHOR_VERTICAL: Vec2 = { x: 7, y: 7 } as Vec2;
