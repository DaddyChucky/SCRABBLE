import { ColorName } from '@common/model/color-name';
import {
    ASCII_LETTER_START_MAJ,
    GRID_LETTERX2_MULTIPLIER,
    GRID_LETTERX3_MULTIPLIER,
    GRID_SQUARES_PER_LINE,
    GRID_WORDX2_MULTIPLIER,
    GRID_WORDX3_MULTIPLIER,
    LETTERX2_POSITIONS,
    LETTERX3_POSITIONS,
    WORDX3_POSITIONS,
} from '@common/model/constants';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Square } from '@common/model/square';
import { Vec2 } from '@common/model/vec2';
import { SQUARE_WITHOUT_MULTIPLIER } from './constants';

export class TestHelper {
    grid: ScrabbleGrid;

    constructor(grid: ScrabbleGrid) {
        this.grid = grid;
    }
    convertPositionToSquareName(pos: Vec2): string | undefined {
        const inputIsValid: boolean = pos && pos.x >= 0 && pos.x < GRID_SQUARES_PER_LINE && pos.y >= 0 && pos.y < GRID_SQUARES_PER_LINE;
        return inputIsValid ? String.fromCharCode(ASCII_LETTER_START_MAJ + pos.y) + (pos.x + 1).toString() : undefined;
    }

    convertBaseSquareToPremium(pos: Vec2): void {
        const NOT_FOUND = -1;
        const square: Square = this.grid.elements[pos.y][pos.x];
        const squareName: string = square.name;
        if (WORDX3_POSITIONS.indexOf(squareName) !== NOT_FOUND) {
            square.wordMultiplier = GRID_WORDX3_MULTIPLIER;
        } else if (LETTERX3_POSITIONS.indexOf(squareName) !== NOT_FOUND) {
            square.letterMultiplier = GRID_LETTERX3_MULTIPLIER;
        } else if (LETTERX2_POSITIONS.indexOf(squareName) !== NOT_FOUND) {
            square.letterMultiplier = GRID_LETTERX2_MULTIPLIER;
        } else if (pos.x === pos.y || pos.x + pos.y + 1 === GRID_SQUARES_PER_LINE) {
            square.wordMultiplier = GRID_WORDX2_MULTIPLIER;
        }
    }

    initializeGrid(): ScrabbleGrid {
        for (let y = 0; y < GRID_SQUARES_PER_LINE; ++y) {
            this.grid.elements[y] = [];
            for (let x = 0; x < GRID_SQUARES_PER_LINE; ++x) {
                const POS: Vec2 = {
                    x,
                    y,
                } as Vec2;
                this.grid.elements[y][x] = {
                    position: POS,
                    color: ColorName.BEIGE,
                    wordMultiplier: SQUARE_WITHOUT_MULTIPLIER,
                    letterMultiplier: SQUARE_WITHOUT_MULTIPLIER,
                    name: this.convertPositionToSquareName(POS),
                    tile: null,
                } as Square;
                this.convertBaseSquareToPremium(POS);
            }
        }
        return this.grid;
    }
}
