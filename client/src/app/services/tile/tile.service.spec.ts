/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { GRID_DEFAULT_HEIGHT, GRID_DEFAULT_WIDTH } from '@app/../../../common/model/constants';
import * as serviceConstants from '@app/classes/constants';
import { BIGGER_LETTER, TILE_BORDER_WIDTH } from '@app/classes/constants';
import { CanvasTestHelper } from '@app/components/canvas-test-helper/canvas-test-helper.component';
import { TileService } from './tile.service';
import * as specConstants from './tile.service.spec.constants';

describe('TileService', () => {
    let service: TileService;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TileService);
        ctxStub = CanvasTestHelper.createCanvas(GRID_DEFAULT_WIDTH, GRID_DEFAULT_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.tileContext = ctxStub;
        for (const validTile of specConstants.VALID_TILES) {
            validTile.width = specConstants.POSSIBLE_WIDTH;
            validTile.height = specConstants.POSSIBLE_HEIGHT;
        }
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('tile should not be valid if its position, name, or weight is invalid', () => {
        for (const invalidTile of specConstants.INVALID_TILES) {
            expect(service['isValidTile'](invalidTile)).toBeFalsy();
        }
    });

    it('tile should not be valid if its width or height is invalid', () => {
        for (const validTile of specConstants.VALID_TILES) {
            validTile.width = specConstants.NEGATIVE_WIDTH;
            expect(service['isValidTile'](validTile)).toBeFalsy();
            validTile.width = specConstants.IMPOSSIBLE_WIDTH;
            expect(service['isValidTile'](validTile)).toBeFalsy();
            validTile.width = specConstants.POSSIBLE_WIDTH;
            validTile.height = specConstants.NEGATIVE_HEIGHT;
            expect(service['isValidTile'](validTile)).toBeFalsy();
            validTile.height = specConstants.IMPOSSIBLE_HEIGHT;
            expect(service['isValidTile'](validTile)).toBeFalsy();
        }
    });

    it('tile should be valid if its inputs are also valid', () => {
        for (const validTile of specConstants.VALID_TILES) {
            expect(service['isValidTile'](validTile)).toBeTruthy();
        }
    });

    it('tile onClick should change clicked property to true', () => {
        for (const validTile of specConstants.VALID_TILES) {
            validTile.leftClicked = false;
            service.onClick(validTile);
            expect(validTile.leftClicked).toBeTruthy();
        }
    });

    it('tile onClick should call drawTileBorder', () => {
        const drawTileBorderSpy = spyOn<any>(service, 'drawTileBorder').and.stub();
        for (const validTile of specConstants.VALID_TILES) {
            service.onClick(validTile);
        }
        expect(drawTileBorderSpy).toHaveBeenCalledTimes(specConstants.VALID_TILES.length);
    });

    it('tile onOutsideClick should change clicked property to false', () => {
        for (const validTile of specConstants.VALID_TILES) {
            validTile.leftClicked = true;
            service.onOutsideClick(validTile);
            expect(validTile.leftClicked).toBeFalsy();
        }
    });

    it('tile onOutsideClick should call drawTileBorder', () => {
        const drawTileBorderSpy = spyOn<any>(service, 'drawTileBorder').and.stub();
        for (const validTile of specConstants.VALID_TILES) {
            service.onOutsideClick(validTile);
        }
        expect(drawTileBorderSpy).toHaveBeenCalledTimes(specConstants.VALID_TILES.length);
    });

    it('clearTile should not call clearRect for invalid tiles', () => {
        const clearRectSpy = spyOn(service.tileContext, 'clearRect').and.stub();
        for (const invalidSpy of specConstants.INVALID_TILES) {
            service.clearTile(invalidSpy);
            expect(clearRectSpy).not.toHaveBeenCalled();
        }
    });

    it('clearTile should call clearRect for valid tiles', () => {
        const clearRectSpy = spyOn(service.tileContext, 'clearRect').and.stub();
        for (const validTile of specConstants.VALID_TILES) {
            service.clearTile(validTile);
            expect(clearRectSpy).toHaveBeenCalled();
        }
    });

    it('drawTileBackground should not call fillRect for invalid tiles', () => {
        const fillRectSpy = spyOn(service.tileContext, 'fillRect').and.stub();
        for (const invalidTile of specConstants.INVALID_TILES) {
            service.drawTileBackground(invalidTile, specConstants.DEFAULT_COLOR);
            expect(fillRectSpy).not.toHaveBeenCalled();
        }
    });

    it('drawTileBackground should call fillRect for valid tiles', () => {
        const fillRectSpy = spyOn(service.tileContext, 'fillRect').and.stub();
        for (const validTile of specConstants.VALID_TILES) {
            service.drawTileBackground(validTile, specConstants.DEFAULT_COLOR);
            expect(fillRectSpy).toHaveBeenCalled();
        }
    });

    it('drawTileBackground should change fillStyle for valid tiles', () => {
        for (const validTile of specConstants.VALID_TILES) {
            service.tileContext.fillStyle = '';
            service.drawTileBackground(validTile, specConstants.DEFAULT_COLOR);
            expect(service.tileContext.fillStyle).toEqual(specConstants.DEFAULT_COLOR_HEX);
        }
    });

    it('drawTileBorder should not call beginPath, moveTo, lineTo, nor stroke for invalid tiles', () => {
        const beginPathSpy = spyOn(service.tileContext, 'beginPath').and.stub();
        const moveToSpy = spyOn(service.tileContext, 'moveTo').and.stub();
        const lineToSpy = spyOn(service.tileContext, 'lineTo').and.stub();
        const strokeSpy = spyOn(service.tileContext, 'stroke').and.stub();
        for (const invalidTile of specConstants.INVALID_TILES) {
            service['drawTileBorder'](invalidTile, specConstants.DEFAULT_COLOR);
            expect(beginPathSpy).not.toHaveBeenCalled();
            expect(moveToSpy).not.toHaveBeenCalled();
            expect(lineToSpy).not.toHaveBeenCalled();
            expect(strokeSpy).not.toHaveBeenCalled();
        }
    });

    it('drawTileBorder should call beginPath, moveTo, lineTo, and stroke for valid tiles', () => {
        const beginPathSpy = spyOn(service.tileContext, 'beginPath').and.stub();
        const moveToSpy = spyOn(service.tileContext, 'moveTo').and.stub();
        const lineToSpy = spyOn(service.tileContext, 'lineTo').and.stub();
        const strokeSpy = spyOn(service.tileContext, 'stroke').and.stub();
        for (const validTile of specConstants.VALID_TILES) {
            service['drawTileBorder'](validTile, specConstants.DEFAULT_COLOR);
            expect(beginPathSpy).toHaveBeenCalled();
            expect(moveToSpy).toHaveBeenCalled();
            expect(lineToSpy).toHaveBeenCalled();
            expect(strokeSpy).toHaveBeenCalled();
        }
    });

    it('drawTileBorder should change strokeStyle and lineWidth for valid tiles', () => {
        for (const validTile of specConstants.VALID_TILES) {
            service.tileContext.strokeStyle = '';
            service.tileContext.lineWidth = 0;
            service['drawTileBorder'](validTile, specConstants.DEFAULT_COLOR);
            expect(service.tileContext.strokeStyle).toEqual(specConstants.DEFAULT_COLOR_HEX);
            expect(service.tileContext.lineWidth).toEqual(TILE_BORDER_WIDTH);
        }
    });

    it('drawTileInfo should change fillStyle for valid tiles', () => {
        for (const validTile of specConstants.VALID_TILES) {
            service.tileContext.fillStyle = '';
            service.drawTileInfo(validTile, serviceConstants.TILE_FONT_SIZE_EASEL, specConstants.DEFAULT_COLOR);
            expect(service.tileContext.fillStyle).toEqual(specConstants.DEFAULT_COLOR_HEX);
        }
    });

    it('drawTileInfo should call drawLetterOnTile and drawWeightOnTile for valid tile', () => {
        const drawLetterOnLetterOnTileSpy = spyOn<any>(service, 'drawLetterOnTile').and.stub();
        const drawWeightOnLetterOnTileSpy = spyOn<any>(service, 'drawWeightOnTile').and.stub();
        service.drawTileInfo(specConstants.VALID_TILES[0], specConstants.FONT_SIZE, specConstants.COLOR_FONT);
        expect(drawLetterOnLetterOnTileSpy).toHaveBeenCalled();
        expect(drawWeightOnLetterOnTileSpy).toHaveBeenCalled();
    });

    it('drawTileInfo should not call drawLetterOnTile and drawWeightOnTile for invalid tile', () => {
        const drawLetterOnLetterOnTileSpy = spyOn<any>(service, 'drawLetterOnTile').and.stub();
        const drawWeightOnLetterOnTileSpy = spyOn<any>(service, 'drawWeightOnTile').and.stub();
        for (const invalidTile of specConstants.INVALID_TILES) {
            service.drawTileInfo(invalidTile, specConstants.FONT_SIZE, specConstants.COLOR_FONT);
            expect(drawLetterOnLetterOnTileSpy).not.toHaveBeenCalled();
            expect(drawWeightOnLetterOnTileSpy).not.toHaveBeenCalled();
        }
    });

    it('drawTileInfo should call changeFontSizeOfBiggerLetterTile for bigger letter tile', () => {
        const changeSizeOfBiggerLetterSpy = spyOn<any>(service, 'changeFontSizeOfBiggerLetterTile').and.stub();
        for (const biggerLetterTile of specConstants.BIGGER_LETTER_TILES) {
            service.drawTileInfo(biggerLetterTile, specConstants.FONT_SIZE, specConstants.COLOR_FONT);
            expect(changeSizeOfBiggerLetterSpy).toHaveBeenCalled();
        }
    });

    it('isBiggerLetter should return true for K, X, W, Z, Y', () => {
        for (const biggerLetter of BIGGER_LETTER) {
            expect(service['isBiggerLetter'](biggerLetter)).toEqual(true);
        }
    });

    it('isBiggerLetter should return false for other letters', () => {
        for (const notBiggerLetter of specConstants.NOT_BIGGER_LETTERS) {
            expect(service['isBiggerLetter'](notBiggerLetter)).toEqual(false);
        }
    });

    it('changeFontSizeOfBiggerLetterTile should return font size smaller by 2 than input', () => {
        const expectedNewFontSize = specConstants.FONT_SIZE;
        expect(service['changeFontSizeOfBiggerLetterTile'](specConstants.FONT_SIZE_BIGGER_THAN_MAX)).toEqual(expectedNewFontSize);
    });

    it('changeFontSizeOfBiggerLetterTile should return font size smaller by 4 than input', () => {
        const expectedNewFontSize = specConstants.FONT_SIZE - 2;
        expect(service['changeFontSizeOfBiggerLetterTile'](specConstants.FONT_SIZE)).toEqual(expectedNewFontSize);
    });

    it('drawTile should call drawTileInfo, fillRect and strokeRect', () => {
        const drawTileInfoSpy = spyOn<any>(service, 'drawTileInfo').and.stub();
        const fillRectSpy = spyOn(service.tileContext, 'fillRect').and.stub();
        const strokeRectSpy = spyOn(service.tileContext, 'strokeRect').and.stub();
        service.drawTile(specConstants.VALID_TILES[0], specConstants.FONT_SIZE);
        expect(drawTileInfoSpy).toHaveBeenCalledWith(specConstants.VALID_TILES[0], specConstants.FONT_SIZE, specConstants.COLOR_FONT);
        expect(fillRectSpy).toHaveBeenCalled();
        expect(strokeRectSpy).toHaveBeenCalled();
    });

    it('drawLetterOnTile should call fill text with correct parameters', () => {
        const fillTextSpy = spyOn(service.tileContext, 'fillText').and.stub();
        const tileSizeWithOffset = 23.25;
        const letterToUpperCase = specConstants.VALID_TILES[0].name.toUpperCase();
        service['drawLetterOnTile'](specConstants.VALID_TILES[0], specConstants.FONT_SIZE, specConstants.HALF_SIZE_TILE);
        expect(fillTextSpy).toHaveBeenCalledWith(letterToUpperCase, tileSizeWithOffset, tileSizeWithOffset);
    });

    it('drawWeightOnTile should call fill text with correct parameters', () => {
        const fillTextSpy = spyOn(service.tileContext, 'fillText').and.stub();
        const tileWeightOffsetDiv = 2.5;
        const tileSizeWithOffset = specConstants.HALF_SIZE_TILE / tileWeightOffsetDiv;
        const tileWeight = specConstants.VALID_TILES[0].weight.toString();
        service['drawWeightOnTile'](specConstants.VALID_TILES[0], specConstants.FONT_SIZE, specConstants.HALF_SIZE_TILE);
        expect(fillTextSpy).toHaveBeenCalledWith(
            tileWeight,
            specConstants.HALF_SIZE_TILE + tileSizeWithOffset,
            specConstants.HALF_SIZE_TILE + tileSizeWithOffset,
        );
    });
});
