import { Component } from '@angular/core';
import { Player } from '@app/../../../common/model/player';
import { Tile } from '@app/../../../common/model/tile';
import { EndGameService } from '@app/services/end-game/end-game.service';
import * as componentConstants from './end-game-dialog.component.constants';

@Component({
    selector: 'app-end-game-dialog',
    templateUrl: './end-game-dialog.component.html',
    styleUrls: ['./end-game-dialog.component.scss'],
})
export class EndGameDialogComponent {
    constructor(private readonly endGameService: EndGameService) {}

    get currentPlayer(): Player {
        return this.endGameService.currentPlayer;
    }

    get opponentPlayer(): Player {
        return this.endGameService.opponentPlayer;
    }

    get isWinner(): boolean {
        return this.currentPlayer.score >= this.opponentPlayer.score;
    }

    get isTie(): boolean {
        return this.currentPlayer.score === this.opponentPlayer.score;
    }

    get endGameMessage(): string {
        return this.isTie ? componentConstants.TIE_MESSAGE : this.isWinner ? componentConstants.WINNER_MESSAGE : componentConstants.LOSER_MESSAGE;
    }

    getRemainingLetters(tiles: Tile[]): string[] {
        const remainingLetters: string[] = [];
        tiles.forEach((tile) => remainingLetters.push(tile.name));
        return remainingLetters;
    }

    isWinnerCSSClass(): string {
        return this.isWinner ? componentConstants.WINNER_CLASS : componentConstants.LOSER_CLASS;
    }
}
