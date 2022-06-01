import { MAX_TILES_PER_PLAYER } from '@common/model/constants';
import { Letter } from '@common/model/letter';
import { LetterBag } from '@common/model/letter-bag/letter-bag';
import { Player } from '@common/model/player';
import { Tile } from '@common/model/tile';
import { Service } from 'typedi';
import * as serviceConstants from './letter-bag.service.constants';

@Service()
export class LetterBagService {
    refillLetters(letterBag: LetterBag, player: Player, lettersBack?: string): boolean {
        if (this.letterBagIsEmpty(letterBag)) return false;
        const lettersToRefill: number = MAX_TILES_PER_PLAYER - player.tiles.length;
        for (let i = 0; i < lettersToRefill; ++i) {
            if (this.letterBagIsEmpty(letterBag)) return false;
            this.pushEaselTile(letterBag, player);
        }
        if (lettersBack)
            // @ts-ignore: Object is possibly 'null'. -- Condition verified above, cannot be null
            for (const letter of lettersBack) letterBag.letters.find((lett) => lett.tile.name === letter.toUpperCase())?.quantity += 1;
        return true;
    }

    removeLetters(player: Player, word: string): string {
        let removedLetter = '';
        let tileIndex: number;
        for (const letter of word) {
            if (this.isBlankTile(letter)) tileIndex = player.tiles.findIndex((tile) => tile.name === serviceConstants.BLANK_TILE_NAME);
            else tileIndex = player.tiles.findIndex((tile) => tile.name === letter.toUpperCase());
            if (tileIndex === serviceConstants.TILE_NOT_FOUND) continue;

            const tiles: Tile[] = player.tiles.splice(tileIndex, serviceConstants.NUMBER_OF_TILE_TO_REMOVE);
            tiles.forEach((tile: Tile) => {
                removedLetter += tile.name;
            });
        }
        return removedLetter.toLowerCase();
    }

    giveBackLetters(player: Player, word: string): void {
        for (let letter of word) {
            if (letter === letter.toUpperCase()) letter = serviceConstants.BLANK_TILE_NAME;
            const tileToAdd: Tile | undefined = this.getTile(letter);
            if (tileToAdd && player.tiles.length < MAX_TILES_PER_PLAYER) player.tiles.push(tileToAdd);
        }
    }

    letterBagIsEmpty(letterBag: LetterBag): boolean {
        return !letterBag.letters.some((letter) => letter.quantity !== 0);
    }
    getTile(letter: string): Tile | undefined {
        const letterBagFull: LetterBag = new LetterBag();
        const typeOfLetters: Letter[] = letterBagFull.letters;
        const tile: Tile | undefined = typeOfLetters.find((element) => element.tile.name === letter.toUpperCase())?.tile;
        if (!tile) return tile;
        return new Tile(tile.position, tile.name, tile.weight);
    }

    private getValidRandomLetterNumber(letterBag: LetterBag): number {
        let numberOfLetters = 0;
        letterBag.letters.forEach((letter: Letter) => {
            numberOfLetters += letter.quantity;
        });
        return this.giveLetterIndex(letterBag, this.getRandomInt(numberOfLetters));
    }

    private giveLetterIndex(letterBag: LetterBag, numberOfLetterToPass: number): number {
        for (let index = 0; index < letterBag.letters.length; index++) {
            if (letterBag.letters[index].quantity > 0) {
                numberOfLetterToPass -= letterBag.letters[index].quantity;
                if (numberOfLetterToPass <= 0) {
                    return index;
                }
            }
        }
        return 0;
    }

    private isBlankTile(letter: string): boolean {
        return letter === letter.toUpperCase();
    }

    private pushEaselTile(letterBag: LetterBag, player: Player): void {
        const randomLetterNumber: number = this.getValidRandomLetterNumber(letterBag);
        player.tiles.push(letterBag.letters[randomLetterNumber].tile);
        letterBag.letters[randomLetterNumber].quantity -= 1;
    }

    private getRandomInt(maxNumber: number): number {
        return Math.floor(maxNumber * Math.random());
    }
}
