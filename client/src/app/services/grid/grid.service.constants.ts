/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Vec2 } from '@app/../../../common/model/vec2';

export const GRID_LABEL_OFFSET_FACTOR = 0.05;
export const PREMIUM_NAME_X_DIV_OFFSET = 5.2;
export const PREMIUM_NAME_Y_DIV_OFFSET = 2.1;
export const NON_PREMIUM_NAME_X_DIV_OFFSET = 12;
export const NON_PREMIUM_NAME_Y_DIV_OFFSET = 2.3;
export const PREMIUM_MULTIPLIER_X_DIV_OFFSET = 3.1;
export const PREMIUM_MULTIPLIER_Y_DIV_OFFSET = 1.22;
export const SQUARE_NAME_FONT = '11px sans-serif';
export const HALF_GRID_LABEL_DIV_OFFSET = 2;
export const TENTH_GRID_LABEL_DIV_OFFSET = 10;
export const QUARTER_SQUARE_DIV_OFFSET = 4;
export const OFFSET_STAR = 3;
export const STAR_SRC = 'assets/img/star.png';
export const RIGHT_ARROW_SRC = 'assets/img/right_arrow.png';
export const BOTTOM_ARROW_SRC = 'assets/img/bottom_arrow.png';
export const OFFSET_ARROW = 10;
export const ARROW_SIZE = 20;
export const STAR_SIZE = 42;
export const VISUAL_OFFSET_TILE = 1;
export const FACTOR_TO_FIT_TILE = 2;
export const LAST_GRID_POSITION: Vec2 = { x: 15, y: 15 };
export const MIN_SQUARE_NAME_LENGTH = 2;
export const MAX_SQUARE_NAME_LENGTH = 3;
export const VALID_SQUARE_NAME_REGEX = /[a-o]{1,1}[1-9]{1,1}[0-5]{0,1}/;
