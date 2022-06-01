import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Tile } from '@app/../../../common/model/tile';
import { EaselService } from '@app/services/easel/easel.service';
import { PlayerInformationService } from '@app/services/player-information/player-information.service';

@Component({
    selector: 'app-easel',
    templateUrl: './easel.component.html',
    styleUrls: ['./easel.component.scss'],
})
export class EaselComponent {
    @ViewChild('easel', { static: false }) private easel!: ElementRef<HTMLDivElement>;

    constructor(private readonly easelService: EaselService, private readonly playerInfo: PlayerInformationService) {}

    @HostListener('window:click', ['$event.target'])
    onOutsideEaselClick(targetElement: HTMLElement): void {
        if (!this.easel.nativeElement.contains(targetElement)) {
            this.removeAllLettersToExchange();
            this.easelService.disableLeftClickSelection();
        }
    }

    get tiles(): Tile[] {
        return this.easelService.tiles;
    }

    get isPlayerTurn(): boolean {
        return this.playerInfo.currentPlayer.isTurn;
    }

    get lessThanSevenLetters(): boolean {
        return this.easelService.hasLessThanSevenLetters();
    }

    get hasRightClickedTile(): boolean {
        return this.tiles.find((tile) => tile.rightClicked) !== undefined;
    }

    get displayLettersToExchange(): string {
        return this.easelService.lettersToExchange.split('').join(' - ').toUpperCase();
    }

    onTileLeftClick(tile: Tile): void {
        this.removeAllLettersToExchange();
        this.easelService.disableLeftClickSelection();
        tile.leftClicked = true;
    }

    exchangeSelectedLetters(): void {
        this.easelService.exchangeLetters();
        this.removeAllLettersToExchange();
    }

    removeAllLettersToExchange(): void {
        this.easelService.emptyLettersToExchange();
    }

    onTileRightClick(mouseEvent: MouseEvent, tile: Tile): void {
        this.easelService.disableLeftClickSelection();
        mouseEvent.preventDefault();

        if (tile.rightClicked) this.easelService.removeLetterToExchange(tile);
        else this.easelService.addLetterToExchange(tile);
    }
}
