/* eslint-disable max-lines */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestHelper } from '@app/classes/test-helper';
import { DirectionType } from '@common/model/direction-type';
import { ParsedInfo } from '@common/model/parsed-info';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Tile } from '@common/model/tile';
import { TilesValidation } from '@common/model/tiles-validation';
import { Vec2 } from '@common/model/vec2';
import { expect } from 'chai';
import { ScrabbleGridService } from './scrabble-grid.service';
import * as specConstants from './scrabble-grid.service.spec.constants';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Sinon = require('sinon');

describe('ScrabbleGridService', () => {
    let service: ScrabbleGridService;
    let grid: ScrabbleGrid = { elements: [] } as ScrabbleGrid;
    const testHelper: TestHelper = new TestHelper(grid);

    beforeEach(() => {
        grid = testHelper.initializeGrid();
        service = new ScrabbleGridService();
        service.scrabbleGrid = grid;
    });

    it('createWordValidation should call addCompleteWord and convertTilesAndFindPosition', () => {
        const addCompleteWordSpy: Sinon.SinonSpy<any[], any> | Sinon.SinonSpy<unknown[], unknown> = Sinon.spy(service, 'addCompleteWord' as any);
        const convertTilesAndFindPositionSpy: Sinon.SinonSpy<any[], any> | Sinon.SinonSpy<unknown[], unknown> = Sinon.spy(
            service,
            'convertTilesAndFindPosition' as any,
        );
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO_CREATE;
        parsedInfo.scrabbleGrid = grid;
        service.createWordValidation(parsedInfo);
        expect(addCompleteWordSpy.called);
        expect(convertTilesAndFindPositionSpy.called);
    });

    it('checkSideAfterPosition should return all letters in grid after the position with horizontal direction', () => {
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        expect(
            service['checkSideAfterPosition'](
                specConstants.MIDDLE_SQUARE_POSITION,
                DirectionType.HORIZONTAL,
                specConstants.PARSED_INFO.lettersCommand,
            ),
        ).to.equal(specConstants.PARSED_INFO.lettersCommand + specConstants.HORIZONTAL_AFTER_WORD);
    });

    it('checkHalfSideToAddLetter should return all letters in grid after the position with vertical direction', () => {
        service.scrabbleGrid = grid;
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const wordTiles: string = service['checkSideAfterPosition'](
            specConstants.MIDDLE_SQUARE_POSITION,
            DirectionType.VERTICAL,
            specConstants.PARSED_INFO.lettersCommand,
        );
        expect(wordTiles).to.equal(specConstants.PARSED_INFO.lettersCommand + specConstants.VERTICAL_AFTER_WORD);
    });

    it('checkSideBeforePosition should return all letters in grid before the position with vertical direction', () => {
        service.scrabbleGrid = grid;
        const reverseOrderSpy: Sinon.SinonStub<any[], any> = Sinon.stub(service, 'reverseOrderOfLetters' as any).callThrough();
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const lettersBefore: string = service['checkSideBeforePosition'](specConstants.MIDDLE_SQUARE_POSITION, DirectionType.VERTICAL);
        expect(reverseOrderSpy.called);
        expect(lettersBefore).to.equal(specConstants.VERTICAL_BEFORE_WORD);
    });

    it('checkSideBeforePosition should return all letters in grid before the position with horizontal direction', () => {
        service.scrabbleGrid = grid;
        const reverseOrderSpy: Sinon.SinonStub<any[], any> = Sinon.stub(service, 'reverseOrderOfLetters' as any).callThrough();
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const lettersBefore: string = service['checkSideBeforePosition'](specConstants.MIDDLE_SQUARE_POSITION, DirectionType.HORIZONTAL);
        expect(reverseOrderSpy.called);
        expect(lettersBefore).to.equal(specConstants.HORIZONTAL_BEFORE_WORD);
    });

    it('addCompleteWord should add letters before and after the word with direction horizontal', () => {
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.HORIZONTAL;
        parsedInfo.position = specConstants.MIDDLE_SQUARE_POSITION;
        service.scrabbleGrid = grid;
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        service['addCompleteWord'](parsedInfo);
        expect(parsedInfo.completeWord).to.equal(
            specConstants.HORIZONTAL_BEFORE_WORD + parsedInfo.lettersCommand + specConstants.HORIZONTAL_AFTER_WORD,
        );
    });

    it('addCompleteWord should add letters before and after the word with direction vertical', () => {
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.VERTICAL;
        parsedInfo.position = specConstants.MIDDLE_SQUARE_POSITION;
        service.scrabbleGrid = grid;
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        service['addCompleteWord'](parsedInfo);
        expect(parsedInfo.completeWord).to.equal(specConstants.VERTICAL_BEFORE_WORD + parsedInfo.lettersCommand + specConstants.VERTICAL_AFTER_WORD);
    });

    it('addCompleteWord should add letters before and after the word with no direction (horizontal case)', () => {
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.NONE;
        parsedInfo.position = specConstants.POSITION_NO_DIRECTION_HORIZONTAL;
        service.scrabbleGrid = grid;
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        service['addCompleteWord'](parsedInfo);
        expect(parsedInfo.completeWord).to.equal(specConstants.WORD_NO_DIRECTION_HORIZONTAL);
    });

    it('addCompleteWord should add letters before and after the word with no direction (vertical case)', () => {
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.NONE;
        parsedInfo.position = specConstants.POSITION_NO_DIRECTION_VERTICAL;
        service.scrabbleGrid = grid;
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        service['addCompleteWord'](parsedInfo);
        expect(parsedInfo.completeWord).to.equal(specConstants.WORD_NO_DIRECTION_VERTICAL);
    });

    it('addCompleteWord should call checkBothSideNoDirection if hasNoDirection is true', () => {
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.NONE;
        service.scrabbleGrid = grid;
        const checkBothSideNoDirectionSpy: Sinon.SinonStub<any[], any> = Sinon.stub(service, 'checkBothSideNoDirection' as any).callThrough();
        service['addCompleteWord'](parsedInfo);
        expect(checkBothSideNoDirectionSpy.calledWith(parsedInfo));
    });

    it('addCompleteWord should call checkSideBeforePosition and checkSideAfterPosition if hasNoDirection is false', () => {
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.VERTICAL;
        service.scrabbleGrid = grid;
        const checkSideBeforePositionSpy: Sinon.SinonStub<any[], any> = Sinon.stub(service, 'checkSideBeforePosition' as any).callThrough();
        const checkSideAfterPositionSpy: Sinon.SinonStub<any[], any> = Sinon.stub(service, 'checkSideAfterPosition' as any).callThrough();
        service['addCompleteWord'](parsedInfo);
        expect(checkSideBeforePositionSpy.calledWith(parsedInfo.position, parsedInfo.direction));
        expect(checkSideAfterPositionSpy.calledWith(parsedInfo.position, parsedInfo.direction, parsedInfo.lettersCommand));
    });

    it('addCompleteWord should add correct complete world with separate letterCommands', () => {
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO_MULTIPLE_LETTERS;
        parsedInfo.direction = DirectionType.HORIZONTAL;
        parsedInfo.position = { x: 2, y: 7 } as Vec2;
        parsedInfo.lettersCommand = specConstants.LETTER_A + specConstants.LETTER_A;
        service.scrabbleGrid = grid;
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        service['addCompleteWord'](parsedInfo);
        expect(parsedInfo.completeWord).to.equal(
            specConstants.LETTER_A + specConstants.LETTER_L + specConstants.LETTER_A + specConstants.HORIZONTAL_BEFORE_WORD,
        );
    });

    it('addCompleteWord should add correct complete world with separate letterCommands multiple times (horizontal)', () => {
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO_MULTIPLE_LETTERS;
        parsedInfo.direction = DirectionType.HORIZONTAL;
        parsedInfo.position = { x: 1, y: 7 } as Vec2;
        parsedInfo.lettersCommand = specConstants.LETTER_A + specConstants.LETTER_A + specConstants.LETTER_A + specConstants.LETTER_A;
        service.scrabbleGrid = grid;
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        service['addCompleteWord'](parsedInfo);
        expect(parsedInfo.completeWord).to.equal(
            specConstants.LETTER_C +
                specConstants.LETTER_A +
                specConstants.LETTER_A +
                specConstants.LETTER_L +
                specConstants.LETTER_A +
                specConstants.HORIZONTAL_BEFORE_WORD +
                specConstants.LETTER_A +
                specConstants.HORIZONTAL_AFTER_WORD,
        );
    });

    it('addCompleteWord should add correct complete world with separate letterCommands multiple times (vertical)', () => {
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO_MULTIPLE_LETTERS;
        parsedInfo.direction = DirectionType.VERTICAL;
        parsedInfo.position = { x: 7, y: 0 } as Vec2;
        parsedInfo.lettersCommand =
            specConstants.LETTER_A + specConstants.LETTER_A + specConstants.LETTER_A + specConstants.LETTER_A + specConstants.LETTER_A;
        service.scrabbleGrid = grid;
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        service['addCompleteWord'](parsedInfo);
        expect(parsedInfo.completeWord).to.equal(
            specConstants.LETTER_A +
                specConstants.LETTER_L +
                specConstants.LETTER_A +
                specConstants.LETTER_A +
                specConstants.VERTICAL_BEFORE_WORD +
                specConstants.LETTER_A +
                specConstants.VERTICAL_AFTER_WORD +
                specConstants.LETTER_A,
        );
    });

    it('reverseOrderOfLetters should reverse string', () => {
        for (let i = 0; i < specConstants.WORDS_TO_REVERSE.length; ++i) {
            expect(service['reverseOrderOfLetters'](specConstants.WORDS_TO_REVERSE[i])).to.equal(specConstants.WORDS_REVERSED[i]);
        }
    });

    it('hasNoDirection should return true with NONE direction type', () => {
        expect(service['hasNoDirection'](DirectionType.NONE)).to.equal(true);
    });

    it('hasNoDirection should return false with VERTICAL direction type', () => {
        expect(service['hasNoDirection'](DirectionType.VERTICAL)).to.equal(false);
    });

    it('hasNoDirection should return false with HORIZONTAL direction type', () => {
        expect(service['hasNoDirection'](DirectionType.HORIZONTAL)).to.equal(false);
    });

    it('findWordBeforeNoDirection should call checkSideBeforePosition twice and return empty string if grid is empty', () => {
        const numberOfCallsOfSpy = 2;
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.NONE;
        const checkSideBeforePositionSpy: Sinon.SinonStub<any[], any> = Sinon.stub(service, 'checkSideBeforePosition' as any).callThrough();
        const wordBefore: string = service['findWordBeforeNoDirection'](parsedInfo);
        expect(checkSideBeforePositionSpy.callCount).to.equal(numberOfCallsOfSpy);
        expect(wordBefore).to.equal('');
    });

    it('findWordBeforeNoDirection should return letters before position on grid of vertical direction if word is longer', () => {
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.NONE;
        parsedInfo.position = specConstants.MIDDLE_SQUARE_POSITION;
        const wordBefore: string = service['findWordBeforeNoDirection'](parsedInfo);
        expect(wordBefore).to.equal(specConstants.VERTICAL_BEFORE_WORD);
        expect(parsedInfo.direction).to.equal(DirectionType.VERTICAL);
    });

    it('findWordBeforeNoDirection should return letters before position on grid of horizontal direction if word is longer', () => {
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.NONE;
        parsedInfo.position = specConstants.POSITION_FIND_BEFORE_NO_DIR;
        const wordBefore: string = service['findWordBeforeNoDirection'](parsedInfo);
        expect(wordBefore).to.equal(specConstants.WORD_HELLO);
        expect(parsedInfo.direction).to.equal(DirectionType.HORIZONTAL);
    });

    it('findWordBeforeNoDirection should return letters before position on grid of vertical direction if words have equal length', () => {
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.NONE;
        parsedInfo.position = specConstants.POSITION_END_OF_GRID;
        const wordBefore: string = service['findWordBeforeNoDirection'](parsedInfo);
        expect(wordBefore).to.equal(specConstants.WORD_N);
        expect(parsedInfo.direction).to.equal(DirectionType.VERTICAL);
    });

    it('findTilePositionBeforeWord should return empty Tile[] if no tiles are on grid before position', () => {
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        const tilesBefore: Tile[] = service['findTilePositionBeforeWord'](parsedInfo);
        expect(tilesBefore).to.eql([]);
    });

    it('findTilePositionBeforeWord should return tiles on grid before position (horizontal direction)', () => {
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.HORIZONTAL;
        parsedInfo.position = specConstants.POSITION_FIND_BEFORE_NO_DIR;
        const tilesBefore: Tile[] = service['findTilePositionBeforeWord'](parsedInfo);
        expect(tilesBefore.length).to.eql(specConstants.TILES_HELLO.length);
        for (let i = 0; i < specConstants.TILES_HELLO.length; ++i) {
            expect(tilesBefore[i]).to.eql(specConstants.TILES_HELLO[i]);
        }
    });

    it('findTilePositionBeforeWord should return tiles on grid before position (no direction, horizontal word longer)', () => {
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.NONE;
        parsedInfo.position = specConstants.POSITION_FIND_BEFORE_NO_DIR;
        const tilesBefore: Tile[] = service['findTilePositionBeforeWord'](parsedInfo);
        expect(tilesBefore.length).to.eql(specConstants.TILES_HELLO.length);
        for (let i = 0; i < specConstants.TILES_HELLO.length; ++i) {
            expect(tilesBefore[i]).to.eql(specConstants.TILES_HELLO[i]);
        }
    });

    it('findTilePositionBeforeWord should return tiles on grid before position (vertical direction)', () => {
        service.scrabbleGrid = grid;
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.VERTICAL;
        parsedInfo.position = specConstants.MIDDLE_SQUARE_POSITION;
        const tilesBefore: Tile[] = service['findTilePositionBeforeWord'](parsedInfo);
        expect(tilesBefore.length).to.eql(specConstants.TILES_LES.length);
        for (let i = 0; i < specConstants.TILES_LES.length; ++i) {
            expect(tilesBefore[i]).to.eql(specConstants.TILES_LES[i]);
        }
    });

    it('findTilePositionBeforeWord should return tiles on grid before position (no direction, vertical word longer)', () => {
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.NONE;
        parsedInfo.position = specConstants.MIDDLE_SQUARE_POSITION;
        const tilesBefore: Tile[] = service['findTilePositionBeforeWord'](parsedInfo);
        expect(tilesBefore.length).to.eql(specConstants.TILES_LES.length);
        for (let i = 0; i < specConstants.TILES_LES.length; ++i) {
            expect(tilesBefore[i]).to.eql(specConstants.TILES_LES[i]);
        }
    });

    it('checkBothSideNoDirection should return complete word with horizontal direction if word is longer than vertical', () => {
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.NONE;
        parsedInfo.position = specConstants.POSITION_NO_DIRECTION_HORIZONTAL;
        const completeWord: string = service['checkBothSideNoDirection'](parsedInfo);
        expect(completeWord).to.eql(specConstants.LETTER_L + parsedInfo.lettersCommand + specConstants.HORIZONTAL_BEFORE_WORD);
    });

    it('checkBothSideNoDirection should return complete word with vertical direction if word is equal of horizontal direction word', () => {
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.NONE;
        parsedInfo.position = specConstants.MIDDLE_SQUARE_POSITION;
        const completeWord: string = service['checkBothSideNoDirection'](parsedInfo);
        expect(completeWord).to.eql(specConstants.VERTICAL_BEFORE_WORD + parsedInfo.lettersCommand + specConstants.VERTICAL_AFTER_WORD);
    });

    it('checkBothSideNoDirection should return complete word with vertical direction if word is longer than horizontal', () => {
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.NONE;
        parsedInfo.position = specConstants.POSITION_NO_DIRECTION_VERTICAL;
        const completeWord: string = service['checkBothSideNoDirection'](parsedInfo);
        expect(completeWord).to.eql(specConstants.LETTER_L + parsedInfo.lettersCommand);
    });

    it('checkBothSideNoDirection should return only letters of command if grid is empty', () => {
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.NONE;
        const completeWord: string = service['checkBothSideNoDirection'](parsedInfo);
        expect(completeWord).to.eql(parsedInfo.lettersCommand);
    });

    it('checkBothSideNoDirection should return complete word and respect grid limits', () => {
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.NONE;
        parsedInfo.position = specConstants.POSITION_END_OF_GRID;
        const completeWord: string = service['checkBothSideNoDirection'](parsedInfo);
        expect(completeWord).to.eql(specConstants.WORD_N + parsedInfo.lettersCommand);
    });

    it('convertTilesAndFindPosition should call findTilePositionBeforeWord and checkSideAfterPosition', () => {
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.HORIZONTAL;
        parsedInfo.position = specConstants.MIDDLE_SQUARE_POSITION;
        const findTilePositionBeforeWordSpy: Sinon.SinonStub<any[], any> = Sinon.stub(service, 'findTilePositionBeforeWord' as any).callThrough();
        const checkSideAfterPositionSpy: Sinon.SinonStub<any[], any> = Sinon.stub(service, 'checkSideAfterPosition' as any).callThrough();
        const tilesValidation: TilesValidation = service['convertTilesAndFindPosition'](parsedInfo);
        expect(tilesValidation.tilesCompleteWord).to.eql([specConstants.TILE_A]);
        expect(findTilePositionBeforeWordSpy.calledWith(parsedInfo));
        expect(checkSideAfterPositionSpy.calledWith(parsedInfo.position, parsedInfo.direction, parsedInfo.lettersCommand, tilesValidation));
    });

    it('convertTilesAndFindPosition should return tiles only lettersCommand tiles if grid is empty (horizontal)', () => {
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO_MULTIPLE_LETTERS;
        parsedInfo.direction = DirectionType.HORIZONTAL;
        parsedInfo.position = specConstants.MIDDLE_SQUARE_POSITION;
        parsedInfo.lettersCommand = specConstants.HORIZONTAL_AFTER_WORD;
        const tilesValidation: TilesValidation = service['convertTilesAndFindPosition'](parsedInfo);
        for (let i = 0; i < specConstants.TILES_HUMAN_HORIZONTAL.length; ++i) {
            expect(tilesValidation.tilesCompleteWord[i]).to.eql(specConstants.TILES_HUMAN_HORIZONTAL[i]);
        }
    });

    it('convertTilesAndFindPosition should return tiles only lettersCommand tiles if grid is empty (horizontal)', () => {
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO_MULTIPLE_LETTERS;
        parsedInfo.direction = DirectionType.VERTICAL;
        parsedInfo.position = specConstants.MIDDLE_SQUARE_POSITION;
        parsedInfo.lettersCommand = specConstants.HORIZONTAL_AFTER_WORD;
        const tilesValidation: TilesValidation = service['convertTilesAndFindPosition'](parsedInfo);
        for (let i = 0; i < specConstants.TILES_HUMAN_VERTICAL.length; ++i) {
            expect(tilesValidation.tilesCompleteWord[i]).to.eql(specConstants.TILES_HUMAN_VERTICAL[i]);
        }
    });

    it('convertTilesAndFindPosition should return tiles of grid and letterCommand with correct position (horizontal direction)', () => {
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO_MULTIPLE_LETTERS;
        parsedInfo.lettersCommand = specConstants.LETTER_A;
        parsedInfo.direction = DirectionType.HORIZONTAL;
        parsedInfo.position = specConstants.MIDDLE_SQUARE_POSITION;
        const tilesValidation: TilesValidation = service['convertTilesAndFindPosition'](parsedInfo);
        expect(tilesValidation.tilesCompleteWord.length).to.eql(specConstants.TILES_HORIZONTAL_DIRECTION.length);
        for (let i = 0; i < specConstants.TILES_HORIZONTAL_DIRECTION.length; ++i) {
            expect(tilesValidation.tilesCompleteWord[i]).to.eql(specConstants.TILES_HORIZONTAL_DIRECTION[i]);
        }
    });

    it('convertTilesAndFindPosition should return tiles of grid and letterCommand with correct position (vertical direction)', () => {
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO_MULTIPLE_LETTERS;
        parsedInfo.lettersCommand = specConstants.LETTER_A;
        parsedInfo.direction = DirectionType.VERTICAL;
        parsedInfo.position = specConstants.MIDDLE_SQUARE_POSITION;
        const tilesValidation: TilesValidation = service['convertTilesAndFindPosition'](parsedInfo);
        expect(tilesValidation.tilesCompleteWord.length).to.eql(specConstants.TILES_VERTICAL_DIRECTION.length);
        for (let i = 0; i < specConstants.TILES_VERTICAL_DIRECTION.length; ++i) {
            expect(tilesValidation.tilesCompleteWord[i]).to.eql(specConstants.TILES_VERTICAL_DIRECTION[i]);
        }
    });

    it('convertTilesAndFindPosition should return tiles of grid and letterCommand with correct position (no direction)', () => {
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO_MULTIPLE_LETTERS;
        parsedInfo.lettersCommand = specConstants.LETTER_A;
        parsedInfo.direction = DirectionType.NONE;
        parsedInfo.position = specConstants.MIDDLE_SQUARE_POSITION;
        const tilesValidation: TilesValidation = service['convertTilesAndFindPosition'](parsedInfo);
        expect(tilesValidation.tilesCompleteWord.length).to.eql(specConstants.TILES_VERTICAL_DIRECTION.length);
        for (let i = 0; i < specConstants.TILES_VERTICAL_DIRECTION.length; ++i) {
            expect(tilesValidation.tilesCompleteWord[i]).to.eql(specConstants.TILES_VERTICAL_DIRECTION[i]);
        }
    });

    it('convertTilesAndFindPosition should return tiles of grid and letterCommand with correct position when letterCommand is split (v)', () => {
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO_MULTIPLE_LETTERS;
        parsedInfo.lettersCommand = specConstants.LETTER_A + specConstants.LETTER_A + specConstants.LETTER_A;
        parsedInfo.direction = DirectionType.VERTICAL;
        parsedInfo.position = specConstants.POSITION_NO_DIRECTION_VERTICAL;
        const tilesValidation: TilesValidation = service['convertTilesAndFindPosition'](parsedInfo);
        specConstants.TILES_VERTICAL_DIRECTION_COMPLEX.push(...specConstants.TILES_VERTICAL_DIRECTION);
        expect(tilesValidation.tilesCompleteWord.length).to.eql(specConstants.TILES_VERTICAL_DIRECTION_COMPLEX.length);
        for (let i = 0; i < specConstants.TILES_VERTICAL_DIRECTION_COMPLEX.length; ++i) {
            expect(tilesValidation.tilesCompleteWord[i]).to.eql(specConstants.TILES_VERTICAL_DIRECTION_COMPLEX[i]);
        }
    });

    it('convertTilesAndFindPosition should return tiles of grid and letterCommand with correct position when letterCommand is split (h)', () => {
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO_MULTIPLE_LETTERS;
        parsedInfo.lettersCommand = specConstants.LETTER_A + specConstants.LETTER_A + specConstants.LETTER_A;
        parsedInfo.direction = DirectionType.HORIZONTAL;
        parsedInfo.position = { x: 1, y: 8 } as Vec2;
        const tilesValidation: TilesValidation = service['convertTilesAndFindPosition'](parsedInfo);
        expect(tilesValidation.tilesCompleteWord.length).to.eql(specConstants.TILES_HORIZONTAL_DIRECTION_COMPLEX.length);
        for (let i = 0; i < specConstants.TILES_HORIZONTAL_DIRECTION_COMPLEX.length; ++i) {
            expect(tilesValidation.tilesCompleteWord[i]).to.eql(specConstants.TILES_HORIZONTAL_DIRECTION_COMPLEX[i]);
        }
    });

    it('convertTilesAndFindPosition should call findTilesAfterNoDirection if no direction was specify', () => {
        const findTilesAfterNoDirectionSpy: Sinon.SinonStub<any[], any> | Sinon.SinonStub<unknown[], unknown> = Sinon.stub(
            service,
            'findTilesAfterNoDirection' as any,
        );
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO_MULTIPLE_LETTERS;
        parsedInfo.direction = DirectionType.NONE;
        service['convertTilesAndFindPosition'](parsedInfo);
        expect(findTilesAfterNoDirectionSpy.called);
    });

    it('addTilesToTilesValidation should add tiles to form complete word (no tile on grid)', () => {
        const tilesValidation: TilesValidation = specConstants.TILES_VALIDATION;
        tilesValidation.tilesCompleteWord = [];
        tilesValidation.tilesOnGrid = [];
        tilesValidation.newTilesToAdd = specConstants.TILES_HUMAN_HORIZONTAL;
        service['addTilesToTilesValidation'](tilesValidation, specConstants.TILES_HUMAN_HORIZONTAL);
        for (let i = 0; i < tilesValidation.tilesCompleteWord.length; ++i) {
            expect(tilesValidation.tilesCompleteWord[i]).to.eql(specConstants.TILES_HUMAN_HORIZONTAL[i]);
        }
        expect(tilesValidation.tilesOnGrid).to.eql([]);
    });

    it('addTilesToTilesValidation should add tiles to form complete word (with tiles on grid)', () => {
        const tilesValidation: TilesValidation = specConstants.TILES_VALIDATION;
        tilesValidation.tilesCompleteWord = [];
        tilesValidation.tilesOnGrid = [specConstants.TILE_X];
        tilesValidation.newTilesToAdd = [];
        service['addTilesToTilesValidation'](tilesValidation, specConstants.TILES_HUMAN_VERTICAL);
        for (let i = 0; i < tilesValidation.tilesCompleteWord.length; ++i) {
            expect(tilesValidation.tilesCompleteWord[i]).to.eql(specConstants.TILES_COMPLETE_WORD[i]);
        }
    });

    it('findTilesAfterNoDirection should call checkSideAfterPosition twice ', () => {
        const checkSideAfterPositionSpy: Sinon.SinonStub<any[], any> | Sinon.SinonStub<unknown[], unknown> = Sinon.stub(
            service,
            'checkSideAfterPosition' as any,
        );
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO_MULTIPLE_LETTERS;
        parsedInfo.direction = DirectionType.NONE;
        service['findTilesAfterNoDirection'](parsedInfo, specConstants.TILES_VALIDATION);

        expect(checkSideAfterPositionSpy.callCount).to.equal(specConstants.CHECK_SIDE_AFTER_POSITION_CALLS);
    });

    it('findTilesAfterNoDirection should call swapTilesValidationValues if horizontalTiles is longer than vertical', () => {
        const swapTilesValidationValuesSpy = Sinon.stub(service, 'swapTilesValidationValues' as any);
        for (const tile of specConstants.TILES_HORIZONTAL_DIRECTION) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
        }
        const parsedInfo: ParsedInfo = specConstants.PARSED_INFO;
        parsedInfo.direction = DirectionType.NONE;
        parsedInfo.position = specConstants.POSITION_NO_DIRECTION_HORIZONTAL;
        parsedInfo.lettersCommand = specConstants.INITIAL_WORD;
        const tilesValidation: TilesValidation = {
            tilesCompleteWord: [],
            tilesOnGrid: [],
            newTilesToAdd: [],
            adjacentTiles: [],
            adjacentWords: [],
        } as TilesValidation;
        service['findTilesAfterNoDirection'](parsedInfo, tilesValidation);
        expect(swapTilesValidationValuesSpy.called);
    });

    it('swapTilesValidationValues should change currentTilesValidation values for newTilesValidation', () => {
        const currentTilesValidation: TilesValidation = specConstants.TILES_VALIDATION;
        const newTilesValidation: TilesValidation = specConstants.NEW_TILES_VALIDATION;
        service['swapTilesValidationValues'](currentTilesValidation, newTilesValidation);
        expect(currentTilesValidation).to.eql(newTilesValidation);
    });
});
