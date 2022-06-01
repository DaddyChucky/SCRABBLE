import { Injectable } from '@angular/core';
import { MAX_TILES_PER_PLAYER } from '@app/../../../common/model/constants';
import { Player } from '@app/../../../common/model/player';
import { Tile } from '@app/../../../common/model/tile';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import * as serviceConstants from './player-information.service.constants';

@Injectable({
    providedIn: 'root',
})
export class PlayerInformationService {
    players: Player[];

    constructor(private readonly playerManagementService: PlayerManagementService) {
        this.players = this.playerManagementService.lobbyInfo.playerList;
    }

    get activePlayer(): Player | undefined {
        return this.playerManagementService.activePlayer;
    }

    get currentPlayer(): Player {
        return this.playerManagementService.currentPlayer;
    }

    get lobbyId(): string {
        return this.playerManagementService.myLobby.lobbyId;
    }

    getSortedPlayersByHighestScore(players: Player[]): Player[] {
        this.players = this.playerManagementService.lobbyInfo.playerList;
        return players.sort((player1, player2) => player2.score - player1.score);
    }

    addTileToCurrentPlayer(tile: Tile): void {
        if (this.currentPlayer.tiles.length < MAX_TILES_PER_PLAYER) this.currentPlayer.tiles.push(tile);
    }

    removeTileFromCurrentPlayer(tileName: string): void {
        const tileNameToFind: string = this.isBlankTile(tileName) ? serviceConstants.BLANK_TILE : tileName.toUpperCase();
        const tileIndex: number = this.currentPlayer.tiles.findIndex((tile) => tile.name === tileNameToFind);
        if (tileIndex !== serviceConstants.TILE_NOT_FOUND) this.currentPlayer.tiles.splice(tileIndex, 1);
    }

    isBlankTile(key: string): boolean {
        return key.match(serviceConstants.REGEX_LETTERS_UPPER_CASE) !== null && key.length === serviceConstants.TILE_NAME_LENGTH;
    }

    changeCurrentPlayerEasel(tiles: Tile[]): void {
        this.playerManagementService.updatePlayerEasel(tiles);
    }
}
