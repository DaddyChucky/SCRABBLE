/* eslint-disable dot-notation */
import { TestHelper } from '@app/classes/test-helper';
import { PointCalculatorService } from '@app/services/point-calculator/point-calculator.service';
import { ScrabbleGridService } from '@app/services/scrabble-grid/scrabble-grid.service';
import { WordValidatorService } from '@app/services/word-validator/word-validator.service';
import { DirectionType } from '@common/model/direction-type';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Tile } from '@common/model/tile';
import { Vec2 } from '@common/model/vec2';
import { expect } from 'chai';
import * as serviceConstants from './point-calculator.service.constants';
import * as specConstants from './point-calculator.service.spec.constants';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Sinon = require('sinon');

describe('PointCalculator service', () => {
    let service: PointCalculatorService;
    let wordValidator: WordValidatorService;
    let grid: ScrabbleGrid = { elements: [] } as ScrabbleGrid;
    const testHelper: TestHelper = new TestHelper(grid);
    const invalidVEC: Vec2 = {
        x: 10,
        y: 21,
    } as Vec2;

    beforeEach(() => {
        grid = testHelper.initializeGrid();
        for (const tile of specConstants.TILES) grid.elements[tile.position.x][tile.position.y].tile = tile;
        wordValidator = new WordValidatorService(specConstants.DICT_NAME);
        service = new PointCalculatorService(grid, [new Tile()], wordValidator, new ScrabbleGridService());
    });

    it('getter should return the new points', () => {
        const actualPoints: number = service.newPoints;
        expect(service.newPoints).to.equal(actualPoints);
    });

    it('invalid Vec2 should return undefined from  convertPositionToSquareName', () => {
        expect(testHelper.convertPositionToSquareName(invalidVEC)).to.equal(undefined);
    });

    it('checkBoniPoints should not add 50 points to points if the player does not place 7 letters', () => {
        service.update(grid, specConstants.TILES_VALIDATION, DirectionType.HORIZONTAL);
        const initialPoints: number = service.newPoints;
        service['checkBoniPoints']();
        expect(service.newPoints).to.equal(initialPoints);
    });

    it('checkBoniPoints should add 50 points to player points if he places 7 letters', () => {
        service.update(grid, specConstants.TILES_VALIDATION_SEVEN_TILES, DirectionType.VERTICAL);
        const initialPoints: number = service.newPoints;
        service['checkBoniPoints']();
        expect(service.newPoints).to.equal(initialPoints + serviceConstants.BONI_POINTS);
    });

    it('invalidWordInput should not give any points', () => {
        service.update(grid, specConstants.TILES_VALIDATION_INVALID, DirectionType.HORIZONTAL);
        const expectedPoints = 0;
        service['checkAllWordsFormed']();
        expect(service.newPoints).to.equal(expectedPoints);
    });

    it('input eel should form the words reel and amie', () => {
        service.update(grid, specConstants.TILES_VALIDATION_REEL, DirectionType.VERTICAL);
        const expectedPointsAmie = 6;
        const expectedPointsReel = 5;
        const expectedPoints = expectedPointsAmie + expectedPointsReel;
        const expectedWord = 'reel';
        service['checkAllWordsFormed']();
        expect(service['formedWord']).to.equal(expectedWord);
        expect(service.newPoints).to.equal(expectedPoints);
    });

    it('same test as above should correctly set the direction if no direction is given', () => {
        service.update(grid, specConstants.TILES_VALIDATION_REEL);
        const expectedPointsAmie = 6;
        const expectedPointsReel = 5;
        const expectedPoints = expectedPointsAmie + expectedPointsReel;
        const expectedWord = 'reel';
        service['checkAllWordsFormed']();
        expect(service['formedWord']).to.equal(expectedWord);
        expect(service.newPoints).to.equal(expectedPoints);
    });

    it('input BON should form the words BAIN and give 7 points', () => {
        service.update(grid, specConstants.TILES_VALIDATION_BON, DirectionType.HORIZONTAL);
        const expectedWord = 'bon';
        const expectedPointsBON = 6;
        const expectedPointsBAIN = 6;
        const expectedPoints = expectedPointsBAIN + expectedPointsBON;
        service['checkAllWordsFormed']();
        expect(service['formedWord']).to.equal(expectedWord);
        expect(service.newPoints).to.equal(expectedPoints);
    });

    it('same test as above should correctly set the direction if no direction is given', () => {
        service.update(grid, specConstants.TILES_VALIDATION_BON);
        const expectedWord = 'bon';
        const expectedPointsBON = 6;
        const expectedPointsBAIN = 6;
        const expectedPoints = expectedPointsBAIN + expectedPointsBON;
        service['checkAllWordsFormed']();
        expect(service['formedWord']).to.equal(expectedWord);
        expect(service.newPoints).to.equal(expectedPoints);
    });

    it('put "anane" after "b" should form the word Banane and should give 9 points ', () => {
        service.update(grid, specConstants.TILES_VALIDATION_BANANE, DirectionType.HORIZONTAL);
        const expectedPoints = 9;
        const expectedWord = 'banane';
        service['checkAllWordsFormed']();
        expect(service['formedWord']).to.equal(expectedWord);
        expect(service.newPoints).to.equal(expectedPoints);
    });

    it('input should form the word rala and should give 12 points (wordMultiplier)', () => {
        service.update(grid, specConstants.TILES_VALIDATION_RALA, DirectionType.VERTICAL);
        const expectedPoints = 8;
        const expectedWord = 'rala';
        service['checkAllWordsFormed']();
        expect(service['formedWord']).to.equal(expectedWord);
        expect(service.newPoints).to.equal(expectedPoints);
    });

    it('calculateNewPoints should call resetPoints otherWords[index] is not valid', () => {
        const mock: Sinon.SinonMock = Sinon.mock(service);
        mock.expects('resetPoints').once();
        const invalidOtherWords: string[] = ['kkkl'];
        const otherWordsPoints: number[] = [0];
        service['calculateNewPoints'](invalidOtherWords, otherWordsPoints);
        mock.verify();
    });

    it('checkAllWordsFormed should not change points if direction type is none', () => {
        service['direction'] = DirectionType.NONE;
        const initialPoints: number = service['points'];
        service.checkAllWordsFormed();
        expect(initialPoints).to.be.equal(service['points']);
    });

    it('isVerticalPosition() should return false if position is horizontal', () => {
        service.update(grid, specConstants.TILES_VALIDATION_RALA, DirectionType.VERTICAL);
        expect(service['isVerticalPosition']()).to.be.equal(false);
    });
});
