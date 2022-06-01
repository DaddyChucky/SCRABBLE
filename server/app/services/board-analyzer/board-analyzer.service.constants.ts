/* eslint-disable @typescript-eslint/no-magic-numbers */
import { DirectionType } from '@common/model/direction-type';
import { Vec2 } from '@common/model/vec2';

export const enum PercolationDirection {
    UP,
    DOWN,
}
export type PossibleWordFormingData = {
    possibleWords: Set<string>[];
    index: number;
    from: number;
    ofLetPos: number;
    listOfLetPos: LetPos[][];
    playerLetters: string;
};
export type LetterAdditionInformation = {
    paths: Set<string>;
    percolationDirection: PercolationDirection;
    ofLetPos: LetPos[];
    letters: string;
    reverse: boolean;
};
export type AnchorAndPosition = { anchor: number; position: Vec2 };
export type LetPos = { letter: string | null; pos: Vec2 };
export type WordPossibility = { word: string; playerLetters: string; anchor: Vec2; wordDirection: DirectionType };
export const LETTER_PLACED_INDEX_NOT_FOUND = -1;
export const WILDCARD_CHAR = '*';
export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
export const MIN_COUNT_OF_WILDCARDS = 1;
