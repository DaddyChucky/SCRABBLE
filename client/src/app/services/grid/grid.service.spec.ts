/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { ColorName } from '@app/../../../common/model/color-name';
import * as modelConstants from '@app/../../../common/model/constants';
import { DirectionType } from '@app/../../../common/model/direction-type';
import { GridDirection } from '@app/../../../common/model/grid-direction';
import { Square } from '@app/../../../common/model/square';
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';
import { WordRequest } from '@app/../../../common/model/word-request';
import * as classesConstants from '@app/classes/constants';
import { CanvasTestHelper } from '@app/components/canvas-test-helper/canvas-test-helper.component';
import { GridService } from '@app/services/grid/grid.service';
import { Subject } from 'rxjs';
import * as serviceConstants from './grid.service.constants';
import * as specConstants from './grid.service.spec.constants';

describe('GridService', () => {
    let service: GridService;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridService);
        ctxStub = CanvasTestHelper.createCanvas(modelConstants.GRID_DEFAULT_WIDTH, modelConstants.GRID_DEFAULT_HEIGHT).getContext(
            '2d',
        ) as CanvasRenderingContext2D;
        service.gridContext = ctxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('width should return the width of the grid canvas', () => {
        service.initializeGrid();
        expect(service.width).toEqual(modelConstants.GRID_DEFAULT_WIDTH);
    });

    it('height should return the height of the grid canvas', () => {
        service.initializeGrid();
        expect(service.height).toEqual(modelConstants.GRID_DEFAULT_HEIGHT);
    });

    it('gridLabelOffset should return the grid label offset of the grid canvas', () => {
        service.initializeGrid();
        expect(service.gridLabelOffset).toEqual(specConstants.CANVAS_GRID_LABEL_OFFSET);
    });

    it('squareLength should return the length of a square of the grid canvas', () => {
        service.initializeGrid();
        expect(service.squareLength).toEqual(specConstants.CANVAS_SQUARE_LENGTH);
    });

    it('grid should be initialized with 15 columns', () => {
        service.initializeGrid();
        expect(service.scrabbleGrid.elements.length).toEqual(modelConstants.GRID_SQUARES_PER_LINE);
    });

    it('grid should be initialized with 15 rows', () => {
        service.initializeGrid();
        expect(service.scrabbleGrid.elements[0].length).toEqual(modelConstants.GRID_SQUARES_PER_LINE);
    });

    it('addTilesObservable should call addTilesToGrid and subjectScrabbleGrid.next', () => {
        const tiles: Tile[] = [new Tile(specConstants.INITIAL_POSITION, 'E', 1)];
        const wordRequest: WordRequest = specConstants.WORD_REQUEST_STUB;
        wordRequest.tiles = tiles;
        const addTilesToGridSpy = spyOn<any>(service, 'addTilesToGrid').and.stub();
        service.subjectScrabbleGrid = new Subject<WordRequest>();
        const subjectScrabbleGridSpy = spyOn(service.subjectScrabbleGrid, 'next').and.stub();
        service.addTilesObservable(wordRequest);
        expect(addTilesToGridSpy).toHaveBeenCalledWith(tiles);
        expect(subjectScrabbleGridSpy).toHaveBeenCalledWith(wordRequest);
    });

    it('removeTilesObservable should call removeTileFromGrid and subjectScrabbleGrid.next', () => {
        const removeTileFromGridSpy = spyOn<any>(service, 'removeTileFromGrid');
        service.subjectScrabbleGrid = new Subject<WordRequest>();
        const subjectScrabbleGridSpy = spyOn(service.subjectScrabbleGrid, 'next').and.stub();
        service.removeTilesObservable(specConstants.WORD_REQUEST_STUB, specConstants.TILES_HUMAN_HORIZONTAL);
        expect(removeTileFromGridSpy).toHaveBeenCalled();
        expect(subjectScrabbleGridSpy).toHaveBeenCalledWith(specConstants.WORD_REQUEST_STUB);
    });

    it('grid should be initialized with 15 x 15 squares', () => {
        service.initializeGrid();
        for (let y = 0; y < modelConstants.GRID_SQUARES_PER_LINE; ++y) {
            for (let x = 0; x < modelConstants.GRID_SQUARES_PER_LINE; ++x) {
                const square = service.scrabbleGrid.elements[y][x];
                expect(square).toBeTruthy();
                expect(square['tile']).toEqual(specConstants.INITIAL_SQUARE_STUB.tile);
                expect(square['position']['x']).toEqual(x);
                expect(square['position']['y']).toEqual(y);
            }
        }
    });

    it('convertPositionToSquareName should convert square position to name', () => {
        for (let i = 0; i < specConstants.POSITIONS.length; ++i)
            expect(specConstants.NAMES[i]).toEqual(service['convertPositionToSquareName'](specConstants.POSITIONS[i]) as string);
    });

    it('grid initialization should call convertPositionToSquareName for each square in the grid', () => {
        const convertPositionToSquareNameSpy = spyOn<any>(service, 'convertPositionToSquareName');
        service.initializeGrid();
        expect(convertPositionToSquareNameSpy).toHaveBeenCalledTimes(classesConstants.NUMBER_OF_SQUARES);
    });

    it('grid initialization should call doConvertBaseSquareToPremium for each square in the grid', () => {
        const doConvertBaseSquareToPremiumSpy = spyOn<any>(service, 'doConvertBaseSquareToPremium');
        service.initializeGrid();
        expect(doConvertBaseSquareToPremiumSpy).toHaveBeenCalledTimes(classesConstants.NUMBER_OF_SQUARES);
    });

    it('drawGrid should call beginPath on the canvas', () => {
        spyOn<any>(service, 'drawSquare').and.stub();
        const beginPathSpy = spyOn(service.gridContext, 'beginPath');
        service['drawGrid']();
        expect(beginPathSpy).toHaveBeenCalled();
    });

    it('drawGrid should call stroke on the canvas', () => {
        spyOn<any>(service, 'drawSquare').and.stub();
        const strokeSpy = spyOn(service.gridContext, 'stroke').and.stub();
        service['drawGrid']();
        expect(strokeSpy).toHaveBeenCalled();
    });

    it('drawGrid should call drawLegend on the canvas to the number of columns times', () => {
        spyOn<any>(service, 'drawSquare').and.stub();
        const drawLegendSpy = spyOn<any>(service, 'drawLegend').and.stub();
        service['drawGrid']();
        expect(drawLegendSpy).toHaveBeenCalledTimes(modelConstants.GRID_SQUARES_PER_LINE);
    });

    it('drawGrid should call drawLastLinesOfGrid', () => {
        spyOn<any>(service, 'drawSquare').and.stub();
        const drawLastLinesOfGridSpy = spyOn<any>(service, 'drawLastLinesOfGrid');
        service['drawGrid']();
        expect(drawLastLinesOfGridSpy).toHaveBeenCalled();
    });

    it('drawGrid should call drawSquare on the canvas to the number of scrabble squares', () => {
        const drawSquareSpy = spyOn<any>(service, 'drawSquare');
        service['drawGrid']();
        expect(drawSquareSpy).toHaveBeenCalledTimes(classesConstants.NUMBER_OF_SQUARES);
    });

    it('drawGrid should change strokeStyle, lineWidth and font', () => {
        spyOn<any>(service, 'drawSquare').and.stub();
        service['drawGrid']();
        expect(service.gridContext.strokeStyle).toBeDefined();
        expect(service.gridContext.strokeStyle).toEqual(specConstants.GRID_DEFAULT_STROKE_STYLE);
        expect(service.gridContext.lineWidth).toBeDefined();
        expect(service.gridContext.lineWidth).toEqual(classesConstants.GRID_LINE_WIDTH);
        expect(service.gridContext.font).toBeDefined();
        expect(service.gridContext.font).toEqual(classesConstants.GRID_DEFAULT_FONT);
    });

    it('drawSquare should have called moveTo, lineTo and fillRect to the number of scrabble squares', () => {
        const moveToSpy = spyOn(service.gridContext, 'moveTo');
        const lineToSpy = spyOn(service.gridContext, 'lineTo');
        const fillRectSpy = spyOn(service.gridContext, 'fillRect');
        service.initializeGrid();
        service['drawGrid']();
        expect(moveToSpy).toHaveBeenCalledTimes(
            classesConstants.NUMBER_OF_SQUARES + modelConstants.GRID_SQUARES_PER_LINE + specConstants.NUMBER_OF_LAST_LINES_OF_GRID,
        );
        expect(lineToSpy).toHaveBeenCalledTimes(
            classesConstants.NUMBER_OF_SQUARES + modelConstants.GRID_SQUARES_PER_LINE + specConstants.NUMBER_OF_LAST_LINES_OF_GRID,
        );
        expect(fillRectSpy).toHaveBeenCalledTimes(classesConstants.NUMBER_OF_SQUARES);
    });

    it('drawSquare should have called fillSquareName to the number of premium squares', () => {
        const fillSquareNameSpy = spyOn<any>(service, 'fillSquareName');
        service.initializeGrid();
        service['drawGrid']();
        expect(fillSquareNameSpy).toHaveBeenCalledTimes(specConstants.NUMBER_OF_PREMIUM_SQUARES);
    });

    it('drawSquare should change brushPosition and fillStyle to the last square position and color', () => {
        service.initializeGrid();
        service['drawGrid']();
        expect((service.gridContext.fillStyle as string).toUpperCase()).toEqual(ColorName.RED.toUpperCase());
        expect(service['brushPosition'].x).toBeGreaterThan(specConstants.END_POSITION.x);
        expect(service['brushPosition'].x).toBeLessThan(modelConstants.GRID_DEFAULT_WIDTH);
        expect(service['brushPosition'].y).toBeGreaterThan(specConstants.END_POSITION.y);
        expect(service['brushPosition'].y).toBeLessThan(modelConstants.GRID_DEFAULT_HEIGHT);
    });

    it('drawLegend should call moveTo, lineTo, and fillText for a valid rowIndex', () => {
        const moveToSpy = spyOn(service.gridContext, 'moveTo');
        const lineToSpy = spyOn(service.gridContext, 'lineTo');
        const fillTextSpy = spyOn(service.gridContext, 'fillText');
        const halfDivider = 2;
        service['drawLegend'](Math.floor(modelConstants.GRID_SQUARES_PER_LINE / halfDivider));
        expect(moveToSpy).toHaveBeenCalled();
        expect(lineToSpy).toHaveBeenCalled();
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it('drawLegend should not call moveTo, lineTo, and fillText for invalid rowIndexes', () => {
        const moveToSpy = spyOn(service.gridContext, 'moveTo');
        const lineToSpy = spyOn(service.gridContext, 'lineTo');
        const fillTextSpy = spyOn(service.gridContext, 'fillText');
        service['drawLegend'](modelConstants.GRID_SQUARES_PER_LINE);
        service['drawLegend'](specConstants.NEGATIVE_ROW_INDEX);
        expect(moveToSpy).not.toHaveBeenCalled();
        expect(lineToSpy).not.toHaveBeenCalled();
        expect(fillTextSpy).not.toHaveBeenCalled();
    });

    it('convertPositionToSquareName should return undefined if position given is out of index', () => {
        for (const invalidPosition of specConstants.INVALID_SQUARE_POSITIONS) {
            expect(service['convertPositionToSquareName'](invalidPosition)).toEqual(undefined);
        }
    });

    it('fillSquareName should call fillText for valid inputs', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText');
        service['fillSquareName']('', '', specConstants.START_SQUARE_POSITIONS);
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it('fillSquareName should not call fillText for an invalid brush position', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText');
        for (const invalidPosition of specConstants.INVALID_POSITIONS_CANVAS) {
            service['fillSquareName']('', '', invalidPosition);
        }
        expect(fillTextSpy).not.toHaveBeenCalled();
    });

    it('fillSquareName should not change font and fillstyle for a valid input', () => {
        service.gridContext.font = specConstants.DEFAULT_CANVAS_FONT;
        service.gridContext.fillStyle = specConstants.DEFAULT_CANVAS_FILLSTYLE;
        service['fillSquareName']('', '', specConstants.START_SQUARE_POSITIONS);
        expect(service.gridContext.font).toEqual(specConstants.DEFAULT_CANVAS_FONT);
        expect(service.gridContext.fillStyle).toEqual(specConstants.DEFAULT_CANVAS_FILLSTYLE);
    });

    it('drawStar should change imageStar.src when called with a non-middle square', () => {
        const imageSrcBefore: string = service['starImage'].src;
        expect(imageSrcBefore).toEqual(specConstants.EMPTY_STAR_IMAGE_SRC);
        service['drawStar'](specConstants.NOT_MIDDLE_SQUARE);
        expect(service['starImage'].src).toEqual(specConstants.EMPTY_STAR_IMAGE_SRC);
    });

    it('drawStar should change imageStar.src when called with middle square that contains tile', () => {
        specConstants.MIDDLE_SQUARE.tile = specConstants.TILE_ON_MIDDLE_SQUARE;
        const imageSrcBefore: string = service['starImage'].src;
        expect(imageSrcBefore).toEqual(specConstants.EMPTY_STAR_IMAGE_SRC);
        service['drawStar'](specConstants.MIDDLE_SQUARE);
        expect(service['starImage'].src).toEqual(specConstants.EMPTY_STAR_IMAGE_SRC);
    });

    it('drawStar should change imageStar.src when called with empty middle square', () => {
        specConstants.MIDDLE_SQUARE.tile = null;
        const imageSrcBefore: string = service['starImage'].src;
        expect(imageSrcBefore).toEqual(specConstants.EMPTY_STAR_IMAGE_SRC);
        service['drawStar'](specConstants.MIDDLE_SQUARE);
        expect(service['starImage'].src).toContain(serviceConstants.STAR_SRC);
    });

    it('drawLastLinesOfGrid should call twice moveTo() and lineTo()', () => {
        const moveToSpy = spyOn(service.gridContext, 'moveTo');
        const lineToSpy = spyOn(service.gridContext, 'lineTo');
        service['drawLastLinesOfGrid']();
        expect(moveToSpy).toHaveBeenCalledTimes(specConstants.NUMBER_OF_LAST_LINES_OF_GRID);
        expect(lineToSpy).toHaveBeenCalledTimes(specConstants.NUMBER_OF_LAST_LINES_OF_GRID);
    });

    it('nextPosition should return position (x + 1, y) for horizontal direction', () => {
        const nextPosition = service['nextPosition'](specConstants.INITIAL_POSITION, DirectionType.HORIZONTAL, GridDirection.AFTER);
        expect(nextPosition.x).toEqual(specConstants.INITIAL_POSITION.x + 1);
        expect(nextPosition.y).toEqual(specConstants.INITIAL_POSITION.y);
    });

    it('nextPosition should return position (x, y + 1) for vertical direction', () => {
        const nextPosition = service['nextPosition'](specConstants.INITIAL_POSITION, DirectionType.VERTICAL, GridDirection.AFTER);
        expect(nextPosition.x).toEqual(specConstants.INITIAL_POSITION.x);
        expect(nextPosition.y).toEqual(specConstants.INITIAL_POSITION.y + 1);
    });

    it('convertStringWordToTiles should return empty tile array if word does not contain letter', () => {
        const expectedTiles: Tile[] = [];
        const tiles: Tile[] = service.convertStringWordToTiles(specConstants.INVALID_WORD);
        expect(tiles).toEqual(expectedTiles);
    });

    it('convertStringWordToTiles should return array of tiles with correct letters', () => {
        const expectedTiles: Tile[] = [];
        const tiles: Tile[] = service.convertStringWordToTiles(specConstants.VALID_WORD);
        expect(tiles.length).toEqual(specConstants.VALID_WORD.length);
        for (let index = 0; index < specConstants.VALID_WORD.length; ++index) {
            expectedTiles.push(
                new Tile(specConstants.INITIAL_POSITION, specConstants.VALID_WORD[index].toUpperCase(), classesConstants.TILES_WEIGHT[index]),
            );
            expect(tiles[index]).toEqual(expectedTiles[index]);
        }
    });

    it('drawTilesAndScrabbleGrid should call drawGrid', () => {
        service.initializeGrid();
        const drawGridSpy = spyOn<any>(service, 'drawGrid');
        service.drawTilesAndScrabbleGrid(classesConstants.TILE_FONT_SIZE_GRID);
        expect(drawGridSpy).toHaveBeenCalled();
    });

    it('drawTilesAndScrabbleGrid should call drawTileOnGrid 0 time with empty grid', () => {
        const numberOfCallsOfSpy = 0;
        service.initializeGrid();
        const drawTileOnGridSpy = spyOn<any>(service, 'drawTileOnGrid').and.stub();
        service.drawTilesAndScrabbleGrid(classesConstants.TILE_FONT_SIZE_GRID);
        expect(drawTileOnGridSpy).toHaveBeenCalledTimes(numberOfCallsOfSpy);
    });

    it('drawTilesAndScrabbleGrid should call drawTileOnGrid 1 times with grid with one tile', () => {
        const numberOfCallsOfSpy = 1;
        service.initializeGrid();
        service.scrabbleGrid.elements[classesConstants.MIDDLE_SQUARE_POSITION.y][classesConstants.MIDDLE_SQUARE_POSITION.x].tile =
            specConstants.TILE_ON_MIDDLE_SQUARE;
        const drawTileOnGridSpy = spyOn<any>(service, 'drawTileOnGrid').and.stub();
        service.drawTilesAndScrabbleGrid(classesConstants.TILE_FONT_SIZE_GRID);
        expect(drawTileOnGridSpy).toHaveBeenCalledTimes(numberOfCallsOfSpy);
    });

    it('convertGridPositionToDrawPosition should return draw grid position for grid position', () => {
        const expectedDrawPosition = specConstants.INITIAL_POSITION.x * service.squareLength + service.gridLabelOffset;
        const expectedPosition: Vec2 = { x: expectedDrawPosition, y: expectedDrawPosition } as Vec2;
        const drawPositionForFirstSquare = service['convertGridPositionToDrawPosition'](specConstants.INITIAL_POSITION);
        expect(drawPositionForFirstSquare).toEqual(expectedPosition);
    });

    it('getSquare should return square from grid at specific position', () => {
        service.initializeGrid();
        service.scrabbleGrid.elements[classesConstants.MIDDLE_SQUARE_POSITION.y][classesConstants.MIDDLE_SQUARE_POSITION.x] =
            specConstants.MIDDLE_SQUARE;
        expect(service['getSquare'](classesConstants.MIDDLE_SQUARE_POSITION)).toEqual(specConstants.MIDDLE_SQUARE);
    });

    it('setPosition should not change tile position if new and old positions are equal', () => {
        service['setPosition'](specConstants.TILE_ON_MIDDLE_SQUARE, classesConstants.MIDDLE_SQUARE_POSITION);
        expect(specConstants.TILE_ON_MIDDLE_SQUARE.position).toEqual(classesConstants.MIDDLE_SQUARE_POSITION);
    });

    it('setPosition should set position of tile to new position', () => {
        service['setPosition'](specConstants.TILE_ON_MIDDLE_SQUARE, specConstants.INITIAL_POSITION);
        expect(specConstants.TILE_ON_MIDDLE_SQUARE.position).toEqual(specConstants.INITIAL_POSITION);
    });

    it('drawTileOnGrid should call convertGridPositionToDrawPosition with correct parameters', () => {
        const convertGridPositionToDrawPositionSpy = spyOn<any>(service, 'convertGridPositionToDrawPosition').and.returnValue(
            specConstants.POSITIONS[0],
        );
        service['drawTileOnGrid'](
            new Tile(
                specConstants.TILE_ON_MIDDLE_SQUARE.position,
                specConstants.TILE_ON_MIDDLE_SQUARE.name,
                specConstants.TILE_ON_MIDDLE_SQUARE.weight,
            ),
            classesConstants.TILE_FONT_SIZE_GRID,
        );
        expect(convertGridPositionToDrawPositionSpy).toHaveBeenCalledWith(specConstants.TILE_ON_MIDDLE_SQUARE.position);
    });

    it('drawTileOnGrid should call drawImage and convertGridPositionToDrawPosition with correct parameters', () => {
        const drawImageSpy = spyOn<any>(service.gridContext, 'drawImage').and.stub();
        const convertGridPositionToDrawPositionSpy = spyOn<any>(service, 'convertGridPositionToDrawPosition').and.returnValue(
            specConstants.POSITIONS[0],
        );
        service['drawTileOnGrid'](specConstants.TILE_ON_MIDDLE_SQUARE, classesConstants.TILE_FONT_SIZE_GRID);
        expect(convertGridPositionToDrawPositionSpy).toHaveBeenCalledWith(specConstants.TILE_ON_MIDDLE_SQUARE.position);
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('isValidGridPosition should return false for invalid position', () => {
        for (const invalidPosition of specConstants.INVALID_POSITIONS) {
            expect(service['isValidGridPosition'](invalidPosition)).toEqual(false);
        }
    });

    it('isValidGridPosition should return true for valid position', () => {
        for (const validPosition of specConstants.POSITIONS) {
            expect(service['isValidGridPosition'](validPosition)).toEqual(true);
        }
    });

    it('doConvertBaseSquareToPremium should transform color and multiplier for WORDX3 premium square', () => {
        specConstants.SQUARE.name = 'A1';
        specConstants.SQUARE.position = specConstants.INITIAL_POSITION;
        service['doConvertBaseSquareToPremium'](specConstants.SQUARE);
        expect(specConstants.SQUARE.wordMultiplier).toEqual(modelConstants.GRID_WORDX3_MULTIPLIER);
        expect(specConstants.SQUARE.color).toEqual(ColorName.RED);
    });

    it('doConvertBaseSquareToPremium should transform color and multiplier for WORDX2 premium square', () => {
        specConstants.SQUARE.name = 'B2';
        specConstants.SQUARE.position = { x: 1, y: 1 } as Vec2;
        service['doConvertBaseSquareToPremium'](specConstants.SQUARE);
        expect(specConstants.SQUARE.wordMultiplier).toEqual(modelConstants.GRID_WORDX2_MULTIPLIER);
        expect(specConstants.SQUARE.color).toEqual(ColorName.PALE_RED);
    });

    it('doConvertBaseSquareToPremium should transform color and multiplier for LETTERX2 premium square', () => {
        specConstants.SQUARE.name = 'A4';
        specConstants.SQUARE.position = { x: 3, y: 0 } as Vec2;
        service['doConvertBaseSquareToPremium'](specConstants.SQUARE);
        expect(specConstants.SQUARE.letterMultiplier).toEqual(modelConstants.GRID_LETTERX2_MULTIPLIER);
        expect(specConstants.SQUARE.color).toEqual(ColorName.PALE_BLUE);
    });

    it('doConvertBaseSquareToPremium should transform color and multiplier for LETTERX3 premium square', () => {
        specConstants.SQUARE.name = 'B6';
        specConstants.SQUARE.position = { x: 5, y: 1 } as Vec2;
        service['doConvertBaseSquareToPremium'](specConstants.SQUARE);
        expect(specConstants.SQUARE.letterMultiplier).toEqual(modelConstants.GRID_LETTERX3_MULTIPLIER);
        expect(specConstants.SQUARE.color).toEqual(ColorName.BLUE);
    });

    it('doConvertBaseSquareToPremium should not change color and multiplier for normal square', () => {
        service['doConvertBaseSquareToPremium'](specConstants.NORMAL_SQUARE);
        expect(specConstants.NORMAL_SQUARE.letterMultiplier).toEqual(classesConstants.SQUARE_WITHOUT_MULTIPLIER);
        expect(specConstants.NORMAL_SQUARE.wordMultiplier).toEqual(classesConstants.SQUARE_WITHOUT_MULTIPLIER);
        expect(specConstants.NORMAL_SQUARE.color).toEqual(ColorName.BEIGE);
    });

    it('addTilesToGrid should not add tiles if squares already contain a tile', () => {
        const tiles: Tile[] = specConstants.TILES_TO_ADD;
        service.initializeGrid();
        const position: Vec2[] = specConstants.POSITIONS_TO_ADD_TILES;
        for (let i = 0; i < specConstants.TILES_ON_BOARD.length; ++i) {
            service.scrabbleGrid.elements[position[i].y][position[i].x].tile = specConstants.TILES_ON_BOARD[i];
            tiles[i].position = position[i];
        }

        service['addTilesToGrid'](tiles);
        expect(specConstants.TILES_TO_ADD.length).toEqual(specConstants.POSITIONS_TO_ADD_TILES.length);
        for (let i = 0; i < specConstants.TILES_TO_ADD.length; ++i) {
            expect(service.scrabbleGrid.elements[position[i].y][position[i].x].tile).toEqual(specConstants.TILES_ON_BOARD[i]);
        }
    });

    it('addTilesToGrid should add tiles if squares are empty', () => {
        const tiles: Tile[] = specConstants.TILES_TO_ADD;
        service.initializeGrid();
        const position: Vec2[] = specConstants.POSITIONS_TO_ADD_TILES;
        for (let i = 0; i < specConstants.TILES_ON_BOARD.length; ++i) {
            tiles[i].position = position[i];
        }
        service['addTilesToGrid'](tiles);
        for (let i = 0; i < specConstants.TILES_TO_ADD.length; ++i) {
            expect(service.scrabbleGrid.elements[position[i].y][position[i].x].tile).toEqual(specConstants.TILES_TO_ADD[i]);
        }
        expect(specConstants.TILES_TO_ADD.length).toEqual(specConstants.POSITIONS_TO_ADD_TILES.length);
    });

    it('addTilesToGrid should not add tiles if get tile is invalid', () => {
        const getSquareSpy = spyOn(service, 'getSquare' as any).and.stub();
        service.initializeGrid();
        service['addTilesToGrid']([new Tile()]);
        expect(getSquareSpy).not.toHaveBeenCalled();
    });

    it('addWordToGrid should not add word if startPosition is invalid', () => {
        const invalidPosition: Vec2 = specConstants.INVALID_POSITIONS[0];
        service.initializeGrid();
        service.addWordToGrid(specConstants.TILES_TO_ADD, invalidPosition, DirectionType.HORIZONTAL);
        for (let y = 0; y < modelConstants.GRID_SQUARES_PER_LINE; ++y) {
            for (let x = 0; x < modelConstants.GRID_SQUARES_PER_LINE; ++x) {
                expect(service.scrabbleGrid.elements[y][x].tile).toBeNull();
            }
        }
    });

    it('addWordToGrid should add word if start position is valid and direction is horizontal', () => {
        const validPosition: Vec2 = specConstants.INITIAL_POSITION;
        service.initializeGrid();
        service.addWordToGrid(specConstants.TILES_TO_ADD, validPosition, DirectionType.HORIZONTAL);
        for (let i = 0; i < specConstants.TILES_TO_ADD.length; ++i) {
            expect(service.scrabbleGrid.elements[validPosition.y][validPosition.x + i].tile).toEqual(specConstants.TILES_TO_ADD[i]);
        }
    });

    it('addWordToGrid should add word if start position is valid and direction is vertical', () => {
        const validPosition: Vec2 = specConstants.INITIAL_POSITION;
        service.initializeGrid();
        service.addWordToGrid(specConstants.TILES_TO_ADD, validPosition, DirectionType.VERTICAL);
        for (let i = 0; i < specConstants.TILES_TO_ADD.length; ++i) {
            expect(service.scrabbleGrid.elements[validPosition.y + i][validPosition.x].tile).toEqual(specConstants.TILES_TO_ADD[i]);
        }
    });

    it('addWordToGrid should not add tile if square already contains tile', () => {
        const validPosition: Vec2 = specConstants.INITIAL_POSITION;
        service.initializeGrid();
        for (let i = 0; i < specConstants.TILES_ON_BOARD.length; ++i) {
            service.scrabbleGrid.elements[validPosition.y][validPosition.x + i].tile = specConstants.TILES_ON_BOARD[i];
        }
        service.addWordToGrid(specConstants.TILES_TO_ADD, validPosition, DirectionType.HORIZONTAL);
        for (let i = 0; i < specConstants.TILES_TO_ADD.length; ++i) {
            expect(service.scrabbleGrid.elements[validPosition.y][validPosition.x + i].tile).toEqual(specConstants.TILES_ON_BOARD[i]);
        }
    });

    it('addWordToGrid should add tiles and skip a square that already contains a tile', () => {
        service.initializeGrid();
        const secondWordPosition: Vec2 = { x: 7, y: 6 };
        service.addWordToGrid(specConstants.TILES_ON_BOARD, classesConstants.MIDDLE_SQUARE_POSITION, DirectionType.HORIZONTAL);
        service.addWordToGrid(specConstants.TILES_TO_ADD, secondWordPosition, DirectionType.VERTICAL);
        for (let i = 0; i < specConstants.TILES_TO_ADD.length; ++i) {
            const position: Vec2 = { x: secondWordPosition.x, y: secondWordPosition.y + i } as Vec2;
            if (position.x === classesConstants.MIDDLE_SQUARE_POSITION.x && position.y === classesConstants.MIDDLE_SQUARE_POSITION.y) {
                expect(service.scrabbleGrid.elements[position.y][position.x].tile?.name).toEqual(specConstants.TILES_ON_BOARD[i].name);
            } else if (position.y < classesConstants.MIDDLE_SQUARE_POSITION.y) {
                expect(service.scrabbleGrid.elements[position.y][position.x].tile?.name).toEqual(specConstants.TILES_TO_ADD[i].name);
            } else {
                expect(service.scrabbleGrid.elements[position.y][position.x].tile?.name).toEqual(specConstants.TILES_TO_ADD[i - 1].name);
            }
        }
    });

    it('addWordToGrid should only add tiles inside grid', () => {
        service.initializeGrid();
        const positionNearEnd: Vec2 = { x: 13, y: 0 } as Vec2;
        service.addWordToGrid(specConstants.TILES_ON_BOARD, positionNearEnd, DirectionType.HORIZONTAL);
        for (let i = 0; i < specConstants.TILES_ON_BOARD.length; ++i) {
            if (positionNearEnd.x + i < modelConstants.GRID_SQUARES_PER_LINE)
                expect(service.scrabbleGrid.elements[positionNearEnd.y][positionNearEnd.x + i].tile).toEqual(specConstants.TILES_ON_BOARD[i]);
        }
    });

    it('removeTileFromGrid should set to null all tiles added in scrabbleGrid', () => {
        service.initializeGrid();
        service.addWordToGrid(specConstants.TILES_ON_BOARD, classesConstants.MIDDLE_SQUARE_POSITION, DirectionType.HORIZONTAL);
        for (let i = 0; i < specConstants.TILES_TO_ADD.length; ++i) {
            expect(
                service.scrabbleGrid.elements[classesConstants.MIDDLE_SQUARE_POSITION.y][classesConstants.MIDDLE_SQUARE_POSITION.x + i].tile,
            ).toEqual(specConstants.TILES_ON_BOARD[i]);
        }
        service['removeTileFromGrid'](specConstants.TILES_ON_BOARD);
        for (let y = 0; y < modelConstants.GRID_SQUARES_PER_LINE; ++y) {
            for (let x = 0; x < modelConstants.GRID_SQUARES_PER_LINE; ++x) {
                expect(service.scrabbleGrid.elements[y][x].tile).toBeNull();
            }
        }
    });

    it('removeTileFromGrid should set to null one specific tile in scrabbleGrid', () => {
        service.initializeGrid();
        service.addWordToGrid(specConstants.TILES_ON_BOARD, classesConstants.MIDDLE_SQUARE_POSITION, DirectionType.HORIZONTAL);
        for (let i = 0; i < specConstants.TILES_TO_ADD.length; ++i) {
            expect(
                service.scrabbleGrid.elements[classesConstants.MIDDLE_SQUARE_POSITION.y][classesConstants.MIDDLE_SQUARE_POSITION.x + i].tile,
            ).toEqual(specConstants.TILES_ON_BOARD[i]);
        }
        const firstTileToRemove: Tile[] = [specConstants.TILES_ON_BOARD[0]];
        service['removeTileFromGrid'](firstTileToRemove);
        expect(service.scrabbleGrid.elements[classesConstants.MIDDLE_SQUARE_POSITION.y][classesConstants.MIDDLE_SQUARE_POSITION.x].tile).toBeNull();
        for (let i = 1; i < specConstants.TILES_TO_ADD.length; ++i) {
            expect(
                service.scrabbleGrid.elements[classesConstants.MIDDLE_SQUARE_POSITION.y][classesConstants.MIDDLE_SQUARE_POSITION.x + i].tile,
            ).toEqual(specConstants.TILES_ON_BOARD[i]);
        }
    });

    it('removeTileFromGrid should not change scrabble grid if positions are outside of grid', () => {
        service.initializeGrid();
        service.addWordToGrid(specConstants.TILES_ON_BOARD, classesConstants.MIDDLE_SQUARE_POSITION, DirectionType.HORIZONTAL);
        for (let i = 0; i < specConstants.TILES_TO_ADD.length; ++i)
            expect(
                service.scrabbleGrid.elements[classesConstants.MIDDLE_SQUARE_POSITION.y][classesConstants.MIDDLE_SQUARE_POSITION.x + i].tile,
            ).toEqual(specConstants.TILES_ON_BOARD[i]);
        service['removeTileFromGrid'](specConstants.TILES_OUTSIDE_GRID);
        for (let i = 0; i < specConstants.TILES_TO_ADD.length; ++i)
            expect(
                service.scrabbleGrid.elements[classesConstants.MIDDLE_SQUARE_POSITION.y][classesConstants.MIDDLE_SQUARE_POSITION.x + i].tile,
            ).toEqual(specConstants.TILES_ON_BOARD[i]);
    });

    it('drawVerticalLine should call moveTo and lineTo with correct parameters', () => {
        const moveToSpy = spyOn(service.gridContext, 'moveTo');
        const lineToSpy = spyOn(service.gridContext, 'lineTo');
        service['drawVerticalLine'](specConstants.INITIAL_POSITION.x, specConstants.INITIAL_POSITION.y, classesConstants.MIDDLE_SQUARE_POSITION.y);
        expect(moveToSpy).toHaveBeenCalledWith(specConstants.INITIAL_POSITION.x, specConstants.INITIAL_POSITION.y);
        expect(lineToSpy).toHaveBeenCalledWith(specConstants.INITIAL_POSITION.x, classesConstants.MIDDLE_SQUARE_POSITION.y);
    });

    it('drawHorizontalLine should call moveTo and lineTo with correct parameters', () => {
        const moveToSpy = spyOn(service.gridContext, 'moveTo');
        const lineToSpy = spyOn(service.gridContext, 'lineTo');
        service['drawHorizontalLine'](specConstants.INITIAL_POSITION.y, specConstants.INITIAL_POSITION.x, classesConstants.MIDDLE_SQUARE_POSITION.x);
        expect(moveToSpy).toHaveBeenCalledWith(specConstants.INITIAL_POSITION.x, specConstants.INITIAL_POSITION.y);
        expect(lineToSpy).toHaveBeenCalledWith(classesConstants.MIDDLE_SQUARE_POSITION.x, specConstants.INITIAL_POSITION.y);
    });

    it('setColorAndMultiplierSquare should change color, letterMultiplier and wordMultiplier of square', () => {
        const square: Square = specConstants.INITIAL_SQUARE;
        expect(square.color).toEqual(ColorName.BEIGE);
        expect(square.letterMultiplier).toEqual(classesConstants.SQUARE_WITHOUT_MULTIPLIER);
        expect(square.wordMultiplier).toEqual(classesConstants.SQUARE_WITHOUT_MULTIPLIER);
        service['setColorAndMultiplierSquare'](
            square,
            ColorName.BLUE,
            modelConstants.GRID_WORDX2_MULTIPLIER,
            modelConstants.GRID_LETTERX2_MULTIPLIER,
        );
        expect(square.color).toEqual(ColorName.BLUE);
        expect(square.letterMultiplier).toEqual(modelConstants.GRID_LETTERX2_MULTIPLIER);
        expect(square.wordMultiplier).toEqual(modelConstants.GRID_WORDX2_MULTIPLIER);
    });

    it('isPositionInCanvas should return false for invalid position', () => {
        for (const invalidPosition of specConstants.INVALID_POSITIONS_CANVAS) {
            expect(service['isPositionInCanvas'](invalidPosition)).toEqual(false);
        }
    });

    it('isPositionInCanvas should return true for valid position', () => {
        for (const validPosition of specConstants.VALID_POSITIONS_CANVAS) {
            expect(service['isPositionInCanvas'](validPosition)).toEqual(true);
        }
    });

    it('isGridEmpty should return true if scrabble grid is empty', () => {
        service.initializeGrid();
        expect(service.isGridEmpty()).toEqual(true);
    });

    it('isGridEmpty should return false if scrabble grid contains one tile', () => {
        service.initializeGrid();
        service.scrabbleGrid.elements[classesConstants.MIDDLE_SQUARE_POSITION.y][classesConstants.MIDDLE_SQUARE_POSITION.x].tile =
            specConstants.TILE_ON_MIDDLE_SQUARE;
        expect(service.isGridEmpty()).toEqual(false);
    });

    it('isGridEmpty should return false if scrabble grid contains multiple tiles', () => {
        service.initializeGrid();
        for (let i = 0; i < specConstants.TILES_TO_ADD.length; ++i) {
            service.scrabbleGrid.elements[specConstants.POSITIONS[i].y][specConstants.POSITIONS[i].x].tile = specConstants.TILES_TO_ADD[i];
        }
        expect(service.isGridEmpty()).toEqual(false);
    });

    it('orientationNextPosition should return position + 1 if Grid.direction is AFTER', () => {
        for (let i = 0; i < specConstants.MAX_NUMBER_OF_POSITIONS; ++i) {
            expect(service['orientationNextPosition'](GridDirection.AFTER, i)).toEqual(i + 1);
        }
    });

    it('orientationNextPosition should return position - 1 if Grid.direction is BEFORE', () => {
        for (let i = 0; i < specConstants.MAX_NUMBER_OF_POSITIONS; ++i) {
            expect(service['orientationNextPosition'](GridDirection.BEFORE, i)).toEqual(i - 1);
        }
    });

    it('convertSquareNameToPosition should not convert if position given is invalid', () => {
        const invalidPositionInputs: string[] = ['a151', '15a', '15B', '9O', 'F-1', 'AA', 'cc', 'p4', 'P10', 'a16', 'b0'];
        for (const invalidPosition of invalidPositionInputs) {
            expect(service.convertSquareNameToPosition(invalidPosition)).toEqual(undefined);
        }
    });

    it('convertSquareNameToPosition should convert square name to position for valid inputs', () => {
        for (let i = 0; i < specConstants.POSITIONS.length; ++i) {
            expect(service.convertSquareNameToPosition(specConstants.NAMES[i].toLowerCase())).toEqual(specConstants.POSITIONS[i]);
        }
    });

    it('isEmptyGridSquare should return false if square contains tile', () => {
        service.initializeGrid();
        for (const tile of specConstants.TILES_OF_GRID) {
            service.scrabbleGrid.elements[tile.position.y][tile.position.x].tile = tile;
            expect(service.isEmptyGridSquare(tile.position)).toEqual(false);
        }
    });

    it('isEmptyGridSquare should return true if square does not contain tile', () => {
        service.initializeGrid();
        for (let y = 0; y < modelConstants.GRID_SQUARES_PER_LINE; ++y) {
            for (let x = 0; x < modelConstants.GRID_SQUARES_PER_LINE; ++x) {
                expect(service.isEmptyGridSquare(service.scrabbleGrid.elements[y][x].position)).toEqual(true);
            }
        }
    });

    it('addBorderToTiles should call drawHorizontalLine, drawVerticalLine and convertGridPositionToDrawPosition', () => {
        service.initializeGrid();
        const drawHorizontalLineSpy = spyOn<any>(service, 'drawHorizontalLine');
        const drawVerticalLineSpy = spyOn<any>(service, 'drawVerticalLine');
        const convertGridPositionToDrawPositionSpy = spyOn<any>(service, 'convertGridPositionToDrawPosition').and.callThrough();
        service.addBorderToTiles(specConstants.TILES_HUMAN_HORIZONTAL, ColorName.PURPLE);
        expect(drawVerticalLineSpy).toHaveBeenCalledTimes(specConstants.DRAW_LINE_CALLS);
        expect(drawHorizontalLineSpy).toHaveBeenCalledTimes(specConstants.DRAW_LINE_CALLS);
        expect(convertGridPositionToDrawPositionSpy).toHaveBeenCalledTimes(specConstants.CONVERT_GRID_POSITIONS_CALLS);
    });

    it('addBorderToTiles should call beginPath and stroke from gridContext and set strokeStyle and lineWidth', () => {
        service.initializeGrid();
        const beginPathSpy = spyOn<any>(service.gridContext, 'beginPath');
        const strokeSpy = spyOn<any>(service.gridContext, 'stroke');
        service.addBorderToTiles(specConstants.TILES_HUMAN_HORIZONTAL, ColorName.PURPLE);
        expect(beginPathSpy).toHaveBeenCalledTimes(specConstants.TILES_HUMAN_HORIZONTAL.length);
        expect(strokeSpy).toHaveBeenCalledTimes(specConstants.TILES_HUMAN_HORIZONTAL.length);
        expect(service.gridContext.strokeStyle).toEqual(ColorName.PURPLE.toLowerCase());
        expect(service.gridContext.lineWidth).toEqual(classesConstants.TILE_BORDER_WIDTH);
    });

    it('drawArrow should use BOTTOM_ARROW_SRC for arrow.src if direction is horizontal', () => {
        service.drawArrow(specConstants.POSITIONS[0], DirectionType.HORIZONTAL);
        expect(
            service['arrow'].src.substring(
                specConstants.INDEX_WITHOUT_LOCAL_HOST,
                specConstants.INDEX_WITHOUT_LOCAL_HOST + serviceConstants.RIGHT_ARROW_SRC.length,
            ),
        ).toEqual(serviceConstants.RIGHT_ARROW_SRC);
    });

    it('drawArrow should use RIGHT_ARROW_SRC for arrow.src if direction is vertical', () => {
        service.drawArrow(specConstants.POSITIONS[0], DirectionType.VERTICAL);
        expect(
            service['arrow'].src.substring(
                specConstants.INDEX_WITHOUT_LOCAL_HOST,
                specConstants.INDEX_WITHOUT_LOCAL_HOST + serviceConstants.BOTTOM_ARROW_SRC.length,
            ),
        ).toEqual(serviceConstants.BOTTOM_ARROW_SRC);
    });

    it('drawArrow should call convertGridPositionToDrawPosition and drawImage', (done) => {
        const convertGridPositionSpy = spyOn<any>(service, 'convertGridPositionToDrawPosition').and.callThrough();
        const drawImageSpy = spyOn<any>(service.gridContext, 'drawImage').and.callThrough();
        service.drawArrow(specConstants.POSITIONS[0], DirectionType.VERTICAL);
        setTimeout(() => {
            expect(convertGridPositionSpy).toHaveBeenCalled();
            expect(drawImageSpy).toHaveBeenCalled();
            done();
        }, specConstants.WAIT_TIME_ONLOAD);
    });
});
