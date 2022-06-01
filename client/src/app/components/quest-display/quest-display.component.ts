import { Component } from '@angular/core';
import { Quest } from '@app/../../../common/model/quest';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import * as componentConstants from './quest-display.component.constants';

@Component({
    selector: 'app-quest-display',
    templateUrl: './quest-display.component.html',
    styleUrls: ['./quest-display.component.scss'],
})
export class QuestDisplayComponent {
    hiddenMessage: string;
    constructor(private readonly playerManagementService: PlayerManagementService) {
        this.hiddenMessage = componentConstants.HIDDEN_MESSAGE;
    }

    get privateQuestCurrentPlayer(): Quest {
        return this.playerManagementService.currentPlayer.sideQuest;
    }

    get privateQuestOpponentPlayer(): Quest {
        return this.playerManagementService.opponentPlayer.sideQuest;
    }

    get publicQuests(): Quest[] {
        return this.playerManagementService.lobbyInfo.sideQuests ? this.playerManagementService.lobbyInfo.sideQuests : [];
    }

    get currentPlayerName(): string {
        return this.playerManagementService.currentPlayer.name;
    }

    get opponentPlayerName(): string {
        return this.playerManagementService.opponentPlayer.name;
    }

    getQuestClass(isAccomplished: boolean): string {
        return isAccomplished ? componentConstants.CLASS_QUEST_ACCOMPLISHED : componentConstants.CLASS_QUEST_TO_BE_COMPLETED;
    }

    isQuestHidden(isAccomplished: boolean): string {
        return isAccomplished ? componentConstants.CLASS_SHOW_QUEST : componentConstants.CLASS_HIDE_QUEST;
    }
}
