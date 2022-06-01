import { Component } from '@angular/core';
import { LetterBag } from '@app/../../../common/model/letter-bag/letter-bag';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import * as componentConstants from './left-sidebar.component.spec.constants';

@Component({
    selector: 'app-left-sidebar',
    templateUrl: './left-sidebar.component.html',
    styleUrls: ['./left-sidebar.component.scss'],
})
export class LeftSidebarComponent {
    constructor(private readonly letterBagService: LetterBagService, private readonly playerManagementService: PlayerManagementService) {}

    get letterBag(): LetterBag {
        return this.letterBagService.letterBag;
    }

    get letterBagSize(): number {
        return this.letterBagService.getLetterBagSize();
    }

    get gameMode(): string {
        return this.playerManagementService.lobbyInfo.lobbyType === LobbyType.CLASSIC
            ? componentConstants.CLASSIC_GAME_MODE
            : componentConstants.LOG2290_GAME_MODE;
    }
}
