import { Letter } from './../letter';
import { Tile } from './../tile';
import { TILES_DEFAULT_QUANTITY, TILES_WEIGHT, TILE_NAMES } from './letter-bag.constants';

export class LetterBag {
    letters: Letter[] = [];

    constructor() {
        this.initialize();
    }

    private initialize(): void {
        const NUMBER_OF_DIFFERENT_TILES = TILES_DEFAULT_QUANTITY.length;
        for (let i = 0; i < NUMBER_OF_DIFFERENT_TILES; ++i) {
            this.letters.push({
                tile: new Tile({ x: 0, y: 0 }, TILE_NAMES[i], TILES_WEIGHT[i]),
                quantity: TILES_DEFAULT_QUANTITY[i],
            });
        }
    }
}
