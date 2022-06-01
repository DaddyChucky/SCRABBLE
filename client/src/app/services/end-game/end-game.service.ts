import { Injectable } from '@angular/core';
import { Player } from '@app/../../../common/model/player';

@Injectable({
    providedIn: 'root',
})
export class EndGameService {
    isEndGame: boolean = false;
    currentPlayer: Player = {} as Player;
    opponentPlayer: Player = {} as Player;

    setEndGameInformations(currentPlayer: Player, opponentPlayer: Player): void {
        this.isEndGame = true;
        this.currentPlayer = currentPlayer;
        this.opponentPlayer = opponentPlayer;
    }
}
