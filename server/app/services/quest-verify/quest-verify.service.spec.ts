/* eslint-disable dot-notation */
import { TestHelper } from '@app/classes/test-helper';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Tile } from '@common/model/tile';
import { Vec2 } from '@common/model/vec2';
import { expect } from 'chai';
import { QuestVerifyService } from './quest-verify.service';
import { GRID_SIZE } from './quest-verify.service.constants';
import * as specConstants from './quest-verify.service.spec.constants';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import sinon = require('sinon');

describe('QuestVerify service', () => {
    let service: QuestVerifyService;
    const testHelper: TestHelper = new TestHelper({ elements: [] } as ScrabbleGrid);
    specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid = testHelper.initializeGrid();

    beforeEach(async () => {
        service = new QuestVerifyService(specConstants.DICT_NAME);
    });

    it('update should set attribute quest to the quest given as parameter', () => {
        service.updateQuest(specConstants.Q_PALINDROME, specConstants.WORD_VALIDATION);
        expect(service['quest']).to.be.equal(specConstants.Q_PALINDROME);
    });

    it('update should set attribute placedTiles to the placedTiles given as parameter', () => {
        service.updateQuest(specConstants.Q_PALINDROME, specConstants.WORD_VALIDATION);
        expect(service['placedTiles']).to.be.equal(specConstants.WORD_VALIDATION);
    });

    it('update should set attribute word to the a concatenation of the placedTiles given as parameter', () => {
        service.updateQuest(specConstants.Q_PALINDROME, specConstants.WORD_VALIDATION);
        expect(service['word']).to.be.equal(specConstants.WORD_BANANE);
    });

    it('update should call convertTilesToWord', () => {
        const convertTilesToWordSpy: sinon.SinonSpy<[], void> = sinon.spy(service['convertTilesToWord']);
        service.updateQuest(specConstants.Q_PALINDROME, specConstants.WORD_VALIDATION);
        expect(convertTilesToWordSpy.called);
    });

    it('update should set attribute grid to placedTiles.scrabbleGrid (parameter)', () => {
        service.updateQuest(specConstants.Q_PALINDROME, specConstants.WORD_VALIDATION);
        expect(service['grid']).to.be.equal(specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid);
    });

    it('setTimer should set attribute timer with timer given as parameter', () => {
        service.setTimer(specConstants.TIMER_VALUE);
        expect(service['timer']).to.equal(specConstants.TIMER_VALUE);
    });

    it('palindrome Quest should call this.isPalindrome and return 15 points for each palindrome', () => {
        const questSpy: sinon.SinonSpy<[], number> = sinon.spy(service['isPalindrome']);
        service.updateQuest(specConstants.Q_PALINDROME, specConstants.WORD_VALIDATION);
        for (const palindrome of specConstants.PALINDROMES) {
            service['word'] = palindrome;
            expect(service.checkQuestsAndReturnPoints()).to.be.equal(specConstants.Q_PALINDROME.points);
            expect(questSpy.called);
        }
    });

    it('palindrome Quest should return 0 points for each invalid palindrome', () => {
        service.updateQuest(specConstants.Q_PALINDROME, specConstants.WORD_VALIDATION);
        for (const palindrome of specConstants.INVALID_PALINDROME) {
            service['word'] = palindrome;
            expect(service.checkQuestsAndReturnPoints()).to.be.equal(0);
        }
    });

    it('diagonal Quest should call this.hasWordOnDiagonal and return 25 points if there is a valid word on the diagonal', () => {
        const questSpy: sinon.SinonSpy<[], number> = sinon.spy(service['hasWordOnDiagonal']);
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid.elements[8][8].tile = new Tile({ x: 8, y: 8 } as Vec2, 'l', 3);
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid.elements[9][9].tile = new Tile({ x: 9, y: 9 } as Vec2, 'a', 3);
        service.updateQuest(specConstants.Q_DIAGONAL, specConstants.WORD_VALIDATION);
        expect(service.checkQuestsAndReturnPoints()).to.be.equal(specConstants.Q_DIAGONAL.points);
        expect(questSpy.called);
    });

    it('diagonal Quest should return 0 points if there is no valid word on the diagonal', () => {
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid.elements[8][8].tile = new Tile({ x: 8, y: 8 } as Vec2, 'l', 3);
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid.elements[9][9].tile = new Tile({ x: 9, y: 9 } as Vec2, 'k', 3);
        service.updateQuest(specConstants.Q_DIAGONAL, specConstants.WORD_VALIDATION);
        expect(service.checkQuestsAndReturnPoints()).to.be.equal(0);
    });

    it('word3E Quest should call this.wordHasThreeE and return 35 points if a word contains 3 e', () => {
        const questSpy: sinon.SinonSpy<[], number> = sinon.spy(service['wordHasThreeE']);
        service.updateQuest(specConstants.Q_WORD_THREE_E, specConstants.WORD_VALIDATION);
        for (const word of specConstants.WORDS_WITH_3E) {
            service['word'] = word;
            expect(service.checkQuestsAndReturnPoints()).to.be.equal(specConstants.Q_WORD_THREE_E.points);
        }
        expect(questSpy.called);
    });

    it('word3E Quest should return 0 points if a word contains less than 3 e', () => {
        service.updateQuest(specConstants.Q_WORD_THREE_E, specConstants.WORD_VALIDATION);
        for (const word of specConstants.WORDS_WITH_2E) {
            service['word'] = word;
            expect(service.checkQuestsAndReturnPoints()).to.be.equal(0);
        }
    });

    it('Corners 2x Quest should call this.gridHasTwoFilledCorners and return 50 points if two corners are filled', () => {
        const questSpy: sinon.SinonSpy<[], number> = sinon.spy(service['gridHasTwoFilledCorners']);
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid.elements[0][0].tile = new Tile({ x: 8, y: 8 } as Vec2, 'l', 3);
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid.elements[GRID_SIZE - 1][0].tile = new Tile({ x: 9, y: 9 } as Vec2, 'k', 3);
        service.updateQuest(specConstants.Q_CORNERS_2X, specConstants.WORD_VALIDATION);
        expect(service.checkQuestsAndReturnPoints()).to.be.equal(specConstants.Q_CORNERS_2X.points);
        expect(questSpy.called);
    });

    it('Corners 2x Quest should return 0 points if only one corner is filled', () => {
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid = testHelper.initializeGrid();
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid.elements[0][0].tile = new Tile({ x: 8, y: 8 } as Vec2, 'l', 3);
        service.updateQuest(specConstants.Q_CORNERS_2X, specConstants.WORD_VALIDATION);
        expect(service.checkQuestsAndReturnPoints()).to.be.equal(0);
    });

    it('square Quest should return 0 points if there is not completed square', () => {
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid = testHelper.initializeGrid();
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid.elements[5][5].tile = new Tile();
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid.elements[5][7].tile = new Tile();
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid.elements[6][5].tile = new Tile();
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid.elements[6][6].tile = new Tile();
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid.elements[6][7].tile = new Tile();
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid.elements[7][5].tile = new Tile();
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid.elements[7][6].tile = new Tile();
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid.elements[7][7].tile = new Tile();
        service.updateQuest(specConstants.Q_SQUARE, specConstants.WORD_VALIDATION);
        expect(service.checkQuestsAndReturnPoints()).to.be.equal(0);
    });

    it('square Quest should call this.gridHasSquare and return the good number of points for this completed quest', () => {
        const questSpy: sinon.SinonSpy<[], number> = sinon.spy(service['gridHasSquare']);
        specConstants.WORD_VALIDATION.parsedInfo.scrabbleGrid.elements[5][6].tile = new Tile();
        service.updateQuest(specConstants.Q_SQUARE, specConstants.WORD_VALIDATION);
        expect(service.checkQuestsAndReturnPoints()).to.be.equal(specConstants.Q_SQUARE.points);
        expect(questSpy.called);
    });

    it(
        'same word 2 x Quest should call this.gridHasThreeIdenticalWords and' +
            'return the good number of points if there are 2 identical words on grid',
        () => {
            const questSpy: sinon.SinonSpy<[], number> = sinon.spy(service['gridHasTwoIdenticalWords']);
            service.updateQuest(specConstants.Q_SAME_WORD_2X, specConstants.WORD_VALIDATION);
            service['wordsOnGrid'] = specConstants.TWO_IDENTICAL_WORDS;
            expect(service.checkQuestsAndReturnPoints()).to.be.equal(specConstants.Q_SAME_WORD_2X.points);
            expect(questSpy.called);
        },
    );

    it('same word 2 x Quest should call return the 0 points if there are 2 identical words on grid', () => {
        service.updateQuest(specConstants.Q_SAME_WORD_2X, specConstants.WORD_VALIDATION);
        service['wordsOnGrid'] = specConstants.ONE_WORD;
        expect(service.checkQuestsAndReturnPoints()).to.be.equal(0);
    });

    it('long word Quest should return 0 points if word is shorter than 8 letters', () => {
        const questSpy: sinon.SinonSpy<[], number> = sinon.spy(service['isLongWord']);
        service.updateQuest(specConstants.Q_LONG_WORD, specConstants.WORD_VALIDATION);
        expect(service.checkQuestsAndReturnPoints()).to.be.equal(0);
        expect(questSpy.called);
    });

    it('long word Quest should call this.isLongWord and return 25 points if word is longer than 8 letters', () => {
        const questSpy: sinon.SinonSpy<[], number> = sinon.spy(service['isLongWord']);
        specConstants.WORD_VALIDATION.tiles.tilesCompleteWord = specConstants.LONG_COMPLETE_WORD;
        service.updateQuest(specConstants.Q_LONG_WORD, specConstants.WORD_VALIDATION);
        expect(service.checkQuestsAndReturnPoints()).to.be.equal(specConstants.Q_LONG_WORD.points);
        expect(questSpy.called);
    });

    it(
        'five seconds Quest should call this.fiveSecondsPlacement and return the good' +
            'number of points if placement is less than 5 seconds and complete word is long enough',
        () => {
            const questSpy: sinon.SinonSpy<[], number> = sinon.spy(service['fiveSecondsPlacement']);
            service.setTimer(specConstants.FOUR_SECONDS);
            service.updateQuest(specConstants.Q_FIVE_SECONDS_MOVE, specConstants.WORD_VALIDATION);
            expect(service.checkQuestsAndReturnPoints()).to.be.equal(specConstants.Q_FIVE_SECONDS_MOVE.points);
            expect(questSpy.called);
        },
    );

    it('five seconds Quest should  return 0 points if placement is more than 5 seconds ', () => {
        service.setTimer(specConstants.SIX_SECONDS);
        service.updateQuest(specConstants.Q_FIVE_SECONDS_MOVE, specConstants.WORD_VALIDATION);
        expect(service.checkQuestsAndReturnPoints()).to.be.equal(0);
    });

    it('five seconds Quest should  return 0 points if placement complete word is shorter than 5 letters', () => {
        specConstants.WORD_VALIDATION.tiles.newTilesToAdd = [
            new Tile({ x: 0, y: 0 } as Vec2, 'a', 3),
            new Tile({ x: 1, y: 0 } as Vec2, 'r', 3),
            new Tile({ x: 2, y: 0 } as Vec2, 'a', 2),
        ];
        service.setTimer(specConstants.FOUR_SECONDS);
        service.updateQuest(specConstants.Q_FIVE_SECONDS_MOVE, specConstants.WORD_VALIDATION);
        expect(service.checkQuestsAndReturnPoints()).to.be.equal(0);
    });

    it('empty quest should return 0 points', () => {
        service.updateQuest(specConstants.EMPY_QUEST, specConstants.WORD_VALIDATION);
        expect(service.checkQuestsAndReturnPoints()).to.be.equal(0);
    });

    it('convertTilesToWord should not change attribute word if there is no placed tiles', () => {
        const initialWord: string = service['word'];
        service['convertTilesToWord']();
        expect(service['word']).to.equal(initialWord);
    });
});
