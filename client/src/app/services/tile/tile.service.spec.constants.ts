import { ColorName } from '@app/../../../common/model/color-name';
import { GRID_DEFAULT_HEIGHT, GRID_DEFAULT_WIDTH, TILE_DEFAULT_HEIGHT } from '@app/../../../common/model/constants';
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';
import { MAX_SIZE_FOR_BIGGER_LETTER, TILE_MAX_WEIGHT, TILE_SIZE_IN_EASEL } from '@app/classes/constants';

export const NEGATIVE_WEIGHT = -1;
export const IMPOSSIBLE_WEIGHT = 11;
export const NEGATIVE_WIDTH = -1;
export const NEGATIVE_HEIGHT = -1;
export const POSSIBLE_WIDTH = 0;
export const POSSIBLE_HEIGHT = 0;
export const DEFAULT_COLOR: ColorName = ColorName.BLACK;
export const DEFAULT_COLOR_HEX = '#000000';
export const IMPOSSIBLE_WIDTH = TILE_SIZE_IN_EASEL + 1;
export const IMPOSSIBLE_HEIGHT = TILE_SIZE_IN_EASEL + 1;
export const VALID_TILES: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'a', 1),
    new Tile({ x: 7, y: 3 } as Vec2, '*', 0),
    new Tile({ x: 14, y: 0 } as Vec2, 'W', TILE_MAX_WEIGHT),
];
export const INVALID_TILES: Tile[] = [
    new Tile({ x: -1, y: -1 } as Vec2, 'a', 0),
    new Tile({ x: -1, y: 0 } as Vec2, 'a', 0),
    new Tile({ x: 0, y: -1 } as Vec2, 'a', 0),
    new Tile({ x: GRID_DEFAULT_WIDTH + 1, y: GRID_DEFAULT_HEIGHT + 1 } as Vec2, 'a', 0),
    new Tile({ x: 0, y: 0 } as Vec2, 'a1', 0),
    new Tile({ x: 0, y: 0 } as Vec2, 'ab', 0),
    new Tile({ x: 0, y: 0 } as Vec2, '_f', 0),
    new Tile({ x: 0, y: 0 } as Vec2, '!41b ,.', 0),
    new Tile({ x: 0, y: 0 } as Vec2, 'a', NEGATIVE_WEIGHT),
    new Tile({ x: 0, y: 0 } as Vec2, 'a', IMPOSSIBLE_WEIGHT),
];
export const FONT_SIZE = 24;
export const FONT_SIZE_BIGGER_THAN_MAX = MAX_SIZE_FOR_BIGGER_LETTER + 3;
export const COLOR_FONT: ColorName = ColorName.BLACK;
export const NOT_BIGGER_LETTERS: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v'];
export const BIGGER_LETTER_TILES: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'w', TILE_MAX_WEIGHT),
    new Tile({ x: 7, y: 3 } as Vec2, 'k', TILE_MAX_WEIGHT),
    new Tile({ x: 14, y: 0 } as Vec2, 'z', TILE_MAX_WEIGHT),
    new Tile({ x: 14, y: 0 } as Vec2, 'x', TILE_MAX_WEIGHT),
    new Tile({ x: 14, y: 0 } as Vec2, 'y', TILE_MAX_WEIGHT),
];
export const HALF_SIZE_TILE: number = TILE_DEFAULT_HEIGHT / 2;
