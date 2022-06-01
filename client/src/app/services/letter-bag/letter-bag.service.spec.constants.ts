/* eslint-disable @typescript-eslint/no-magic-numbers */ // constants file
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';

export const INVALID_LETTER = '1';
export const DEFAULT_SIZE_OF_LETTER_BAG = 102;
export const NUMBER_OF_TYPES_OF_LETTERS = 27;
export const EMPTY_LETTER_BAG = 0;
export const LETTERS_OF_PLAYER: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'b', 3),
    new Tile({ x: 0, y: 0 } as Vec2, 'o', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'n', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'j', 8),
    new Tile({ x: 0, y: 0 } as Vec2, 'o', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'u', 1),
    new Tile({ x: 0, y: 0 } as Vec2, '*', 1),
];
export const EXPECTED_ARRAY = ['b', 'o', 'n', 'j', 'o', 'u', '*'];
