import { Component } from '@angular/core';
import { MAX_TILES_PER_PLAYER } from '@app/../../../common/model/constants';
import { Player } from '@app/../../../common/model/player';
import { PlayerInformationService } from '@app/services/player-information/player-information.service';
import { CSS_CLASS_IS_NOT_TURN, CSS_CLASS_IS_TURN } from './information-area.component.spec.constants';

@Component({
    selector: 'app-information-area',
    templateUrl: './information-area.component.html',
    styleUrls: ['./information-area.component.scss'],
})
export class InformationAreaComponent {
    isGameFinished: boolean;
    private players: Player[];

    constructor(private readonly playerInformationService: PlayerInformationService) {
        this.isGameFinished = false;
        this.players = this.playerInformationService.players;
    }

    get playersOrderedByScore(): Player[] {
        this.players = this.playerInformationService.players;
        return this.playerInformationService.getSortedPlayersByHighestScore(this.players);
    }

    isCurrentPlayer(player: Player): boolean {
        return player === this.playerInformationService.currentPlayer;
    }

    getPlayerClass(player: Player): string {
        return player && player.isTurn ? CSS_CLASS_IS_TURN : CSS_CLASS_IS_NOT_TURN;
    }

    hasLessThan7Letters(player: Player): boolean {
        return player.tiles.length < MAX_TILES_PER_PLAYER;
    }
}
