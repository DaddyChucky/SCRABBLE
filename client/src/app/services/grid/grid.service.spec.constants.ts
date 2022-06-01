/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ColorName } from '@app/../../../common/model/color-name';
import { GRID_DEFAULT_HEIGHT, GRID_DEFAULT_WIDTH, GRID_SQUARES_PER_LINE } from '@app/../../../common/model/constants';
import { DirectionType } from '@app/../../../common/model/direction-type';
import { Square } from '@app/../../../common/model/square';
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';
import { WordRequest } from '@app/../../../common/model/word-request';
import * as serviceConstants from '@app/classes/constants';

export const NUMBER_OF_PREMIUM_SQUARES = 60;
export const NUMBER_OF_LAST_LINES_OF_GRID = 2;
export const SQUARE_WIDTH = GRID_DEFAULT_WIDTH / GRID_SQUARES_PER_LINE;
export const END_POSITION: Vec2 = { x: GRID_DEFAULT_WIDTH - SQUARE_WIDTH, y: GRID_DEFAULT_HEIGHT - SQUARE_WIDTH } as Vec2;
export const CANVAS_GRID_LABEL_OFFSET = GRID_DEFAULT_WIDTH * serviceConstants.GRID_LABEL_OFFSET_FACTOR;
export const CANVAS_SQUARE_LENGTH = (GRID_DEFAULT_WIDTH - CANVAS_GRID_LABEL_OFFSET) / GRID_SQUARES_PER_LINE;
export const GRID_DEFAULT_STROKE_STYLE = '#ffffff';
export const NEGATIVE_ROW_INDEX = -1;
export const VALID_ROW_INDEX = 0;
export const DEFAULT_CANVAS_FONT = '10px sans-serif';
export const DEFAULT_CANVAS_FILLSTYLE = '#000000';
export const MAX_NUMBER_OF_POSITIONS = 100;
export const POSITIONS: Vec2[] = [
    { x: 0, y: 0 } as Vec2,
    { x: 7, y: 0 } as Vec2,
    { x: 14, y: 0 } as Vec2,
    { x: 14, y: 7 } as Vec2,
    { x: 14, y: 14 } as Vec2,
    { x: 7, y: 14 } as Vec2,
    { x: 0, y: 14 } as Vec2,
    { x: 0, y: 7 } as Vec2,
    { x: 3, y: 3 } as Vec2,
    { x: 7, y: 7 } as Vec2,
    { x: 11, y: 11 } as Vec2,
    { x: 11, y: 3 } as Vec2,
    { x: 3, y: 11 } as Vec2,
];
export const INVALID_POSITIONS: Vec2[] = [
    { x: -1, y: -1 } as Vec2,
    { x: -1, y: 0 } as Vec2,
    { x: 0, y: -1 } as Vec2,
    { x: GRID_SQUARES_PER_LINE, y: GRID_SQUARES_PER_LINE } as Vec2,
];
export const INVALID_POSITIONS_CANVAS: Vec2[] = [
    { x: -1, y: -1 } as Vec2,
    { x: -1, y: 0 } as Vec2,
    { x: 0, y: -1 } as Vec2,
    { x: GRID_DEFAULT_WIDTH + 1, y: GRID_DEFAULT_HEIGHT + 1 } as Vec2,
];
export const VALID_POSITIONS_CANVAS: Vec2[] = [
    { x: 0, y: 0 } as Vec2,
    { x: 100, y: 300 } as Vec2,
    { x: 2, y: 300 } as Vec2,
    { x: GRID_DEFAULT_WIDTH - 1, y: GRID_DEFAULT_HEIGHT - 1 } as Vec2,
];
export const NAMES: string[] = ['A1', 'A8', 'A15', 'H15', 'O15', 'O8', 'O1', 'H1', 'D4', 'H8', 'L12', 'D12', 'L4'];
export const INITIAL_SQUARE_STUB: Square = {
    tile: null,
} as Square;
export const START_SQUARE_POSITIONS: Vec2 = POSITIONS[Math.floor(POSITIONS.length / 2)];
export const INVALID_SQUARE_POSITIONS: Vec2[] = [
    { x: NEGATIVE_ROW_INDEX, y: NEGATIVE_ROW_INDEX } as Vec2,
    { x: NEGATIVE_ROW_INDEX, y: VALID_ROW_INDEX } as Vec2,
    { x: VALID_ROW_INDEX, y: NEGATIVE_ROW_INDEX } as Vec2,
    { x: GRID_SQUARES_PER_LINE, y: GRID_SQUARES_PER_LINE } as Vec2,
];
export const NOT_MIDDLE_SQUARE: Square = {
    position: { x: 0, y: 0 },
    color: ColorName.BEIGE,
    wordMultiplier: serviceConstants.SQUARE_WITHOUT_MULTIPLIER,
    letterMultiplier: serviceConstants.SQUARE_WITHOUT_MULTIPLIER,
    name: 'A1',
    tile: null,
} as Square;
export const MIDDLE_SQUARE: Square = {
    position: serviceConstants.MIDDLE_SQUARE_POSITION,
    color: ColorName.BEIGE,
    wordMultiplier: serviceConstants.SQUARE_WITHOUT_MULTIPLIER,
    letterMultiplier: serviceConstants.SQUARE_WITHOUT_MULTIPLIER,
    name: serviceConstants.GRID_CENTER,
    tile: null,
} as Square;
export const TILE_ON_MIDDLE_SQUARE: Tile = new Tile(serviceConstants.MIDDLE_SQUARE_POSITION, 'a', 1);
export const EMPTY_STAR_IMAGE_SRC = '';
export const INITIAL_POSITION: Vec2 = { x: 0, y: 0 } as Vec2;
export const INVALID_WORD = '21/3';
export const VALID_WORD = 'abcdefghijklmnopqrstuvwxyz*';
export const SQUARE: Square = {
    position: INITIAL_POSITION,
    color: ColorName.BEIGE,
    wordMultiplier: serviceConstants.SQUARE_WITHOUT_MULTIPLIER,
    letterMultiplier: serviceConstants.SQUARE_WITHOUT_MULTIPLIER,
    name: 'A1',
    tile: null,
} as Square;
export const NORMAL_SQUARE: Square = {
    position: { x: 1, y: 0 } as Vec2,
    color: ColorName.BEIGE,
    wordMultiplier: serviceConstants.SQUARE_WITHOUT_MULTIPLIER,
    letterMultiplier: serviceConstants.SQUARE_WITHOUT_MULTIPLIER,
    name: 'A2',
    tile: null,
} as Square;
export const TILES_TO_ADD: Tile[] = [
    new Tile(INITIAL_POSITION, 'A', 1),
    new Tile(INITIAL_POSITION, 'B', 3),
    new Tile(INITIAL_POSITION, 'A', 1),
    new Tile(INITIAL_POSITION, 'B', 3),
];
export const TILES_ON_BOARD: Tile[] = [
    new Tile(INITIAL_POSITION, 'E', 1),
    new Tile(INITIAL_POSITION, 'E', 1),
    new Tile(INITIAL_POSITION, 'E', 1),
    new Tile(INITIAL_POSITION, 'E', 1),
];
export const TILES_OUTSIDE_GRID: Tile[] = [
    new Tile({ x: GRID_SQUARES_PER_LINE, y: GRID_SQUARES_PER_LINE } as Vec2, 'E', 1),
    new Tile({ x: GRID_SQUARES_PER_LINE, y: GRID_SQUARES_PER_LINE } as Vec2, 'A', 1),
];
export const POSITIONS_TO_ADD_TILES: Vec2[] = [{ x: 0, y: 0 } as Vec2, { x: 0, y: 1 } as Vec2, { x: 0, y: 2 } as Vec2, { x: 0, y: 3 } as Vec2];
export const WORD_REQUEST_STUB: WordRequest = {
    lobbyId: '',
    socketId: '',
    word: 'human',
    startPosition: { x: 7, y: 7 } as Vec2,
    direction: DirectionType.NONE,
} as WordRequest;
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
export const TILES_HUMAN_HORIZONTAL: Tile[] = [
    new Tile({ x: 7, y: 7 } as Vec2, 'H', 4),
    new Tile({ x: 8, y: 7 } as Vec2, 'U', 1),
    new Tile({ x: 9, y: 7 } as Vec2, 'M', 2),
    new Tile({ x: 10, y: 7 } as Vec2, 'A', 1),
    new Tile({ x: 11, y: 7 } as Vec2, 'I', 1),
    new Tile({ x: 12, y: 7 } as Vec2, 'N', 1),
];
export const DRAW_LINE_CALLS = 12;
export const CONVERT_GRID_POSITIONS_CALLS = 6;
export const INDEX_WITHOUT_LOCAL_HOST = 22;
export const WAIT_TIME_ONLOAD = 25;
export const INITIAL_SQUARE: Square = {
    position: { x: 0, y: 0 },
    color: ColorName.BEIGE,
    wordMultiplier: serviceConstants.SQUARE_WITHOUT_MULTIPLIER,
    letterMultiplier: serviceConstants.SQUARE_WITHOUT_MULTIPLIER,
    name: 'A1',
    tile: null,
} as Square;
