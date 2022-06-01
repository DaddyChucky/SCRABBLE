import { Injectable } from '@angular/core';
import { Tile } from '@app/../../../common/model/tile';
import { TILE_SIZE_IN_EASEL } from '@app/classes/constants';
import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import { PlayerInformationService } from '@app/services/player-information/player-information.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { ARROW_LEFT, ARROW_RIGHT, DEFAULT_INDEX, MIN_LETTERS_FOR_ACTION, NEXT_INDEX } from './easel.service.constants';

@Injectable({
    providedIn: 'root',
})
export class EaselService {
    lettersToExchange: string;
    selectedTile: Tile | undefined;
    indexOfSelected: number;
    private playerTiles: Tile[];

    constructor(
        private readonly playerInformationService: PlayerInformationService,
        private readonly letterBagService: LetterBagService,
        private readonly socketService: SocketClientService,
    ) {
        this.lettersToExchange = '';
        this.indexOfSelected = 0;
    }

    get tiles(): Tile[] {
        this.playerTiles = this.playerInformationService.currentPlayer.tiles;
        this.setTilesSizeForEasel(TILE_SIZE_IN_EASEL);
        return this.playerTiles;
    }

    hasLessThanSevenLetters(): boolean {
        return this.letterBagService.getLetterBagSize() < MIN_LETTERS_FOR_ACTION;
    }

    exchangeLetters(): void {
        this.socketService.send('exchangeLetter', [this.lettersToExchange, this.playerInformationService.lobbyId]);
        this.socketService.send('switchTurn', this.playerInformationService.lobbyId);
    }

    manipulate(event: Event): void {
        if (!this.selectedTile) return;
        if (event instanceof KeyboardEvent) {
            if (event.key === ARROW_LEFT) this.switchRight();
            else if (event.key === ARROW_RIGHT) this.switchLeft();
        } else if (event instanceof WheelEvent)
            if (event.deltaY < 0) this.switchRight();
            else if (event.deltaY > 0) this.switchLeft();
    }

    selectEaselLetter(letter?: string): void {
        if (letter) {
            this.selectedTile = this.tiles
                .slice(this.indexOfSelected, this.tiles.length)
                .find((tile) => tile.name === letter.toUpperCase() && !tile.leftClicked);
            if (!this.selectedTile) this.selectedTile = this.tiles.find((tile) => tile.name === letter.toUpperCase());
            this.setTileSelector();
        } else this.selectedTile = this.tiles.find((tile) => tile.leftClicked);
        this.setIndex();
    }

    clearEaselSelection(): void {
        for (const easelTile of this.tiles) easelTile.leftClicked = false;
    }

    addLetterToExchange(tile: Tile): void {
        tile.rightClicked = true;
        this.lettersToExchange += tile.name.toLowerCase();
    }

    removeLetterToExchange(tile: Tile): void {
        tile.rightClicked = false;
        if (!this.lettersToExchange.includes(tile.name.toLowerCase())) return;

        const indexLetter: number = this.lettersToExchange.indexOf(tile.name.toLowerCase());
        this.lettersToExchange =
            this.lettersToExchange.substring(0, indexLetter) + this.lettersToExchange.substring(indexLetter + 1, this.lettersToExchange.length);
    }

    disableLeftClickSelection(): void {
        this.tiles.forEach((tile) => (tile.leftClicked = false));
    }

    emptyLettersToExchange(): void {
        this.lettersToExchange = '';
        this.disableRightClickSelection();
    }

    private disableRightClickSelection(): void {
        this.tiles.forEach((tile) => (tile.rightClicked = false));
    }

    private switch(secondIndex: number): void {
        this.tiles[this.indexOfSelected] = this.tiles[secondIndex];
        if (this.selectedTile) this.tiles[secondIndex] = this.selectedTile;
        this.playerInformationService.changeCurrentPlayerEasel(this.tiles);
    }

    private switchRight(): void {
        this.switch(this.indexOfSelected === DEFAULT_INDEX ? this.tiles.length - NEXT_INDEX : this.indexOfSelected - NEXT_INDEX);
    }

    private switchLeft(): void {
        this.switch(this.indexOfSelected === this.tiles.length - NEXT_INDEX ? DEFAULT_INDEX : this.indexOfSelected + NEXT_INDEX);
    }

    private setTileSelector(): void {
        this.clearEaselSelection();
        if (this.selectedTile) this.selectedTile.leftClicked = true;
        this.playerInformationService.changeCurrentPlayerEasel(this.tiles);
    }

    private setIndex(): void {
        if (this.selectedTile) this.indexOfSelected = this.tiles.indexOf(this.selectedTile);
    }

    private setTilesSizeForEasel(size: number): void {
        this.playerTiles.forEach((tile) => {
            tile.height = size;
            tile.width = size;
        });
    }
}
