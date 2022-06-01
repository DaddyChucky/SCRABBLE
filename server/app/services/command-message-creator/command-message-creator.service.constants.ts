import { DirectionType } from '@common/model/direction-type';
import { Vec2 } from '@common/model/vec2';

export const LOBBY_ID = 'lobbyId';
export const EXCHANGE_COMMAND = '!échanger ';
export const PLACE_COMMAND = '!placer ';
export const WORD_LETTERS_PLURAL = ' lettres';
export const WORD_LETTER_SINGULAR = ' lettre';
export const COLON = ' : ';
export const MIN_LETTERS_SIZE = 1;
export const EASEL_MESSAGE_STRUC = ['Les lettres de ', ' sont:'];
export type WordPossibility = { word: string; playerLetters: string; anchor: Vec2; wordDirection: DirectionType };
export const MINIMUM_HINTS = 3;
export const NOT_ENOUGH_HINTS_MSG = 'Il y a moins de 3 possibilités de mots possibles';
export const HINT_MSG = 'INDICES:';
export const NUBMER_LETTER_ON_ONE_LINE = 4;
