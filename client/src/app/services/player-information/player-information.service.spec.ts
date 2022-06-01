import { TestBed } from '@angular/core/testing';
import { Player } from '@app/../../../common/model/player';
import { Tile } from '@app/../../../common/model/tile';
import { GridService } from '@app/services/grid/grid.service';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import { PlayerInformationService } from './player-information.service';
import * as specConstants from './player-information.service.spec.constants';

describe('PlayerInformationService', () => {
    let service: PlayerInformationService;
    let playerManagementServiceSpy: jasmine.SpyObj<PlayerManagementService>;
    let gridServiceStub: jasmine.SpyObj<GridService>;

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        playerManagementServiceSpy = jasmine.createSpyObj<any>('PlayerInformationService', ['updatePlayerEasel'], {
            currentPlayer: specConstants.PLAYER_WITH_HIGHEST_SCORE,
            activePlayer: specConstants.PLAYER_WITH_HIGHEST_SCORE,
            lobbyInfo: specConstants.LOBBY,
            myLobby: specConstants.LOBBY,
        });
        gridServiceStub = jasmine.createSpyObj(GridService, ['convertStringWordToTiles']);
        TestBed.configureTestingModule({
            providers: [
                { provide: PlayerManagementService, useValue: playerManagementServiceSpy },
                { provide: GridService, useValue: gridServiceStub },
            ],
        });
        service = TestBed.inject(PlayerInformationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getSortedPlayersByHighestScore should sort players by highest score (already sorted array)', () => {
        const playersSortedByScore = service.getSortedPlayersByHighestScore(specConstants.PLAYERS_IN_RIGHT_ORDER);
        expect(playersSortedByScore[specConstants.INDEX_HIGHEST_SCORE]).toEqual(specConstants.PLAYER_WITH_HIGHEST_SCORE);
        expect(playersSortedByScore[specConstants.INDEX_LOWEST_SCORE]).toBe(specConstants.PLAYER_WITH_LOWEST_SCORE);
    });

    it('getSortedPlayersByHighestScore should sort players by highest score (array to sort)', () => {
        const playersSortedByScore = service.getSortedPlayersByHighestScore(specConstants.PLAYERS_IN_WRONG_ORDER);
        expect(playersSortedByScore[specConstants.INDEX_HIGHEST_SCORE]).toEqual(specConstants.PLAYER_WITH_HIGHEST_SCORE);
        expect(playersSortedByScore[specConstants.INDEX_LOWEST_SCORE]).toBe(specConstants.PLAYER_WITH_LOWEST_SCORE);
    });

    it('activePlayer should return player that isTurn is true', () => {
        expect(service.activePlayer).toEqual(playerManagementServiceSpy.activePlayer);
    });

    it('activePlayer should return currentPlayer from playerManagementService', () => {
        expect(service.currentPlayer).toEqual(playerManagementServiceSpy.currentPlayer);
    });

    it('getActivePlayer should return the player with isTurn is true', () => {
        // eslint-disable-next-line dot-notation
        service['players'] = specConstants.PLAYERS_IN_RIGHT_ORDER;
        const playerReceived: Player | undefined = service.activePlayer;
        expect(playerReceived).toEqual(specConstants.PLAYER_WITH_HIGHEST_SCORE);
    });

    it('getter lobbyId should return lobbyId from myLobby of playerManagementService', () => {
        expect(service.lobbyId).toEqual(specConstants.LOBBY.lobbyId);
    });

    it('isBlankTile should return true if key is upperCase', () => {
        for (const letter of specConstants.BLANK_TILE_NAMES) {
            expect(service.isBlankTile(letter)).toEqual(true);
        }
    });

    it('isBlankTile should return false if key is lowercase', () => {
        for (const letter of specConstants.NORMAL_TILE_NAMES) {
            expect(service.isBlankTile(letter)).toEqual(false);
        }
    });

    it('isBlankTile should return false if key length is longer than one character', () => {
        for (const letter of specConstants.LONGER_TILE_NAMES) {
            expect(service.isBlankTile(letter)).toEqual(false);
        }
    });

    it('removeTileFromCurrentPlayer should not change tiles of currentPlayer if letter not present ', () => {
        service.currentPlayer.tiles = [];
        for (const letter of specConstants.INVALID_TILE_NAME_TO_REMOVE) service.removeTileFromCurrentPlayer(letter);
        expect(service.currentPlayer.tiles.length).toEqual(0);
        expect(service.currentPlayer.tiles).toEqual([]);
    });

    it('removeTileFromCurrentPlayer should remove one tile if letter is present', () => {
        service.currentPlayer.tiles = specConstants.PLAYER_TILES;
        service.removeTileFromCurrentPlayer(specConstants.ONE_LETTER_TO_REMOVE);
        expect(service.currentPlayer.tiles.length).toEqual(specConstants.INITIAL_PLAYER_TILES.length - 1);
        expect(service.currentPlayer.tiles).toEqual(specConstants.PLAYER_TILES_REMOVE_U);
    });

    it('removeTileFromCurrentPlayer should remove all tiles', () => {
        service.currentPlayer.tiles = specConstants.PLAYER_TILES_REMOVE_ALL;
        for (const letter of specConstants.ALL_LETTERS_TO_REMOVE) service.removeTileFromCurrentPlayer(letter);
        expect(service.currentPlayer.tiles.length).toEqual(0);
        expect(service.currentPlayer.tiles).toEqual([]);
    });

    it('addTileToCurrentPlayer should add all tiles if currentPlayer.tiles.length is always less than 7', () => {
        service.currentPlayer.tiles = [];
        for (const tile of specConstants.PLAYER_TILES) service.addTileToCurrentPlayer(tile);
        expect(service.currentPlayer.tiles.length).toEqual(specConstants.PLAYER_TILES.length);
        expect(service.currentPlayer.tiles).toEqual(specConstants.PLAYER_TILES);
    });

    it('addTileToCurrentPlayer should not add more tile if current player already has 7 tiles', () => {
        service.currentPlayer.tiles = specConstants.PLAYER_TILES;
        for (const tile of specConstants.PLAYER_TILES) service.addTileToCurrentPlayer(tile);
        expect(service.currentPlayer.tiles.length).toEqual(specConstants.PLAYER_TILES.length);
        expect(service.currentPlayer.tiles).toEqual(specConstants.PLAYER_TILES);
    });

    it('changeCurrentPlayerEasel should call this.playerManagementService.updatePlayerEasel with given tiles', () => {
        const emptyTiles = [] as Tile[];
        service.changeCurrentPlayerEasel(emptyTiles);
        expect(playerManagementServiceSpy.updatePlayerEasel).toHaveBeenCalled();
    });
});
