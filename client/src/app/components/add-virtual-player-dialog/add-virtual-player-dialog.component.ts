import { Component, ViewChild } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { VirtualPlayerDifficulty } from '@app/../../../common/model/virtual-player-difficulty';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';
import { AdminDatabaseLinkService } from '@app/services/admin-db-link/admin-db-link.service';

@Component({
    selector: 'app-add-virtual-player-dialog',
    templateUrl: './add-virtual-player-dialog.component.html',
    styleUrls: ['./add-virtual-player-dialog.component.scss'],
})
export class AddVirtualPlayerDialogComponent {
    @ViewChild('playerDifficulty', { static: false }) private playerDifficulty!: MatButtonToggleGroup;
    newPlayerName: string;

    constructor(private readonly adminDatabaseLinkService: AdminDatabaseLinkService) {}

    get isValidSubmission(): boolean {
        return this.adminDatabaseLinkService.isValidPlayerName(this.newPlayerName);
    }

    addNewPlayer(): void {
        const difficulty: VirtualPlayerDifficulty =
            this.playerDifficulty.value === VirtualPlayerDifficulty.BEGINNER ? VirtualPlayerDifficulty.BEGINNER : VirtualPlayerDifficulty.EXPERT;
        this.adminDatabaseLinkService
            .postVirtualPlayer({ name: this.newPlayerName.trim(), difficulty, default: false } as VirtualPlayerInfo)
            .subscribe();
    }
}
