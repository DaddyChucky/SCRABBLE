/* eslint-disable max-lines */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { ColorName } from '@app/../../../common/model/color-name';
import { DirectionType } from '@app/../../../common/model/direction-type';
import { ScrabbleGrid } from '@app/../../../common/model/scrabble-grid';
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';
import { WordRequest } from '@app/../../../common/model/word-request';
import { PlaceCommand } from '@app/classes/place-command';
import { DialogBoxService } from '@app/services/dialog-box/dialog-box.service';
import { GridService } from '@app/services/grid/grid.service';
import { PlayerInformationService } from '@app/services/player-information/player-information.service';
import { PlaceLettersService } from './place-letters.service';
import * as serviceConstants from './place-letters.service.constants';
import * as specConstants from './place-letters.service.spec.constants';

describe('PlaceLettersService', () => {
    let service: PlaceLettersService;
    let playerInfoServiceSpy: jasmine.SpyObj<PlayerInformationService>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let dialogBoxServiceSpy: jasmine.SpyObj<DialogBoxService>;

    beforeEach(() => {
        playerInfoServiceSpy = jasmine.createSpyObj<any>(
            'PlayerInformationService',
            ['addTileToCurrentPlayer', 'removeTileFromCurrentPlayer', 'isBlankTile'],
            {
                currentPlayer: specConstants.PLAYER,
                myLobby: specConstants.LOBBY,
                lobbyId: specConstants.LOBBY.lobbyId,
            },
        );
        gridServiceSpy = jasmine.createSpyObj<any>(
            'GridService',
            [
                'drawTilesAndScrabbleGrid',
                'drawArrow',
                'convertPositionToSquareName',
                'nextPosition',
                'isValidGridPosition',
                'isEmptyGridSquare',
                'addTilesObservable',
                'addBorderToTiles',
                'removeTilesObservable',
                'convertStringWordToTiles',
                'initializeGrid',
                'addWordToGrid',
            ],
            { squareLength: specConstants.SQUARE_LENGTH, scrabbleGrid: { elements: [] } as ScrabbleGrid },
        );
        dialogBoxServiceSpy = jasmine.createSpyObj<any>('DialogBoxService', ['verificationTypeMessage'], {});
        TestBed.configureTestingModule({
            providers: [
                { provide: PlayerInformationService, useValue: playerInfoServiceSpy },
                { provide: GridService, useValue: gridServiceSpy },
                { provide: DialogBoxService, useValue: dialogBoxServiceSpy },
            ],
        });
        service = TestBed.inject(PlaceLettersService);
        gridServiceSpy.initializeGrid();
        gridServiceSpy.addWordToGrid(specConstants.PLAYER_TILES_UNICORN, specConstants.NEW_POSITION, DirectionType.HORIZONTAL);
        service.placeCommand = specConstants.PLACE_COMMAND;
        playerInfoServiceSpy.currentPlayer.tiles = specConstants.INITIAL_PLAYER_TILES;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('isValidKeyPressed should return true if key is a tile name of current player', () => {
        playerInfoServiceSpy.isBlankTile.and.returnValue(false);
        playerInfoServiceSpy.currentPlayer.tiles = specConstants.INITIAL_PLAYER_TILES;
        for (const key of specConstants.VALID_KEYS) {
            expect(service.isValidKeyPressed(key)).toEqual(true);
        }
    });

    it('isValidKeyPressed should return true if key is a tile name of current player (with blank tiles)', () => {
        playerInfoServiceSpy.isBlankTile.and.returnValue(true);
        playerInfoServiceSpy.currentPlayer.tiles = specConstants.INITIAL_PLAYER_TILES;
        for (const key of specConstants.VALID_KEYS_BLANK) {
            expect(service.isValidKeyPressed(key)).toEqual(true);
        }
    });

    it('isValidKeyPressed should return false if key is a tile name of current player', () => {
        playerInfoServiceSpy.isBlankTile.and.callThrough();
        for (const key of specConstants.INVALID_KEYS) {
            expect(service.isValidKeyPressed(key)).toEqual(false);
        }
    });

    it('isValidKeyPressed should return false if player doesnt have any blank tiles', () => {
        playerInfoServiceSpy.isBlankTile.and.returnValue(true);
        playerInfoServiceSpy.currentPlayer.tiles = [];
        for (const key of specConstants.VALID_KEYS) {
            expect(service.isValidKeyPressed(key)).toEqual(false);
        }
    });

    it('getWordRequest should return a wordRequest with correct information', () => {
        spyOn<any>(service, 'newTilesToSend').and.returnValue(specConstants.TILES_PUMPKIN);
        service.placeCommand.direction = DirectionType.HORIZONTAL;
        expect(service['getWordRequest'](specConstants.WORD, specConstants.START_POSITION)).toEqual(specConstants.WORD_REQUEST);
    });

    it('removeAccent should remove all accent from word', () => {
        expect(service['removeAccent'](specConstants.WORD_WITH_ACCENT)).toEqual(specConstants.WORD_WITHOUT_ACCENT);
    });

    it('toggleDirection should change direction (horizontal to vertical) and call drawTilesAndScrabbleGrid and drawArrow', () => {
        service.placeCommand.direction = DirectionType.HORIZONTAL;
        service['toggleDirection']();
        expect(service.placeCommand.direction).toEqual(DirectionType.VERTICAL);
        expect(gridServiceSpy.drawArrow).toHaveBeenCalled();
        expect(gridServiceSpy.drawTilesAndScrabbleGrid).toHaveBeenCalled();
    });

    it('toggleDirection should change direction (vertical to horizontal) and call drawTilesAndScrabbleGrid and drawArrow', () => {
        service.placeCommand.direction = DirectionType.VERTICAL;
        service['toggleDirection']();
        expect(service.placeCommand.direction).toEqual(DirectionType.HORIZONTAL);
        expect(gridServiceSpy.drawArrow).toHaveBeenCalled();
        expect(gridServiceSpy.drawTilesAndScrabbleGrid).toHaveBeenCalled();
    });

    it('isValidPlayerTile should return true if player is in possession of letter', () => {
        playerInfoServiceSpy.currentPlayer.tiles = specConstants.INITIAL_PLAYER_TILES;
        for (const tileName of specConstants.VALID_TILE_NAMES) {
            expect(service['isValidPlayerTile'](tileName)).toEqual(true);
        }
    });

    it('isValidPlayerTile should return false if player is not in possession of letter', () => {
        playerInfoServiceSpy.currentPlayer.tiles = specConstants.PLAYER_TILES_UNICORN;
        for (const tileName of specConstants.INVALID_TILE_NAMES) {
            expect(service['isValidPlayerTile'](tileName)).toEqual(false);
        }
    });

    it('isStartPosition should return true if position is equal to startPosition', () => {
        service.placeCommand.startPosition = serviceConstants.DEFAULT_POSITION;
        expect(service['isStartPosition'](serviceConstants.DEFAULT_POSITION)).toEqual(true);
    });

    it('isStartPosition should return false if position is not equal to startPosition', () => {
        service.placeCommand.startPosition = serviceConstants.DEFAULT_POSITION;
        for (const position of specConstants.INVALID_START_POSITIONS) {
            expect(service['isStartPosition'](position)).toEqual(false);
        }
    });

    it('isStartPosition should return false if placeCommand.startPosition is not defined', () => {
        Object.defineProperty(service.placeCommand, 'startPosition', { value: {} as Vec2 });
        expect(service['isStartPosition'](serviceConstants.DEFAULT_POSITION)).toEqual(false);
    });

    it('hasAddedTilesToGrid should return true if tilesAddedToGrid is not empty', () => {
        service.tilesAddedToGrid = specConstants.INITIAL_PLAYER_TILES;
        expect(service.hasAddedTilesToGrid()).toEqual(true);
    });

    it('hasAddedTilesToGrid should return false if tilesAddedToGrid is empty', () => {
        service.tilesAddedToGrid = [];
        expect(service.hasAddedTilesToGrid()).toEqual(false);
    });

    it('hasAddedTilesToGrid should return false if tilesAddedToGrid is empty', () => {
        service.tilesAddedToGrid = [];
        expect(service.hasAddedTilesToGrid()).toEqual(false);
    });

    it('saveTileAdded should not add tile to tilesAddedToGrid if currentPlayer does not have tile', () => {
        playerInfoServiceSpy.isBlankTile.and.callThrough();
        playerInfoServiceSpy.currentPlayer.tiles = [];
        service.tilesAddedToGrid = [];
        for (const tileName of specConstants.ALL_TILE_NAMES) service['saveTileAdded'](tileName, specConstants.START_POSITION);
        expect(service.tilesAddedToGrid.length).toEqual(0);
    });

    it('saveTileAdded should add tile to tilesAddedToGrid if currentPlayer has tile', () => {
        playerInfoServiceSpy.isBlankTile.and.callThrough();
        playerInfoServiceSpy.currentPlayer.tiles = specConstants.INITIAL_PLAYER_TILES;
        service.tilesAddedToGrid = [];
        for (const tileName of specConstants.WORD_TO_ADD_NORMAL_TILES) service['saveTileAdded'](tileName, specConstants.START_POSITION);
        expect(service.tilesAddedToGrid.length).toEqual(specConstants.WORD_TO_ADD_NORMAL_TILES.length);
        for (let i = 0; i < specConstants.WORD_TO_ADD_NORMAL_TILES.length; ++i) {
            expect(service.tilesAddedToGrid[i].position).toEqual(specConstants.START_POSITION);
            expect(service.tilesAddedToGrid[i]).toEqual(specConstants.INITIAL_PLAYER_TILES[i]);
        }
    });

    it('createPlaceCommandTextMessage should return equivalent place command text (horizontal) and call convertPositionToSquareName', () => {
        gridServiceSpy.convertPositionToSquareName.and.stub().and.returnValue(specConstants.SQUARE_NAME_A1);
        service.placeCommand.direction = DirectionType.HORIZONTAL;
        service.placeCommand.startPosition = serviceConstants.DEFAULT_POSITION;
        service.placeCommand.letters = specConstants.ALL_LETTERS_TO_REMOVE;
        expect(service['createPlaceCommandTextMessage']()).toEqual(specConstants.PLACE_COMMAND_TEXT_HORIZONTAL);
        expect(gridServiceSpy.convertPositionToSquareName).toHaveBeenCalled();
    });

    it('createPlaceCommandTextMessage should return equivalent place command text (vertical) and call convertPositionToSquareName', () => {
        gridServiceSpy.convertPositionToSquareName.and.stub().and.returnValue(specConstants.SQUARE_NAME_A1);
        service.placeCommand.direction = DirectionType.VERTICAL;
        service.placeCommand.startPosition = serviceConstants.DEFAULT_POSITION;
        service.placeCommand.letters = specConstants.WORD_TO_ADD;
        expect(service['createPlaceCommandTextMessage']()).toEqual(specConstants.PLACE_COMMAND_TEXT_VERTICAL);
        expect(gridServiceSpy.convertPositionToSquareName).toHaveBeenCalled();
    });

    it('setNextValidGridPosition should only call nextPosition and isValidPosition if position is valid ', () => {
        const isValidPositionSpy = spyOn<any>(service, 'isValidPosition').and.callThrough();
        gridServiceSpy.nextPosition.and.stub().and.returnValue(specConstants.START_POSITION);
        service['setNextValidGridPosition']();
        expect(service.gridPosition).toEqual(specConstants.START_POSITION);
        expect(gridServiceSpy.nextPosition).toHaveBeenCalledTimes(1);
        expect(isValidPositionSpy).toHaveBeenCalled();
    });

    it('setNextValidGridPosition should only call nextPosition and isValidPosition if position is outside grid ', () => {
        const isValidPositionSpy = spyOn<any>(service, 'isValidPosition').and.callThrough();
        gridServiceSpy.isValidGridPosition.and.stub().and.returnValue(false);
        gridServiceSpy.nextPosition.and.stub().and.returnValue(specConstants.INVALID_GRID_POSITION);
        service['setNextValidGridPosition']();
        expect(service.gridPosition).toEqual(specConstants.INVALID_GRID_POSITION);
        expect(gridServiceSpy.nextPosition).toHaveBeenCalledTimes(1);
        expect(isValidPositionSpy).toHaveBeenCalled();
    });

    it('setNextValidGridPosition should only call nextPosition and isValidPosition if position ', () => {
        const isValidPositionSpy = spyOn<any>(service, 'isValidPosition').and.returnValues(false, true);
        gridServiceSpy.isValidGridPosition.and.stub().and.returnValue(true);
        gridServiceSpy.nextPosition.and.stub().and.returnValues(specConstants.START_POSITION, specConstants.NEXT_POSITION);
        service['setNextValidGridPosition']();
        expect(service.gridPosition).toEqual(specConstants.NEXT_POSITION);
        expect(gridServiceSpy.nextPosition).toHaveBeenCalledTimes(specConstants.NEXT_POSITION_CALLS);
        expect(isValidPositionSpy).toHaveBeenCalled();
    });

    it('isValidPosition should return false if isValidGridPosition is false', () => {
        gridServiceSpy.isValidGridPosition.and.stub().and.returnValue(false);
        gridServiceSpy.isEmptyGridSquare.and.stub().and.returnValue(true);
        expect(service['isValidPosition'](specConstants.INVALID_GRID_POSITION)).toEqual(false);
    });

    it('isValidPosition should return false if isEmptyGridSquare is false', () => {
        gridServiceSpy.isValidGridPosition.and.stub().and.returnValue(true);
        gridServiceSpy.isEmptyGridSquare.and.stub().and.returnValue(false);
        expect(service['isValidPosition'](specConstants.START_POSITION)).toEqual(false);
    });

    it('isValidPosition should return false if currentPlayer.isTurn is false', () => {
        gridServiceSpy.isValidGridPosition.and.stub().and.returnValue(true);
        gridServiceSpy.isEmptyGridSquare.and.stub().and.returnValue(true);
        playerInfoServiceSpy.currentPlayer.isTurn = false;
        expect(service['isValidPosition'](specConstants.START_POSITION)).toEqual(false);
    });

    it('isValidPosition should return true if currentPlayer.isTurn, isValidGridPosition and isEmptyGridSquare are true', () => {
        gridServiceSpy.isValidGridPosition.and.stub().and.returnValue(true);
        gridServiceSpy.isEmptyGridSquare.and.stub().and.returnValue(true);
        playerInfoServiceSpy.currentPlayer.isTurn = true;
        expect(service['isValidPosition'](specConstants.START_POSITION)).toEqual(true);
    });

    it('findGridPositionOfClick should call findGridAxis twice', () => {
        const findGridAxisSpy = spyOn<any>(service, 'findGridAxis').and.stub().and.returnValue(specConstants.START_POSITION.x);
        service.setGridPositionOfClick(specConstants.CLICK_POSITIONS[0]);
        expect(service.gridPosition).toEqual(specConstants.START_POSITION);
        expect(findGridAxisSpy).toHaveBeenCalledTimes(specConstants.FIND_GRID_AXIS_CALLS);
    });

    it('findGridPositionOfClick should convert click position to correspondent grid position', () => {
        for (let i = 0; i < specConstants.CLICK_POSITIONS.length; ++i) {
            service.setGridPositionOfClick(specConstants.CLICK_POSITIONS[i]);
            expect(service.gridPosition).toEqual(specConstants.GRID_POSITIONS_OF_CLICK[i]);
        }
    });

    it('createPlaceCommand should not change placeCommand and should not call drawTilesAndScrabbleGrid and drawArrow with invalid position', () => {
        service.placeCommand.startPosition = specConstants.START_POSITION;
        service['createPlaceCommand'](specConstants.INVALID_GRID_POSITION);
        expect(service.placeCommand.startPosition).toEqual(specConstants.START_POSITION);
        expect(gridServiceSpy.drawTilesAndScrabbleGrid).not.toHaveBeenCalled();
        expect(gridServiceSpy.drawArrow).not.toHaveBeenCalled();
    });

    it('createPlaceCommand should change placeCommand and should call drawTilesAndScrabbleGrid and drawArrow with valid position', () => {
        gridServiceSpy.isValidGridPosition.and.stub().and.returnValue(true);
        gridServiceSpy.isEmptyGridSquare.and.stub().and.returnValue(true);
        playerInfoServiceSpy.currentPlayer.isTurn = true;
        service.placeCommand = {} as PlaceCommand;
        service['createPlaceCommand'](specConstants.START_POSITION);
        expect(service.placeCommand).toEqual(specConstants.EXPECTED_PLACE_COMMAND);
        expect(gridServiceSpy.drawTilesAndScrabbleGrid).toHaveBeenCalled();
        expect(gridServiceSpy.drawArrow).toHaveBeenCalled();
    });

    it('addLetterToPlaceCommand should call correct methods, add tile to tilesAddedToGrid and letter to placeCommand.letters', () => {
        const saveTileAddedSpy = spyOn<any>(service, 'saveTileAdded');
        const newTilesToSendSpy = spyOn<any>(service, 'newTilesToSend').and.stub().and.returnValue(service.tilesAddedToGrid);
        const setNextValidGridPositionSpy = spyOn<any>(service, 'setNextValidGridPosition');
        service.placeCommand.letters = '';
        const wordRequest: WordRequest = service['getWordRequest'](specConstants.LETTER_A, specConstants.START_POSITION);
        service.addLetterToPlaceCommand(specConstants.LETTER_A, specConstants.START_POSITION);
        expect(service.placeCommand.letters).toEqual(specConstants.LETTER_A);
        expect(gridServiceSpy.addTilesObservable).toHaveBeenCalledWith(wordRequest);
        expect(gridServiceSpy.addBorderToTiles).toHaveBeenCalledWith(service.tilesAddedToGrid, ColorName.PURPLE);
        expect(saveTileAddedSpy).toHaveBeenCalled();
        expect(playerInfoServiceSpy.removeTileFromCurrentPlayer).toHaveBeenCalled();
        expect(setNextValidGridPositionSpy).toHaveBeenCalled();
        expect(newTilesToSendSpy).toHaveBeenCalled();
    });

    it('confirmPlaceCommand should call cancelPlaceCommand and verificationTypeMessage and set isValidStartPosition to false', () => {
        dialogBoxServiceSpy.verificationTypeMessage.and.stub();
        const cancelPlaceCommandSpy = spyOn(service, 'cancelPlaceCommand');
        service.placeCommand.letters = specConstants.ALL_LETTERS_TO_REMOVE;
        service.confirmPlaceCommand();
        expect(service.isValidStartPosition).toEqual(false);
        expect(cancelPlaceCommandSpy).toHaveBeenCalled();
        expect(dialogBoxServiceSpy.verificationTypeMessage).toHaveBeenCalled();
    });

    it('cancelPlaceCommand should call drawTilesAndScrabbleGrid, removeTilesObservable and resetPlaceCommand', () => {
        const newTilesToSendSpy = spyOn<any>(service, 'newTilesToSend').and.stub().and.returnValue([specConstants.TILE_X]);
        const resetPlaceCommandSpy = spyOn<any>(service, 'resetPlaceCommand').and.callThrough();
        const hasAddedTilesToGridSpy = spyOn(service, 'hasAddedTilesToGrid').and.returnValue(true);
        service.tilesAddedToGrid = [specConstants.TILE_X];
        service.cancelPlaceCommand();
        expect(resetPlaceCommandSpy).toHaveBeenCalled();
        expect(gridServiceSpy.drawTilesAndScrabbleGrid).toHaveBeenCalled();
        expect(gridServiceSpy.removeTilesObservable).toHaveBeenCalled();
        expect(service.placeCommand).toEqual({} as PlaceCommand);
        expect(service.tilesAddedToGrid.length).toEqual(0);
        expect(service.isValidStartPosition).toEqual(false);
        expect(hasAddedTilesToGridSpy).toHaveBeenCalled();
        expect(newTilesToSendSpy).toHaveBeenCalled();
    });

    it('resetPlaceCommand should add tilesAddedToGrid to tiles of current player', () => {
        playerInfoServiceSpy.currentPlayer.tiles = [];
        expect(playerInfoServiceSpy.currentPlayer.tiles).toEqual([]);
        service.tilesAddedToGrid = specConstants.PLAYER_TILES;
        service['resetPlaceCommand']();
        expect(playerInfoServiceSpy.currentPlayer.tiles).toEqual(specConstants.PLAYER_TILES);
        expect(service.tilesAddedToGrid).toEqual([]);
    });

    it('resetPlaceCommand should reset placeCommand, tilesAddedToGrid and isValidStartPosition', () => {
        playerInfoServiceSpy.currentPlayer.tiles = [];
        service.tilesAddedToGrid = specConstants.PLAYER_TILES;
        service['resetPlaceCommand']();
        expect(service.placeCommand).toEqual({} as PlaceCommand);
        expect(service.tilesAddedToGrid.length).toEqual(0);
        expect(service.isValidStartPosition).toEqual(false);
    });

    it('findGridAxis should convert click position to correspondent grid position', () => {
        for (let i = 0; i < specConstants.CLICK_POSITIONS.length; ++i) {
            expect(service['findGridAxis'](specConstants.CLICK_POSITIONS[i].x)).toEqual(specConstants.GRID_POSITIONS_OF_CLICK[i].x);
            expect(service['findGridAxis'](specConstants.CLICK_POSITIONS[i].y)).toEqual(specConstants.GRID_POSITIONS_OF_CLICK[i].y);
        }
    });

    it('giveBackLastTileAdded should remove last tile from tilesAddedToGrid and call addTileToCurrentPlayer', () => {
        service.tilesAddedToGrid = [new Tile({ x: 0, y: 0 } as Vec2, 'N', 1)];
        service.placeCommand.letters = specConstants.LAST_TILE[0].name;
        playerInfoServiceSpy.currentPlayer.tiles = [];
        service['giveBackLastTileAdded'](specConstants.LAST_TILE[0]);
        expect(service.tilesAddedToGrid.length).toEqual(0);
        expect(playerInfoServiceSpy.addTileToCurrentPlayer).toHaveBeenCalled();
        expect(service.placeCommand.letters).toEqual('');
    });

    it('cancelLastLetterPlacement should not call methods if letters or tilesAddedToGrid are empty', () => {
        const giveBackLastTileAddedSpy = spyOn<any>(service, 'giveBackLastTileAdded');
        service.gridPosition = serviceConstants.DEFAULT_POSITION;
        service.placeCommand.letters = '';
        service.cancelLastLetterPlacement();
        expect(gridServiceSpy.removeTilesObservable).not.toHaveBeenCalled();
        expect(gridServiceSpy.drawArrow).not.toHaveBeenCalled();
        expect(gridServiceSpy.addBorderToTiles).not.toHaveBeenCalled();
        expect(giveBackLastTileAddedSpy).not.toHaveBeenCalled();
    });

    it('cancelLastLetterPlacement should call methods if letters and tilesAddedToGrid are not empty', () => {
        const newTilesToSendSpy = spyOn<any>(service, 'newTilesToSend').and.stub().and.returnValue(specConstants.TILES_JAZZ);
        const giveBackLastTileAddedSpy = spyOn<any>(service, 'giveBackLastTileAdded');
        service.gridPosition = serviceConstants.DEFAULT_POSITION;
        gridServiceSpy.removeTilesObservable.and.stub();
        gridServiceSpy.drawArrow.and.stub();
        gridServiceSpy.addBorderToTiles.and.stub();
        service.tilesAddedToGrid = specConstants.TILES_JAZZ;
        service.placeCommand.letters = specConstants.WORD_JAZZ;
        service.cancelLastLetterPlacement();
        expect(gridServiceSpy.removeTilesObservable).toHaveBeenCalled();
        expect(gridServiceSpy.drawArrow).toHaveBeenCalled();
        expect(gridServiceSpy.addBorderToTiles).toHaveBeenCalled();
        expect(giveBackLastTileAddedSpy).toHaveBeenCalled();
        expect(newTilesToSendSpy).toHaveBeenCalled();
    });

    it('cancelLastLetterPlacement should change this.gridPosition if gridPosition is not start position', () => {
        const giveBackLastTileAddedSpy = spyOn<any>(service, 'giveBackLastTileAdded');
        const isStartPositionSpy = spyOn<any>(service, 'isStartPosition').and.stub().and.returnValue(false);
        const newTilesToSendSpy = spyOn<any>(service, 'newTilesToSend').and.stub().and.returnValue(specConstants.TILE_X);
        service.gridPosition = specConstants.NOT_START_POSITION;
        service.placeCommand.startPosition = specConstants.START_POSITION;
        service.placeCommand.letters = specConstants.TILE_Y.name;
        service.tilesAddedToGrid = [specConstants.TILE_Y];
        service.cancelLastLetterPlacement();
        expect(service.gridPosition).toEqual(specConstants.TILE_Y.position);
        expect(giveBackLastTileAddedSpy).toHaveBeenCalled();
        expect(newTilesToSendSpy).toHaveBeenCalled();
        expect(isStartPositionSpy).toHaveBeenCalled();
    });

    it('manageClickOnEmptyGridSquare should not call toggleDirection or createPlaceCommand if isValidPosition is false', () => {
        const toggleDirectionSpy = spyOn<any>(service, 'toggleDirection');
        const createPlaceCommandSpy = spyOn<any>(service, 'createPlaceCommand');
        spyOn<any>(service, 'isValidPosition').and.returnValue(false);
        service.manageClickOnEmptyGridSquare();
        expect(toggleDirectionSpy).not.toHaveBeenCalled();
        expect(createPlaceCommandSpy).not.toHaveBeenCalled();
    });

    it('manageClickOnEmptyGridSquare should call toggleDirection if isValidPosition and isStartPosition are true', () => {
        const toggleDirectionSpy = spyOn<any>(service, 'toggleDirection');
        const createPlaceCommandSpy = spyOn<any>(service, 'createPlaceCommand');
        spyOn<any>(service, 'isValidPosition').and.returnValue(true);
        spyOn<any>(service, 'isStartPosition').and.returnValue(true);
        service.manageClickOnEmptyGridSquare();
        expect(toggleDirectionSpy).toHaveBeenCalled();
        expect(createPlaceCommandSpy).not.toHaveBeenCalled();
    });

    it('manageClickOnEmptyGridSquare should call createPlaceCommand if isValidPosition is true and isStartPosition is false', () => {
        const toggleDirectionSpy = spyOn<any>(service, 'toggleDirection');
        const createPlaceCommandSpy = spyOn<any>(service, 'createPlaceCommand');
        spyOn<any>(service, 'isValidPosition').and.returnValue(true);
        spyOn<any>(service, 'isStartPosition').and.returnValue(false);
        service.manageClickOnEmptyGridSquare();
        expect(createPlaceCommandSpy).toHaveBeenCalled();
        expect(toggleDirectionSpy).not.toHaveBeenCalled();
    });

    it('newTilesToSend should return correct tiles if placeCommand is defined', () => {
        gridServiceSpy.convertStringWordToTiles.and.stub().and.returnValue(specConstants.TILES_PUMPKIN);
        service.placeCommand.letters = specConstants.WORD;
        service.tilesAddedToGrid = specConstants.TILES_PUMPKIN;
        expect(service['newTilesToSend']()).toEqual(specConstants.TILES_PUMPKIN);
        expect(gridServiceSpy.convertStringWordToTiles).toHaveBeenCalled();
    });

    it('checkIfOneLetterPlacement should not change direction if tilesAddedToGrid.length is not 1', () => {
        service.placeCommand.direction = DirectionType.HORIZONTAL;
        service.tilesAddedToGrid = specConstants.TILES_PUMPKIN;
        service['checkIfOneLetterPlacement']();
        expect(service.placeCommand.direction).toEqual(DirectionType.HORIZONTAL);
    });

    it('checkIfOneLetterPlacement should change direction if tilesAddedToGrid.length is 1', () => {
        spyOn<any>(service, 'doesSquareContainTile').and.returnValue(true);
        service.placeCommand.direction = DirectionType.HORIZONTAL;
        service.tilesAddedToGrid = [specConstants.ONE_TILE_TO_ADD];
        service['checkIfOneLetterPlacement']();
        expect(service.placeCommand.direction).toEqual(DirectionType.VERTICAL);
    });

    it('doesSquareContainTile should return false if isValidGridPosition is false', () => {
        gridServiceSpy.isValidGridPosition.and.stub().and.returnValue(false);
        expect(service['doesSquareContainTile'](specConstants.NEW_POSITION)).toBeFalsy();
    });
});
