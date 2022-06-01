import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Player } from '@app/../../../common/model/player';
import { EndGameDialogComponent } from '@app/components/end-game-dialog/end-game-dialog.component';
import { GiveUpPopupComponent } from '@app/components/give-up-popup/give-up-popup.component';
import { EndGameService } from '@app/services/end-game/end-game.service';
import { GameManagerService } from '@app/services/game-manager/game-manager.service';
import { PlaceLettersService } from '@app/services/place-letters/place-letters.service';

@Component({
    selector: 'app-buttons-area',
    templateUrl: './buttons-area.component.html',
    styleUrls: ['./buttons-area.component.scss'],
})
export class ButtonsAreaComponent {
    constructor(
        public matDialog: MatDialog,
        private readonly gameManager: GameManagerService,
        private readonly placeLettersService: PlaceLettersService,
        private readonly endGameService: EndGameService,
    ) {}

    get isEndGame(): boolean {
        return this.endGameService.isEndGame;
    }

    get isPlayerTurn(): boolean {
        const playerList: Player[] | undefined = this.gameManager.multiplayerLobby.playerList;
        return playerList ? this.gameManager.isCurrentPlayer(this.gameManager.multiplayerLobby.playerList) : true;
    }

    passTurn(): void {
        this.placeLettersService.cancelPlaceCommand();
        this.gameManager.passTurn();
    }

    popGiveUp(): void {
        this.matDialog.open(GiveUpPopupComponent);
    }

    sendPlaceCommand(): void {
        if (this.placeLettersService.tilesAddedToGrid.length === 0) return;
        this.placeLettersService.confirmPlaceCommand();
    }

    openEndGameDialog(): void {
        this.matDialog.open(EndGameDialogComponent, {
            disableClose: true,
        });
    }
}
