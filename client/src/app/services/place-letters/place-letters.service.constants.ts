import { Vec2 } from '@app/../../../common/model/vec2';

export const BLANK_TILE = '*';
export const REGEX_LETTERS_LOWER_CASE = /[a-zàâäéèêëïîôöùûüÿç]{1}/;
export const REGEX_LETTERS_UPPER_CASE = /[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]{1}/;
// Source for regex to remove accent : https://ricardometring.com/javascript-replace-special-characters
export const REGEX_REMOVE_ACCENT = /[\u0300-\u036f]/g;
export const GRID_FIRST_CLICK_POSITION = 54;
export const COMMAND_CHARACTER = '!';
export const SPACE = ' ';
export const TILE_NOT_FOUND = -1;
export const DEFAULT_POSITION = { x: 0, y: 0 } as Vec2;
export const NORMALIZE_TYPE_NFD = 'NFD';
