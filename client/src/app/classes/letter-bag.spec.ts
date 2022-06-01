import * as specConstants from '@app/../../../common/model/letter-bag//letter-bag.constants';
import { LetterBag } from '@app/../../../common/model/letter-bag/letter-bag';
import { TILES_DEFAULT_QUANTITY, TILES_WEIGHT, TILE_NAMES } from '@app/classes/constants';

describe('LetterBag', () => {
    let letterBag: LetterBag;

    beforeEach(() => {
        letterBag = new LetterBag();
    });

    it('should be created', () => {
        expect(letterBag).toBeTruthy();
    });

    it('letterBag should initially contain 27 different types of tiles', () => {
        expect(letterBag.letters.length).toEqual(specConstants.NUMBER_OF_TYPES_OF_LETTERS);
    });

    it('letterBag should contain all tiles of Scrabble game (name, weight, quantity)', () => {
        for (const [index, letter] of letterBag.letters.entries()) {
            if (TILE_NAMES[index] === letter.tile.name) {
                expect(letter.tile.name).toEqual(TILE_NAMES[index]);
                expect(letter.quantity).toEqual(TILES_DEFAULT_QUANTITY[index]);
                expect(letter.tile.weight).toEqual(TILES_WEIGHT[index]);
            }
        }
    });
});
