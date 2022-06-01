import { Component } from '@angular/core';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';

@Component({
    selector: 'app-right-sidebar',
    templateUrl: './right-sidebar.component.html',
    styleUrls: ['./right-sidebar.component.scss'],
})
export class RightSidebarComponent {
    constructor(private readonly playerManagementService: PlayerManagementService) {}

    get isLOG2990Mode() {
        return this.playerManagementService.lobbyInfo.lobbyType === LobbyType.LOG2990;
    }
}
