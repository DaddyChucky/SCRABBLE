/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Letter } from '@common/model/letter';
import { LetterBag } from '@common/model/letter-bag/letter-bag';
import { Player } from '@common/model/player';
import { Tile } from '@common/model/tile';

export const LETTER_A_STUB: Letter = {
    tile: new Tile({ x: 0, y: 0 }, 'A', 1),
    quantity: 12,
};
export const LETTER_B_STUB: Letter = {
    tile: new Tile({ x: 0, y: 0 }, 'B', 1),
    quantity: 8,
};
export const RANDOM_INDEX = 7;
export const INVALID_LETTER = '1';
export const DEFAULT_PLAYER_STUB: Player = {
    name: 'Jean Brillant',
    score: 0,
    tiles: [
        new Tile({ x: 0, y: 0 }, 'B', 1),
        new Tile({ x: 0, y: 0 }, 'B', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'B', 1),
        new Tile({ x: 0, y: 0 }, 'A', 1),
        new Tile({ x: 0, y: 0 }, 'D', 1),
    ],
    isTurn: false,
    playerId: 'id',
    host: false,
} as Player;
export const MAX_RANDOM_INT_VALUES: number[] = [0, 5, 20, 35, 57, 115, 1059];
export const LETTER_BAG_STUB: LetterBag = new LetterBag();
export const RARE_LETTERS_WEIGHT = 10;
export const EMPTY_LETTER_BAG: LetterBag = new LetterBag();
EMPTY_LETTER_BAG.letters.forEach((letter) => {
    letter.quantity = 0;
});
export const NUMBER_OF_CALLS = 50;
export const TILE_NAME = 'A';
export const TILE_NAME_LOWER = 'a';
export const BLANK_TILE_NAME = '*';
export const NUMBER_OF_PLAYER = 2;
export const LETTERS_NOT_IN_PLAYER = 'wyl';
export const LETTERS_IN_PLAYER = 'adeX';
export const WORD = 'lapin';
export const WORD_WITH_BLANK_TILE = 'ouI';
export const LETTERS_TO_REMOVE = 'aa';
export const LETTERS_TO_REMOVE_2 = 'agp';
export const LETTER_RETURNED = 'a';
export const INVALID_LETTERS_TO_REMOVE = 'exea';
export const MAX_NUMBER_OF_TILES = 7;
export const TILES_OF_PLAYERS: Tile[] = [
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'D', 1),
    new Tile({ x: 0, y: 0 }, 'E', 1),
    new Tile({ x: 0, y: 0 }, 'F', 1),
    new Tile({ x: 0, y: 0 }, '*', 1),
];
export const TWO_TILES: Tile[] = [new Tile({ x: 0, y: 0 }, 'A', 1), new Tile({ x: 0, y: 0 }, '*', 0)];
export const FIVE_TILES: Tile[] = [
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
];
export const FIVE_TILES_V2: Tile[] = [
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
];
export const FIVE_TILES_V3: Tile[] = [
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
];
export const RESULT_TILES_TO_ADD: Tile[] = [
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, '*', 0),
    new Tile({ x: 0, y: 0 }, 'L', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'P', 3),
    new Tile({ x: 0, y: 0 }, 'I', 1),
    new Tile({ x: 0, y: 0 }, 'N', 1),
];
export const RESULT_TILES_TO_ADD_PARTIALLY: Tile[] = [
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'L', 1),
    new Tile({ x: 0, y: 0 }, 'A', 1),
];
export const RESULT_TILES_WITH_BLANK_TILE: Tile[] = [
    new Tile({ x: 0, y: 0 }, 'O', 1),
    new Tile({ x: 0, y: 0 }, 'U', 1),
    new Tile({ x: 0, y: 0 }, '*', 0),
];
export const TILE_NAMES: string[] = [
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
