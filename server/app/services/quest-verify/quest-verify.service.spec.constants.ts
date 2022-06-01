import { DirectionType } from '@common/model/direction-type';
import { ParsedInfo } from '@common/model/parsed-info';
import { Quest } from '@common/model/quest';
import { QuestName } from '@common/model/quest-name';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Tile } from '@common/model/tile';
import { TilesValidation } from '@common/model/tiles-validation';
import { Vec2 } from '@common/model/vec2';
import { WordValidation } from '@common/model/word-validation';

const DEFAULT_LOBBY_ID = 'questTesting';
export const FOUR_SECONDS = 4;
export const SIX_SECONDS = 6;
export const INPUT_BANANE: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'b', 3),
    new Tile({ x: 1, y: 0 } as Vec2, 'a', 3),
    new Tile({ x: 2, y: 0 } as Vec2, 'n', 2),
    new Tile({ x: 3, y: 0 } as Vec2, 'a', 3),
    new Tile({ x: 4, y: 0 } as Vec2, 'n', 2),
    new Tile({ x: 5, y: 0 } as Vec2, 'e', 1),
];
export const LONG_COMPLETE_WORD: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'a', 3),
    new Tile({ x: 1, y: 0 } as Vec2, 'r', 3),
    new Tile({ x: 2, y: 0 } as Vec2, 'a', 2),
    new Tile({ x: 3, y: 0 } as Vec2, 'i', 3),
    new Tile({ x: 4, y: 0 } as Vec2, 'g', 2),
    new Tile({ x: 5, y: 0 } as Vec2, 'n', 1),
    new Tile({ x: 5, y: 0 } as Vec2, 'e', 1),
    new Tile({ x: 5, y: 0 } as Vec2, 'e', 1),
    new Tile({ x: 5, y: 0 } as Vec2, 's', 1),
];
export const WORD_BANANE = 'banane';
export const DICT_NAME = 'francais';
export const PALINDROMES: string[] = ['ere', 'gag', 'tot', 'erre', 'sexes', 'radar', 'ressasser'];
export const INVALID_PALINDROME: string[] = ['aimee', 'loyal', 'mime'];
export const WORDS_WITH_3E: string[] = ['element', 'ereee', 'eleve', 'Telephone', 'epee', 'Agreee', 'electricite'];
export const WORDS_WITH_2E: string[] = ['lepre', 'agree'];
export const GRID_SIZE = 15;
export const Q_PALINDROME = { name: QuestName.PALINDROME, isAccomplished: false, isPrivate: false, points: 15 } as Quest;
export const Q_DIAGONAL = { name: QuestName.DIAGONAL, isAccomplished: false, isPrivate: false, points: 25 } as Quest;
export const Q_SQUARE = { name: QuestName.SQUARE, isAccomplished: false, isPrivate: false, points: 50 } as Quest;
export const Q_WORD_THREE_E = { name: QuestName.WORD_THREE_E, isAccomplished: false, isPrivate: false, points: 35 } as Quest;
export const Q_SAME_WORD_2X = { name: QuestName.SAME_WORD_2X, isAccomplished: false, isPrivate: false, points: 15 } as Quest;
export const Q_LONG_WORD = { name: QuestName.LONG_WORD, isAccomplished: false, isPrivate: false, points: 25 } as Quest;
export const Q_FIVE_SECONDS_MOVE = { name: QuestName.FIVE_SECONDS_MOVE, isAccomplished: false, isPrivate: false, points: 20 } as Quest;
export const Q_CORNERS_2X = { name: QuestName.CORNERS_2X, isAccomplished: false, isPrivate: false, points: 50 } as Quest;
export const EMPY_QUEST = { name: {}, isAccomplished: false, isPrivate: false, points: 100 } as Quest;
export const WORD_VALIDATION: WordValidation = {
    lobbyId: DEFAULT_LOBBY_ID,
    parsedInfo: { lettersCommand: '', position: { x: 0, y: 0 } as Vec2, direction: DirectionType.HORIZONTAL } as ParsedInfo,
    scrabbleGrid: { elements: [] } as ScrabbleGrid,
    tiles: {
        tilesOnGrid: [new Tile({ x: 0, y: 0 } as Vec2, 'b', 3)],
        newTilesToAdd: INPUT_BANANE.slice(1, INPUT_BANANE.length),
        tilesCompleteWord: INPUT_BANANE,
    } as TilesValidation,
} as WordValidation;
export const TIMER_VALUE = 5;
export const TWO_IDENTICAL_WORDS: string[] = ['araignee', 'araignee'];
export const ONE_WORD: string[] = ['araignee'];
