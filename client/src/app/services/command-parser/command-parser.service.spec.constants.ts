/* eslint-disable @typescript-eslint/no-magic-numbers */ // constants file
import { Player } from '@app/../../../common/model/player';
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';

export const VALID_HORIZONTAL_PLACER_COMMANDS: string[] = ['!placer a1h bonjour', '!placer o15h bonjour', '!placer d5h *'];
export const VALID_VERTICAL_PLACER_COMMANDS: string[] = ['!placer a1v bonjour', '!placer d14v bonjour', '!placer o5v *'];
export const VALID_POSITION: Vec2 = { x: 0, y: 0 } as Vec2;
export const PLACER_COMMAND_REGEX = /!placer [a-o]{1,1}[1-9]{1,1}[0-5]{0,1}[hv]{0,1} [a-zA-Z]{1,7}/;
export const DIRECTION_OFFSET = 1;
export const ENOUGH_PLAYER_LETTERS = 'bonjo**';
export const ENOUGH_LETTERS_TO_PLACE = 'bonjoUR';
export const BONJOUR_WORD = 'bonjour';
export const INVALID_SQUARE_NAME = 'invalidSquareName';
export const VALID_PLACER_COMMANDS: string[] = [
    '!placer a1v bonjour',
    '!placer a1v y',
    '!placer o15h bonjour',
    '!placer d10h v',
    '!placer d10h Y',
    '!placer d9 X',
    '!placer m1 g',
    '!placer c7v jOur',
    '!placer c7v jOuR',
    '!placer e11 Z',
    '!placer f13 y',
];
export const VALID_PLACER_COMMANDS_STARTING_POSITIONS: string[] = [
    '!placer b8v bonjour',
    '!placer c8v bonjour',
    '!placer d8v bonjour',
    '!placer e8v bonjour',
    '!placer f8v bonjour',
    '!placer g8v bonjour',
    '!placer h8v bonjour',
];
export const INVALID_PLACER_COMMANDS_STARTING_POSITIONS: string[] = [
    '!placer a8v bonjour',
    '!placer h1v bonjour',
    '!placer h7v bonjour',
    '!placer h2v bonjour',
    '!placer h3v bonjour',
    '!placer h4v bonjour',
    '!placer h5v bonjour',
    '!placer h6v bonjour',
];
export const INVALID_PLACER_COMMANDS: string[] = [
    '!placer a15 bonjour',
    '!placer a15v BONjour',
    '!placer a15v aVEC',
    '!placer a1 honjour',
    '!placer b2 vonjour',
];
export const INVALID_PLACER_COMMANDS_NOT_REGEX_DEFINED: string[] = [
    '!placer A1v bonjour',
    '!placer p1v bonjour',
    '!placer a0v bonjour',
    '!placer a16v bonjour',
    '!placer a15H bonjour',
    '!placer a15V bonjour',
    '!placer a15h',
    '!placer',
    '!placer ',
    '!placer !échanger',
    '!placer a15v quelque chose',
    '!placer a15v quelques',
    '.placer a15v bonjour',
    '/placer a15v bonjour',
    '!!placer a15v bonjour',
    '!p a15v bonjour',
];
export const INVALID_PLACER_COMMANDS_NOT_MAX_WHITE_LETTERS_VALID: string[] = [
    '!placer a15 BON',
    '!placer a15v JOUR',
    '!placer a15v aVEC',
    '!placer a15v AlLO',
    '!placer b2h ViVrE',
    '!placer o4v laiSSER',
];
export const INVALID_PLACER_COMMANDS_NOT_LONE_LETTERS_PLACING_VALID: string[] = [
    '!placer a1 honjour',
    '!placer b2 vonjour',
    '!placer a15 bon',
    '!placer c10 sans',
    '!placer d9 retour',
];
export const INVALID_STARTING_COMMANDS: string[] = [
    '.placer a15v bonjour',
    '/placer a15v bonjour',
    '~placer a15v bonjour',
    'placer a15v bonjour',
    '-placer a15v bonjour',
    '@placer a15v bonjour',
    '^placer a15v bonjour',
    '.échanger a15v bonjour',
    '/échanger a15v bonjour',
    '~échanger a15v bonjour',
    'échanger a15v bonjour',
    '-échanger a15v bonjour',
    '@échanger a15v bonjour',
    '^échanger a15v bonjour',
];
export const VALID_EXCHANGE_COMMANDS: string[] = [
    '!échanger a',
    '!échanger bbbbb',
    '!échanger ccccccc',
    '!échanger *',
    '!échanger abc*efg',
    '!échanger abcdefg',
];
export const INVALID_EXCHANGE_COMMANDS: string[] = [
    '!échanger A',
    '!échanger abcdefgh',
    '!échanger abcdefG',
    '!échanger ABCDE',
    '!échanger 1',
    '!échanger ABCDE1*',
    '!échanger aBcDe*',
    '!échanger ',
    '!échanger',
    '!!échanger a15v bonjour',
    '!echanger a15v bonjour',
    '!exchange a15v bonjour',
    '!e a15v bonjour',
];
export const INVALID_COMMAND_WITH_NO_SPACES = '!placer';
export const MATCH_ARRAY_WITH_CONTENT_STUB: RegExpMatchArray = ['', ''];
export const MATCH_ARRAY_WITHOUT_CONTENT_STUB: RegExpMatchArray = [];
export const MATCH_ARRAY_WITH_SUPERIOR_CONTENT_LENGTH_STUB: RegExpMatchArray = ['o15vh'];
export const VALID_MATCH_ARRAYS: RegExpMatchArray[] = [['o15v'], ['d5h']];
export const LETTERS_OF_PLAYER: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'b', 3),
    new Tile({ x: 0, y: 0 } as Vec2, 'o', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'n', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'j', 8),
    new Tile({ x: 0, y: 0 } as Vec2, 'o', 1),
    new Tile({ x: 0, y: 0 } as Vec2, '*', 1),
    new Tile({ x: 0, y: 0 } as Vec2, '*', 1),
];
export const LETTERS_OF_PLAYER_ARRAY = ['b', 'o', 'n', 'j', 'o', '*', '*'];
export const PLAYER_STUB_TILES: Tile[] = [new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile(), new Tile()];
export const PLAYER_STUB_LETTERS = 'abcdefg';
export const PLAYER_STUB: Player = { tiles: PLAYER_STUB_TILES } as Player;
export const INVALID_RESERVE_COMMAND = '!réser';
export const INVALID_SKIP_COMMANDS: string[] = ['passer', '!passer ', ' !passer', '!passerr', '!passer1', '!passer roger', 'skip !passer'];
export const NUMBER_OF_SPLIT_MESSAGE_CALLS = 3;
