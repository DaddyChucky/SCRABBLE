/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { MAX_TILES_PER_PLAYER } from '@app/classes/constants';
import { LetterBag } from '@common/model/letter-bag/letter-bag';
import { DEFAULT_SIZE_OF_LETTER_BAG } from '@common/model/letter-bag/letter-bag.constants';
import { Player } from '@common/model/player';
import { Tile } from '@common/model/tile';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { LetterBagService } from './letter-bag.service';
import * as specConstants from './letter-bag.service.spec.constants';

describe('LetterBagService', () => {
    let service: LetterBagService;
    let playerStub: Player;
    let letterBag: LetterBag;
    const LETTER_NAMES: string[] = specConstants.TILE_NAMES;

    beforeEach(async () => {
        service = new LetterBagService();
        specConstants.LETTER_BAG_STUB.letters = [specConstants.LETTER_A_STUB, specConstants.LETTER_B_STUB];
        playerStub = specConstants.DEFAULT_PLAYER_STUB;
        letterBag = specConstants.LETTER_BAG_STUB;
    });

    it('getRandomInt should return a random int between 0 and maxValue parameter', () => {
        for (const randomInt of specConstants.MAX_RANDOM_INT_VALUES) {
            expect(service['getRandomInt'](randomInt)).to.be.greaterThanOrEqual(0);
            expect(service['getRandomInt'](randomInt)).to.be.lessThanOrEqual(randomInt);
        }
    });

    it('letterBagIsEmpty should return false if letterBag is not empty', () => {
        expect(service['letterBagIsEmpty'](letterBag)).to.be.equal(false);
    });

    it('letterBagIsEmpty should return true if letterBag is empty', () => {
        expect(service['letterBagIsEmpty'](specConstants.EMPTY_LETTER_BAG)).to.be.equal(true);
    });

    it('pushEaselTile should push tiles to the player', () => {
        const initialPlayerTilesLength: number = playerStub.tiles.length;
        service['pushEaselTile'](letterBag, playerStub);
        expect(playerStub.tiles.length).to.be.greaterThan(initialPlayerTilesLength);
    });

    it('pushEaselTile should decrement the quantity by 1 of the tile pushed to player in the letterBag', () => {
        sinon.stub(service, 'getValidRandomLetterNumber' as any).returns(0);
        const initialLetterAQuantity: number = letterBag.letters[0].quantity;
        service['pushEaselTile'](letterBag, playerStub);
        expect(letterBag.letters[0].quantity).to.equal(initialLetterAQuantity - 1);
    });

    it('refillLetters should not refill letters if letterBag is empty', () => {
        const playerInitialLettersLength: number = playerStub.tiles.length;
        service.refillLetters(specConstants.EMPTY_LETTER_BAG, playerStub);
        expect(playerStub.tiles.length).to.equal(playerInitialLettersLength);
    });

    it('refillLetters should refill letters if letterBag is not empty', () => {
        playerStub.tiles = [];
        expect(playerStub.tiles.length).not.to.equal(MAX_TILES_PER_PLAYER);
        service.refillLetters(letterBag, playerStub);
        expect(playerStub.tiles.length).to.equal(MAX_TILES_PER_PLAYER);
    });

    it('refillLetters should return true for a valid refill, that is when letterBag still contains letters', () => {
        expect(service.refillLetters(letterBag, playerStub)).to.equal(true);
    });

    it('refillLetters should only refill partially if letterBag is empty when iterating over missing tiles', () => {
        letterBag = specConstants.EMPTY_LETTER_BAG;
        letterBag.letters[specConstants.RANDOM_INDEX].quantity = 1;
        const initialLetterBagLength = 1;
        playerStub.tiles = [];
        const playerInitialLettersLength: number = playerStub.tiles.length;
        expect(service.refillLetters(letterBag, playerStub)).to.equal(false);
        expect(playerStub.tiles.length).to.equal(initialLetterBagLength + playerInitialLettersLength);
    });

    it('getValidRandomLetterNumber should return a number of a letter with quantity > 0', () => {
        letterBag.letters.forEach((letter) => {
            if (letter.tile.weight === specConstants.RARE_LETTERS_WEIGHT) letter.quantity = 0;
        });
        for (let i = 0; i < specConstants.NUMBER_OF_CALLS; ++i) {
            const randomLetterNumber: number = service['getValidRandomLetterNumber'](letterBag);
            expect(letterBag.letters[randomLetterNumber].quantity).to.be.greaterThan(0);
        }
    });

    it('getValidRandomLetterNumber should return same letter if only one letter has quantity > 0', () => {
        letterBag = specConstants.EMPTY_LETTER_BAG;
        letterBag.letters.forEach((letter) => {
            if (letter.tile.name === specConstants.TILE_NAME) letter.quantity = 1;
        });
        for (let i = 0; i < specConstants.NUMBER_OF_CALLS; ++i) {
            const randomLetterNumber: number = service['getValidRandomLetterNumber'](letterBag);
            expect(letterBag.letters[randomLetterNumber].quantity).to.be.greaterThan(0);
            expect(letterBag.letters[randomLetterNumber].tile.name).to.be.equal(specConstants.TILE_NAME);
        }
    });

    it('isBlankTile should return true with uppercase letter', () => {
        expect(service['isBlankTile'](specConstants.TILE_NAME)).to.be.equal(true);
    });

    it('isBlankTile should return false with lowercase letter', () => {
        expect(service['isBlankTile'](specConstants.TILE_NAME_LOWER)).to.be.equal(false);
    });

    it('giveBackLetters should not add tiles if player has already 7 tiles', () => {
        playerStub.tiles = specConstants.TILES_OF_PLAYERS;
        expect(playerStub.tiles.length).to.be.equal(MAX_TILES_PER_PLAYER);
        service.giveBackLetters(playerStub, specConstants.WORD);
        expect(playerStub.tiles.length).to.be.equal(MAX_TILES_PER_PLAYER);
        expect(playerStub.tiles).to.be.equal(specConstants.TILES_OF_PLAYERS);
    });

    it('giveBackLetters should add all tiles if exists and player has less than 7 tiles total', () => {
        playerStub.tiles = specConstants.TWO_TILES;
        expect(playerStub.tiles.length).to.be.equal(specConstants.TWO_TILES.length);
        service.giveBackLetters(playerStub, specConstants.WORD);
        expect(playerStub.tiles.length).to.be.equal(MAX_TILES_PER_PLAYER);
        for (let i = 0; i < specConstants.RESULT_TILES_TO_ADD.length; ++i) {
            expect(playerStub.tiles[i].name).to.be.equal(specConstants.RESULT_TILES_TO_ADD[i].name);
            expect(playerStub.tiles[i].weight).to.be.equal(specConstants.RESULT_TILES_TO_ADD[i].weight);
        }
    });

    it('giveBackLetters should add all tiles and convert upperCase to blank tile', () => {
        playerStub.tiles = [];
        service.giveBackLetters(playerStub, specConstants.WORD_WITH_BLANK_TILE);
        expect(playerStub.tiles.length).to.be.equal(specConstants.RESULT_TILES_WITH_BLANK_TILE.length);
        for (let i = 0; i < specConstants.RESULT_TILES_WITH_BLANK_TILE.length; ++i) {
            expect(playerStub.tiles[i].name).to.be.equal(specConstants.RESULT_TILES_WITH_BLANK_TILE[i].name);
            expect(playerStub.tiles[i].weight).to.be.equal(specConstants.RESULT_TILES_WITH_BLANK_TILE[i].weight);
        }
    });

    it('giveBackLetters should add part of tiles if exists and player has 7 letters before all letters are added', () => {
        playerStub.tiles = specConstants.FIVE_TILES;
        expect(playerStub.tiles.length).to.be.equal(specConstants.FIVE_TILES.length);
        service.giveBackLetters(playerStub, specConstants.WORD);
        expect(playerStub.tiles.length).to.be.equal(MAX_TILES_PER_PLAYER);
        for (let i = 0; i < specConstants.RESULT_TILES_TO_ADD_PARTIALLY.length; ++i) {
            expect(playerStub.tiles[i].name).to.be.equal(specConstants.RESULT_TILES_TO_ADD_PARTIALLY[i].name);
            expect(playerStub.tiles[i].weight).to.be.equal(specConstants.RESULT_TILES_TO_ADD_PARTIALLY[i].weight);
        }
    });

    it('removeLetters should not remove letters if player does not have them', () => {
        playerStub.tiles = specConstants.TILES_OF_PLAYERS;
        service.removeLetters(playerStub, specConstants.LETTERS_NOT_IN_PLAYER);
        expect(playerStub.tiles.length).to.be.equal(specConstants.MAX_NUMBER_OF_TILES);
    });

    it("removeLetters should remove only one 'a' even if player has multiple 'a'", () => {
        service.removeLetters(playerStub, specConstants.TILE_NAME_LOWER);
        expect(playerStub.tiles.length).to.be.equal(specConstants.MAX_NUMBER_OF_TILES - 1);
    });

    it('removeLetters should return a string of the letter removed', () => {
        playerStub.tiles = specConstants.TILES_OF_PLAYERS;
        expect(service.removeLetters(playerStub, specConstants.LETTERS_TO_REMOVE_2)).to.be.equal(specConstants.LETTER_RETURNED);
    });

    it('removeLetters should remove all four letters specified of player', () => {
        playerStub.tiles = specConstants.TILES_OF_PLAYERS;
        const numberOfTileBefore: number = playerStub.tiles.length;
        service.removeLetters(playerStub, specConstants.LETTERS_IN_PLAYER);
        expect(playerStub.tiles.length).to.be.equal(numberOfTileBefore - specConstants.LETTERS_IN_PLAYER.length);
    });

    it('getTile should get correct tile in letterBag', () => {
        for (const letter of LETTER_NAMES) {
            const tile: Tile | undefined = service['getTile'](letter);
            expect(tile?.name).to.be.equal(letter);
        }
    });

    it('getTile should return undefined if letter is not a tile in letterBag', () => {
        const tile: Tile | undefined = service['getTile'](specConstants.INVALID_LETTER);
        expect(tile).to.be.equal(undefined);
    });

    it('refillLetters should add back the tiles to the letter bag if third parameter is given', () => {
        playerStub.tiles = specConstants.FIVE_TILES_V2;
        letterBag = new LetterBag();
        let finalSizeLetterBag = 0;
        service.refillLetters(letterBag, playerStub, specConstants.LETTERS_TO_REMOVE);
        for (const lett of letterBag.letters) finalSizeLetterBag += lett.quantity;
        finalSizeLetterBag += playerStub.tiles.length - specConstants.MAX_NUMBER_OF_TILES;
        expect(finalSizeLetterBag).to.equal(DEFAULT_SIZE_OF_LETTER_BAG);
    });

    it('refillLetters should add back the tiles if third parameter is given, and should not add back letters that are invalid', () => {
        playerStub.tiles = specConstants.FIVE_TILES_V3;
        letterBag = new LetterBag();
        let finalSizeLetterBag = 0;
        service.refillLetters(letterBag, playerStub, specConstants.INVALID_LETTERS_TO_REMOVE);
        for (const lett of letterBag.letters) finalSizeLetterBag += lett.quantity;
        finalSizeLetterBag += playerStub.tiles.length - specConstants.MAX_NUMBER_OF_TILES - specConstants.NUMBER_OF_PLAYER;
        expect(finalSizeLetterBag).to.equal(DEFAULT_SIZE_OF_LETTER_BAG);
    });

    it('giveLetterIndex return 0 if there is no letter in letterbag', () => {
        letterBag = new LetterBag();
        letterBag.letters = [];
        expect(service['giveLetterIndex'](letterBag, 0)).to.be.equal(0);
    });
});
