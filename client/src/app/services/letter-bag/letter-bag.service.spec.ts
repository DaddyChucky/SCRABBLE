/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { Tile } from '@app/../../../common/model/tile';
import { TILE_NAMES } from '@app/classes/constants';
import { LetterBagService } from './letter-bag.service';
import * as specConstants from './letter-bag.service.spec.constants';
import { INVALID_LETTER } from './letter-bag.service.spec.constants';

describe('LetterBagService', () => {
    let service: LetterBagService;
    const LETTER_NAMES: string[] = TILE_NAMES;

    beforeEach(async () => {
        await TestBed.configureTestingModule({}).compileComponents();
        service = TestBed.inject(LetterBagService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getTile should get correct tile in letterBag', () => {
        for (const letter of LETTER_NAMES) {
            const tile: Tile | undefined = service.getTile(letter);
            expect(tile?.name).toEqual(letter);
        }
    });

    it('getTile should return undefined if letter is not a tile in letterBag', () => {
        const tile: Tile | undefined = service.getTile(INVALID_LETTER);
        expect(tile?.name).toBeUndefined();
    });

    it('getLetterBagSize should return 0 with empty letterBag', () => {
        const sizeBeforeEmptyingBag = service.getLetterBagSize();
        for (let i = 0; i < specConstants.NUMBER_OF_TYPES_OF_LETTERS; ++i) service.letterBag.letters[i].quantity = specConstants.EMPTY_LETTER_BAG;
        expect(sizeBeforeEmptyingBag).toEqual(specConstants.DEFAULT_SIZE_OF_LETTER_BAG);
        expect(service.getLetterBagSize()).toEqual(specConstants.EMPTY_LETTER_BAG);
    });

    it('letterBag should initially contain 102 tiles', () => {
        expect(service.getLetterBagSize()).toEqual(specConstants.DEFAULT_SIZE_OF_LETTER_BAG);
    });

    it('convertTileInWord should return tiles value in string lowerCase only', () => {
        expect(service.convertTileInWord(specConstants.LETTERS_OF_PLAYER)).toEqual(specConstants.EXPECTED_ARRAY);
    });
});
