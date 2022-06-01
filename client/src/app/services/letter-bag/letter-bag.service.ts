import { Injectable } from '@angular/core';
import { LetterBag } from '@app/../../../common/model/letter-bag/letter-bag';
import { Tile } from '@app/../../../common/model/tile';

@Injectable({
    providedIn: 'root',
})
export class LetterBagService {
    letterBag: LetterBag;

    constructor() {
        this.letterBag = new LetterBag();
    }

    getLetterBagSize(): number {
        return this.letterBag.letters.map((letter) => letter.quantity).reduce((amountTileInBag, amount) => amountTileInBag + amount, 0);
    }

    getTile(letter: string): Tile | undefined {
        const letterBagFull: LetterBag = new LetterBag();
        const typeOfLetters = letterBagFull.letters;
        const tile: Tile | undefined = typeOfLetters.find((element) => element.tile.name === letter.toUpperCase())?.tile;
        return !tile ? tile : new Tile(tile.position, tile.name, tile.weight);
    }

    convertTileInWord(tiles: Tile[]): string[] {
        const word: string[] = [];
        tiles.forEach((tile: Tile) => {
            word.push(tile.name.toLowerCase());
        });
        return word;
    }
}
