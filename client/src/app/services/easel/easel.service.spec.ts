/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { Tile } from '@app/../../../common/model/tile';
import { SocketClientServiceMock } from '@app/classes/socket-client-test-helper';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import { PlayerInformationService } from '@app/services/player-information/player-information.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Socket } from 'socket.io-client';
import { EaselService } from './easel.service';
import * as serviceConstants from './easel.service.constants';
import * as specConstants from './easel.service.spec.constants';

describe('EaselService', () => {
    let service: EaselService;
    let playerInformationServiceSpy: jasmine.SpyObj<PlayerInformationService>;
    let letterBagServiceSpy: jasmine.SpyObj<LetterBagService>;
    let socketServiceStub: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;

    beforeEach(() => {
        socketHelper = new SocketTestHelper();
        socketServiceStub = new SocketClientServiceMock();
        socketServiceStub.socket = socketHelper as unknown as Socket;
        socketServiceStub.socket.id = specConstants.PLAYER.playerId;
        playerInformationServiceSpy = jasmine.createSpyObj<any>('PlayerInformationService', ['changeCurrentPlayerEasel'], {
            currentPlayer: specConstants.PLAYER,
            myLobby: specConstants.LOBBY,
            lobbyId: specConstants.LOBBY_ID,
        });
        letterBagServiceSpy = jasmine.createSpyObj<any>('LetterBagService', ['getLetterBagSize'], {});
        TestBed.configureTestingModule({
            providers: [
                { provide: PlayerInformationService, useValue: playerInformationServiceSpy },
                { provide: LetterBagService, useValue: letterBagServiceSpy },
                { provide: SocketClientService, useValue: socketServiceStub },
            ],
        });
        service = TestBed.inject(EaselService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('tiles should be defined', () => {
        expect(service['tiles']).toBeDefined();
    });

    it('hasLessThanSevenLetters should call getLetterBagSize from letterBagService and return false for complete letterbag', () => {
        letterBagServiceSpy.getLetterBagSize.and.returnValue(specConstants.INITIAL_LETTER_BAG_SIZE);
        expect(service.hasLessThanSevenLetters()).toEqual(false);
        expect(letterBagServiceSpy.getLetterBagSize).toHaveBeenCalled();
    });

    it('hasLessThanSevenLetters should call getLetterBagSize from letterBagService and return false letterbag with 7 letters', () => {
        letterBagServiceSpy.getLetterBagSize.and.returnValue(serviceConstants.MIN_LETTERS_FOR_ACTION);
        expect(service.hasLessThanSevenLetters()).toEqual(false);
        expect(letterBagServiceSpy.getLetterBagSize).toHaveBeenCalled();
    });

    it('hasLessThanSevenLetters should call getLetterBagSize from letterBagService and return true with letterbag less than 7 letters', () => {
        letterBagServiceSpy.getLetterBagSize.and.returnValue(specConstants.LETTER_BAG_SIZE_LESS_THAN_SEVEN);
        expect(service.hasLessThanSevenLetters()).toEqual(true);
        expect(letterBagServiceSpy.getLetterBagSize).toHaveBeenCalled();
    });

    it("exchangeLetters should call send from socketService with 'exchangeLetter' and 'switchTurn'", () => {
        const sendSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(service['socketService'], 'send').and.callThrough();
        service.lettersToExchange = specConstants.LETTERS_TO_EXCHANGE_UNICORN;
        service.exchangeLetters();
        expect(sendSpy).toHaveBeenCalledTimes(specConstants.NUMBER_OF_CALLS_TO_SEND);
        expect(sendSpy).toHaveBeenCalledWith('exchangeLetter', [specConstants.LETTERS_TO_EXCHANGE_UNICORN, specConstants.LOBBY_ID]);
        expect(sendSpy).toHaveBeenCalledWith('switchTurn', specConstants.LOBBY_ID);
    });
    it('clearEaselSelection should set all the leftClicked attribute of the tiles to false', () => {
        for (const tile of service.tiles) {
            tile.leftClicked = true;
        }
        service['clearEaselSelection']();
        for (const tile of service.tiles) {
            expect(tile.leftClicked).toEqual(false);
        }
    });

    it('switch should swap two tiles, with the index given in parameter', () => {
        service.selectedTile = specConstants.SELECTED_TILE;
        service.indexOfSelected = specConstants.INDEX_OF_SELECTED_TILE;
        service.tiles[specConstants.INDEX_OF_SWAP] = specConstants.TILE_TO_SWAP;
        service['switch'](specConstants.INDEX_OF_SWAP);
        expect(service.tiles[specConstants.INDEX_OF_SELECTED_TILE]).toEqual(specConstants.TILE_TO_SWAP);
        expect(service.tiles[specConstants.INDEX_OF_SWAP]).toEqual(specConstants.SELECTED_TILE);
    });

    it('setIndex set the attribute indexOfSelected to the index of the selected tile', () => {
        for (let i = 0; i < specConstants.INDEX_OF_SELECTED_TILE; i++) {
            service.tiles[i] = specConstants.TILE_TO_SWAP;
        }
        service.tiles[specConstants.INDEX_OF_SELECTED_TILE] = specConstants.SELECTED_TILE;
        service.selectedTile = specConstants.SELECTED_TILE;
        service['setIndex']();
        expect(service.indexOfSelected).toEqual(specConstants.INDEX_OF_SELECTED_TILE);
    });

    it('setTileSelector should call clearEaselSelection', () => {
        spyOn<any>(service, 'clearEaselSelection');
        service['setTileSelector']();
        expect(service['clearEaselSelection']).toHaveBeenCalled();
    });

    it('setTileSelector should set the attribute leftClicked of the selected tile to true', () => {
        service.selectedTile = specConstants.SELECTED_TILE;
        service.selectedTile.leftClicked = false;
        service['setTileSelector']();
        expect(service.selectedTile.leftClicked).toEqual(true);
    });

    it('selectEaselLetter should find the next occurrence of the tile with the same name and set it to selectedTile', () => {
        specConstants.SELECTED_TILE.name = specConstants.LETTER_PRESSED.toUpperCase();
        service.tiles.length = specConstants.TILES.length;
        service.selectedTile = specConstants.SELECTED_TILE;
        service.indexOfSelected = specConstants.INDEX_OF_SWAP;
        service.tiles[specConstants.INDEX_OF_SWAP] = specConstants.SELECTED_TILE;
        for (let i = 1; i < specConstants.INDEX_OF_SELECTED_TILE; i++) {
            service.tiles[i] = specConstants.TILE_TO_SWAP;
        }
        service.tiles[specConstants.INDEX_OF_SELECTED_TILE] = specConstants.SELECTED_TILE;
        service.indexOfSelected = specConstants.INDEX_OF_SWAP;
        service['selectEaselLetter'](specConstants.LETTER_PRESSED);
        expect(service.selectedTile).toEqual(service.tiles[specConstants.INDEX_OF_SELECTED_TILE]);
    });

    it('selectEaselLetter should call setTileSelector if letter is given as parameter', () => {
        spyOn<any>(service, 'setTileSelector');
        service['selectEaselLetter'](specConstants.LETTER_PRESSED);
        expect(service['setTileSelector']).toHaveBeenCalled();
    });

    it('selectEaselLetter should call setIndex', () => {
        spyOn<any>(service, 'setIndex');
        service['selectEaselLetter']();
        expect(service['setIndex']).toHaveBeenCalled();
    });

    it('switchLeft should call switch', () => {
        spyOn<any>(service, 'switch');
        service['switchLeft']();
        expect(service['switch']).toHaveBeenCalled();
    });

    it('switchLeft should call switch with correct index', () => {
        const switchSpy: jasmine.Spy<any> = spyOn<any>(service, 'switch');
        service.tiles.length = specConstants.TILES.length;
        service.indexOfSelected = specConstants.TILES.length - serviceConstants.NEXT_INDEX;
        service['switchLeft']();
        expect(switchSpy).toHaveBeenCalledWith(serviceConstants.DEFAULT_INDEX);
    });

    it('switchRight should call switch', () => {
        spyOn<any>(service, 'switch');
        service['switchRight']();
        expect(service['switch']).toHaveBeenCalled();
    });

    it('switchRight should call switch even if indexSelected isnt equal to 0', () => {
        spyOn<any>(service, 'switch');
        service.indexOfSelected = serviceConstants.NEXT_INDEX;
        service['switchRight']();
        expect(service['switch']).toHaveBeenCalled();
    });

    it('manipulate should not call switchRight if there is no selectedTile', () => {
        spyOn<any>(service, 'switchRight');
        service.selectedTile = undefined;
        service['manipulate'](specConstants.EVENT_ARROW_LEFT);
        expect(service['switchRight']).not.toHaveBeenCalled();
    });
    it('manipulate should not call switchLeft if there is no selectedTile', () => {
        spyOn<any>(service, 'switchLeft');
        service.selectedTile = undefined;
        service['manipulate'](specConstants.EVENT_ARROW_RIGHT);
        expect(service['switchLeft']).not.toHaveBeenCalled();
    });
    it('manipulate should call switchRight if selectedTile is defined', () => {
        spyOn<any>(service, 'switchRight');
        service.selectedTile = specConstants.SELECTED_TILE;
        service['manipulate'](specConstants.EVENT_ARROW_LEFT);
        expect(service['switchRight']).toHaveBeenCalled();
    });
    it('manipulate should call switchLeft if selectedTile is defined', () => {
        spyOn<any>(service, 'switchLeft');
        service.selectedTile = specConstants.SELECTED_TILE;
        service['manipulate'](specConstants.EVENT_ARROW_RIGHT);
        expect(service['switchLeft']).toHaveBeenCalled();
    });
    it('manipulate should call switchRight if selectedTile is defined and WheelEvent', () => {
        spyOn<any>(service, 'switchRight');
        service.selectedTile = specConstants.SELECTED_TILE;
        service['manipulate'](specConstants.EVENT_WHEEL_LEFT);
        expect(service['switchRight']).toHaveBeenCalled();
    });
    it('manipulate should call switchLeft if selectedTile is defined and WheelEvent', () => {
        spyOn<any>(service, 'switchLeft');
        service.selectedTile = specConstants.SELECTED_TILE;
        service['manipulate'](specConstants.EVENT_WHEEL_RIGHT);
        expect(service['switchLeft']).toHaveBeenCalled();
    });
    it('disableRightClickSelection should change rightClicked to false for all tiles', () => {
        service.tiles.forEach((tile) => (tile.rightClicked = true));
        for (const tile of service.tiles) {
            expect(tile.rightClicked).toEqual(true);
        }
        service['disableRightClickSelection']();
        for (const tile of service.tiles) {
            expect(tile.rightClicked).toEqual(false);
        }
    });

    it('disableLeftClickSelection should change leftClicked to false for all tiles', () => {
        service.tiles.forEach((tile) => (tile.leftClicked = true));
        for (const tile of service.tiles) {
            expect(tile.leftClicked).toEqual(true);
        }
        service['disableLeftClickSelection']();
        for (const tile of service.tiles) {
            expect(tile.leftClicked).toEqual(false);
        }
    });

    it('addLetterToExchange should change rightClicked of tile to true and add change lettersToExchange to tileToAdd name if empty', () => {
        const tileToAdd: Tile = service.tiles[0];
        tileToAdd.rightClicked = false;
        service.lettersToExchange = '';
        service['addLetterToExchange'](tileToAdd);
        expect(tileToAdd.rightClicked).toEqual(true);
        expect(service.lettersToExchange).toEqual(tileToAdd.name.toLowerCase());
    });

    it('addLetterToExchange should change rightClicked of tile to true and add tile name to lettersToExchange', () => {
        const tileToAdd: Tile = service.tiles[0];
        tileToAdd.rightClicked = false;
        service.lettersToExchange = specConstants.LETTERS_TO_EXCHANGE;
        service['addLetterToExchange'](tileToAdd);
        expect(tileToAdd.rightClicked).toEqual(true);
        expect(service.lettersToExchange).toEqual(specConstants.LETTERS_TO_EXCHANGE + tileToAdd.name.toLowerCase());
    });

    it('removeLetterToExchange should not change lettersToExchange if tile.name is not included', () => {
        const tileToRemove: Tile = { position: specConstants.POSITION, name: 'X', weight: 1, rightClicked: true } as Tile;
        service.lettersToExchange = specConstants.LETTERS_TO_EXCHANGE;
        service['removeLetterToExchange'](tileToRemove);
        expect(tileToRemove.rightClicked).toEqual(false);
        expect(service.lettersToExchange).toEqual(specConstants.LETTERS_TO_EXCHANGE);
    });

    it('removeLetterToExchange should remove tile name from lettersToExchange', () => {
        const tileToRemove: Tile = specConstants.TILES[1];
        tileToRemove.rightClicked = true;
        service.lettersToExchange = specConstants.LETTERS_TO_EXCHANGE;
        service['removeLetterToExchange'](tileToRemove);
        expect(tileToRemove.rightClicked).toEqual(false);
        expect(service.lettersToExchange).toEqual(specConstants.LETTERS_AFTER_REMOVE);
    });

    it('removeLetterToExchange should remove tile name from lettersToExchange (empty string)', () => {
        const tileToRemove: Tile = specConstants.TILES[0];
        tileToRemove.rightClicked = true;
        service.lettersToExchange = specConstants.LETTER_TO_EXCHANGE;
        service['removeLetterToExchange'](tileToRemove);
        expect(tileToRemove.rightClicked).toEqual(false);
        expect(service.lettersToExchange).toEqual('');
    });

    it('removeLetterToExchange should remove tile name from lettersToExchange (letter in between)', () => {
        const tileToRemove: Tile = specConstants.TILES[specConstants.INDEX_E];
        tileToRemove.rightClicked = true;
        service.lettersToExchange = specConstants.LETTERS_TO_EXCHANGE;
        service['removeLetterToExchange'](tileToRemove);
        expect(tileToRemove.rightClicked).toEqual(false);
        expect(service.lettersToExchange).toEqual(specConstants.LETTERS_AFTER_REMOVE_IN_BETWEEN);
    });

    it('emptyLettersToExchange should empty lettersToExchange and call disableRightClickSelection', () => {
        const disableRightClickSelectionSpy: jasmine.Spy<any> = spyOn<any>(service, 'disableRightClickSelection');
        service.lettersToExchange = specConstants.LETTERS_TO_EXCHANGE;
        service.emptyLettersToExchange();
        expect(service.lettersToExchange).toEqual('');
        expect(disableRightClickSelectionSpy).toHaveBeenCalled();
    });
});
