/* eslint-disable @typescript-eslint/no-magic-numbers */
import { GRID_SQUARES_PER_LINE } from '@app/../../../common/model/constants';
import { Vec2 } from '@app/../../../common/model/vec2';

export const SYNTAX_ERROR_MESSAGE = 'Erreur de syntaxe';
export const INVALID_COMMAND_ERROR_MESSAGE = 'Commande impossible à réaliser';
export const INVALID_INPUT_ERROR_MESSAGE = 'Entrée invalide';
export const TILE_FONT_SIZE_GRID_MIN = 16;
export const TILE_FONT_SIZE_GRID_MAX = 30;
export const DEFAULT_TILE_SIZE_ON_GRID = 47;
export const BIGGER_LETTER: string[] = ['K', 'X', 'W', 'Z', 'Y'];
export const MAX_SIZE_FOR_BIGGER_LETTER = 25;
export const SLIDER_FONT_SIZE_STEP = 2;
export const SQUARE_WITHOUT_MULTIPLIER = 1;
export const MIDDLE_SQUARE_POSITION: Vec2 = { x: 7, y: 7 } as Vec2;
export const TILES_WEIGHT: number[] = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 10, 1, 2, 1, 1, 3, 8, 1, 1, 1, 1, 4, 10, 10, 10, 10, 0];
export const TILES_DEFAULT_QUANTITY: number[] = [9, 2, 2, 3, 15, 2, 2, 2, 8, 1, 1, 5, 3, 6, 6, 2, 1, 6, 6, 6, 6, 2, 1, 1, 1, 1, 2];
export const CHAT_MESSAGE_MAX_LENGTH = 512;
export const GRID_LINE_WIDTH = 2;
export const ASCII_LETTER_END_MAJ = 90;
export const ASCII_LETTER_START_MIN = 97;
export const ASCII_LETTER_END_MIN = 122;
export const TILE_MAX_WEIGHT = 10;
export const TILE_STAR_CHAR_ASCII = 42;
export const NUMBER_OF_SQUARES = GRID_SQUARES_PER_LINE * GRID_SQUARES_PER_LINE;
export const MIN_TILES_PER_PLAYER = 0;
export const TILE_SIZE_IN_EASEL = 90;
export const TILE_FONT_SIZE_EASEL = 70;
export const TILE_FONT_SIZE_GRID = 24;
export const TILE_BORDER_WIDTH = 4;
export const GRID_LABEL_OFFSET_FACTOR = 0.05;
export const GRID_CENTER = 'H8';
export const CSS_CLASS_IS_TURN = 'isTurn';
export const CSS_CLASS_IS_NOT_TURN = 'isNotTurn';
export const MESSAGE_PLAYER_TURN = "C'est au tour du joueur ";
export const CHAT_MESSAGE_MIN_LENGTH = 1;
export const TIMER_INTERVAL_VALUE_ONE_SECOND = 1000;
export const GRID_DEFAULT_FONT = '25px sans-serif';
export const GRID_ROW_LABELS = 'ABCDEFGHIJKLMNO';
export const GRID_WORD_PREMIUM_NAME = 'MOT';
export const GRID_LETTER_PREMIUM_NAME = 'LETTRE';
export const GRID_X2_PREMIUM_NAME = 'x 2';
export const GRID_X3_PREMIUM_NAME = 'x 3';
export const PREMIUM_SQUARE_FONT = '14px sans-serif';
export const TILE_LETTER_FONT = '25px sans-serif';
export const TILE_WEIGHT_FONT = '10px sans-serif';
export const TILE_NAMES = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '*',
];
