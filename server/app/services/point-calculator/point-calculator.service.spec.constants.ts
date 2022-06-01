/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Tile } from '@common/model/tile';
import { TilesValidation } from '@common/model/tiles-validation';
import { Vec2 } from '@common/model/vec2';

export const GRID_SIZE = 14;
export const EMPTY_WORD = '';
export const DICT_NAME = 'francais';
export const INPUT_TILES: Tile[] = [
    new Tile({ x: 6, y: 4 } as Vec2, 'm', 2),
    new Tile({ x: 7, y: 4 } as Vec2, 'i', 1),
    new Tile({ x: 8, y: 4 } as Vec2, 'c', 3),
];
export const INPUT_BANANE: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'b', 3),
    new Tile({ x: 1, y: 0 } as Vec2, 'a', 1),
    new Tile({ x: 2, y: 0 } as Vec2, 'n', 1),
    new Tile({ x: 3, y: 0 } as Vec2, 'a', 1),
    new Tile({ x: 4, y: 0 } as Vec2, 'n', 1),
    new Tile({ x: 5, y: 0 } as Vec2, 'e', 1),
];
export const INPUT_LAPIN: Tile[] = [
    new Tile({ x: 11, y: 4 } as Vec2, 'l', 1),
    new Tile({ x: 11, y: 5 } as Vec2, 'a', 1),
    new Tile({ x: 11, y: 6 } as Vec2, 'p', 3),
    new Tile({ x: 11, y: 7 } as Vec2, 'i', 1),
    new Tile({ x: 11, y: 8 } as Vec2, 'n', 1),
];
export const INPUT_RALA: Tile[] = [
    new Tile({ x: 11, y: 2 } as Vec2, 'r', 1),
    new Tile({ x: 11, y: 3 } as Vec2, 'a', 1),
    new Tile({ x: 11, y: 4 } as Vec2, 'l', 1),
    new Tile({ x: 11, y: 5 } as Vec2, 'a', 1),
];
export const INPUT_SEVEN_TILES: Tile[] = [
    new Tile({ x: 6, y: 4 } as Vec2, 'm', 2),
    new Tile({ x: 7, y: 4 } as Vec2, 'i', 1),
    new Tile({ x: 8, y: 4 } as Vec2, 'c', 3),
    new Tile({ x: 6, y: 4 } as Vec2, 'm', 2),
    new Tile({ x: 7, y: 4 } as Vec2, 'i', 1),
    new Tile({ x: 8, y: 4 } as Vec2, 'c', 3),
    new Tile({ x: 8, y: 4 } as Vec2, 'c', 3),
];
export const INVALID_WORD_INPUT: Tile[] = [new Tile({ x: 5, y: 1 } as Vec2, 'x', 2)];
export const INVALID_DISJOINT_INPUT: Tile[] = [new Tile({ x: 5, y: 1 } as Vec2, 'l', 3), new Tile({ x: 2, y: 0 } as Vec2, 'a', 1)];
export const INPUT_REEL_AMIE: Tile[] = [
    new Tile({ x: 0, y: 6 } as Vec2, 'r', 1),
    new Tile({ x: 1, y: 6 } as Vec2, 'e', 1),
    new Tile({ x: 2, y: 6 } as Vec2, 'e', 1),
    new Tile({ x: 3, y: 6 } as Vec2, 'l', 1),
];
export const INPUT_BON: Tile[] = [
    new Tile({ x: 11, y: 6 } as Vec2, 'b', 3),
    new Tile({ x: 11, y: 7 } as Vec2, 'o', 1),
    new Tile({ x: 11, y: 8 } as Vec2, 'n', 1),
];
export const TILES: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'b', 3),
    new Tile({ x: 0, y: 1 } as Vec2, 'o', 1),
    new Tile({ x: 0, y: 2 } as Vec2, 'n', 1),
    new Tile({ x: 0, y: 3 } as Vec2, 'j', 8),
    new Tile({ x: 0, y: 4 } as Vec2, 'o', 1),
    new Tile({ x: 0, y: 5 } as Vec2, 'u', 1),
    new Tile({ x: 0, y: 6 } as Vec2, 'r', 1),
    new Tile({ x: 2, y: 3 } as Vec2, 'a', 1),
    new Tile({ x: 2, y: 4 } as Vec2, 'm', 2),
    new Tile({ x: 2, y: 5 } as Vec2, 'i', 2),
    new Tile({ x: 5, y: 2 } as Vec2, 'b', 3),
    new Tile({ x: 6, y: 2 } as Vec2, 'o', 1),
    new Tile({ x: 7, y: 2 } as Vec2, 'n', 1),
    new Tile({ x: 8, y: 2 } as Vec2, 'j', 8),
    new Tile({ x: 9, y: 2 } as Vec2, 'o', 1),
    new Tile({ x: 10, y: 2 } as Vec2, 'u', 1),
    new Tile({ x: 11, y: 2 } as Vec2, 'r', 1),
    new Tile({ x: 6, y: 4 } as Vec2, 'm', 2),
    new Tile({ x: 7, y: 4 } as Vec2, 'i', 1),
    new Tile({ x: 8, y: 4 } as Vec2, 'c', 3),
    new Tile({ x: 9, y: 4 } as Vec2, 'h', 4),
    new Tile({ x: 10, y: 4 } as Vec2, 'e', 1),
    new Tile({ x: 11, y: 4 } as Vec2, 'l', 1),
    new Tile({ x: 12, y: 6 } as Vec2, 'a', 1),
    new Tile({ x: 13, y: 6 } as Vec2, 'i', 1),
    new Tile({ x: 14, y: 6 } as Vec2, 'n', 1),
];
export const INPUT_TILES_BANANE_VERTICAL: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'b', 3),
    new Tile({ x: 0, y: 1 } as Vec2, 'a', 1),
    new Tile({ x: 0, y: 2 } as Vec2, 'n', 1),
    new Tile({ x: 0, y: 3 } as Vec2, 'a', 1),
    new Tile({ x: 0, y: 4 } as Vec2, 'n', 1),
    new Tile({ x: 0, y: 5 } as Vec2, 'e', 1),
];
export const TILES_VALIDATION: TilesValidation = {
    tilesCompleteWord: TILES,
    tilesOnGrid: [],
    newTilesToAdd: [],
    adjacentWords: [],
    adjacentTiles: [],
} as TilesValidation;
export const TILES_VALIDATION_SEVEN_TILES: TilesValidation = {
    tilesCompleteWord: TILES,
    tilesOnGrid: [],
    newTilesToAdd: INPUT_SEVEN_TILES,
    adjacentWords: [],
    adjacentTiles: [],
} as TilesValidation;
export const TILES_VALIDATION_BANANE: TilesValidation = {
    tilesOnGrid: [TILES[0]],
    newTilesToAdd: INPUT_BANANE.slice(1, INPUT_BANANE.length),
    tilesCompleteWord: INPUT_BANANE,
    adjacentWords: [],
    adjacentTiles: [
        [
            new Tile({ x: 0, y: 0 } as Vec2, 'b', 3),
            new Tile({ x: 0, y: 1 } as Vec2, 'o', 1),
            new Tile({ x: 0, y: 2 } as Vec2, 'n', 1),
            new Tile({ x: 0, y: 3 } as Vec2, 'j', 8),
            new Tile({ x: 0, y: 4 } as Vec2, 'o', 1),
            new Tile({ x: 0, y: 5 } as Vec2, 'u', 1),
            new Tile({ x: 0, y: 6 } as Vec2, 'r', 1),
        ],
    ],
} as TilesValidation;
export const TILES_VALIDATION_LAPIN: TilesValidation = {
    tilesOnGrid: [TILES[22]],
    newTilesToAdd: INPUT_LAPIN.slice(1, INPUT_LAPIN.length),
    tilesCompleteWord: INPUT_LAPIN,
    adjacentWords: ['pain'],
    adjacentTiles: [
        [
            new Tile({ x: 6, y: 4 } as Vec2, 'm', 2),
            new Tile({ x: 7, y: 4 } as Vec2, 'i', 1),
            new Tile({ x: 8, y: 4 } as Vec2, 'c', 1),
            new Tile({ x: 9, y: 4 } as Vec2, 'h', 4),
            new Tile({ x: 10, y: 4 } as Vec2, 'e', 1),
            new Tile({ x: 11, y: 4 } as Vec2, 'l', 1),
        ],
        [new Tile({ x: 12, y: 6 } as Vec2, 'a', 1), new Tile({ x: 13, y: 6 } as Vec2, 'i', 1), new Tile({ x: 14, y: 6 } as Vec2, 'n', 1)],
    ],
} as TilesValidation;
export const TILES_VALIDATION_RALA: TilesValidation = {
    tilesOnGrid: [TILES[16], TILES[22]],
    newTilesToAdd: [INPUT_RALA[1], INPUT_RALA[3]],
    tilesCompleteWord: INPUT_RALA,
    adjacentWords: [],
    adjacentTiles: [
        [
            new Tile({ x: 5, y: 2 } as Vec2, 'b', 3),
            new Tile({ x: 6, y: 2 } as Vec2, 'o', 1),
            new Tile({ x: 7, y: 2 } as Vec2, 'n', 1),
            new Tile({ x: 8, y: 2 } as Vec2, 'j', 8),
            new Tile({ x: 9, y: 2 } as Vec2, 'o', 1),
            new Tile({ x: 10, y: 2 } as Vec2, 'u', 1),
            new Tile({ x: 11, y: 2 } as Vec2, 'r', 1),
        ],
        [
            new Tile({ x: 6, y: 4 } as Vec2, 'm', 2),
            new Tile({ x: 7, y: 4 } as Vec2, 'i', 1),
            new Tile({ x: 8, y: 4 } as Vec2, 'c', 1),
            new Tile({ x: 9, y: 4 } as Vec2, 'h', 4),
            new Tile({ x: 10, y: 4 } as Vec2, 'e', 1),
            new Tile({ x: 11, y: 4 } as Vec2, 'l', 1),
        ],
    ],
} as TilesValidation;
export const TILES_VALIDATION_INVALID: TilesValidation = {
    tilesOnGrid: [TILES[10]],
    newTilesToAdd: INVALID_WORD_INPUT,
    tilesCompleteWord: [INVALID_WORD_INPUT[0], TILES[10]],
} as TilesValidation;
export const TILES_VALIDATION_REEL: TilesValidation = {
    tilesOnGrid: [TILES[6]],
    newTilesToAdd: INPUT_REEL_AMIE.slice(1, INPUT_REEL_AMIE.length),
    tilesCompleteWord: INPUT_REEL_AMIE,
    adjacentWords: ['amie'],
    adjacentTiles: [
        [
            new Tile({ x: 2, y: 3 } as Vec2, 'a', 1),
            new Tile({ x: 2, y: 4 } as Vec2, 'm', 2),
            new Tile({ x: 2, y: 5 } as Vec2, 'i', 1),
            new Tile({ x: 2, y: 6 } as Vec2, 'e', 1),
        ],
    ],
} as TilesValidation;
export const TILES_VALIDATION_BON: TilesValidation = {
    tilesOnGrid: [TILES[23], TILES[24], TILES[25]],
    newTilesToAdd: INPUT_BON,
    tilesCompleteWord: INPUT_BON,
    adjacentWords: ['bain'],
    adjacentTiles: [
        [
            new Tile({ x: 11, y: 6 } as Vec2, 'b', 3),
            new Tile({ x: 12, y: 6 } as Vec2, 'a', 1),
            new Tile({ x: 13, y: 6 } as Vec2, 'i', 1),
            new Tile({ x: 14, y: 6 } as Vec2, 'n', 1),
        ],
    ],
} as TilesValidation;
