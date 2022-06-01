import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Dictionary } from '@app/../../../common/model/dictionary';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';
import { AddVirtualPlayerDialogComponent } from '@app/components/add-virtual-player-dialog/add-virtual-player-dialog.component';
import { AdminDatabaseLinkService } from '@app/services/admin-db-link/admin-db-link.service';
import { DictionariesManagerService } from '@app/services/dictionaries-manager/dictionaries-manager.service';
import * as componentConstants from './admin-page.component.constants';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
    beginnerTableTitle = componentConstants.TITLE_BEGINNER_TABLE;
    expertTableTitle = componentConstants.TITLE_EXPERT_TABLE;

    constructor(
        public dialog: MatDialog,
        private readonly adminDatabaseLinkService: AdminDatabaseLinkService,
        private readonly dictionariesManager: DictionariesManagerService,
    ) {
        this.adminDatabaseLinkService.loadVirtualPlayerData();
        this.dictionariesManager.loadDictionaryData();
    }

    get expertPlayers(): VirtualPlayerInfo[] {
        return this.adminDatabaseLinkService.expertPlayers.getValue();
    }

    get beginnerPlayers(): VirtualPlayerInfo[] {
        return this.adminDatabaseLinkService.beginnerPlayers.getValue();
    }

    get dictionaries(): Dictionary[] {
        return this.dictionariesManager.dictionaries.getValue();
    }

    get isServerNotReady(): boolean {
        return this.adminDatabaseLinkService.isServerForPlayersNotReady();
    }

    openAddVirtualPlayerDialog(): void {
        const dialogAddVirtualPlayer = this.dialog.open(AddVirtualPlayerDialogComponent, { disableClose: true });
        dialogAddVirtualPlayer.afterClosed().subscribe(() => this.adminDatabaseLinkService.loadVirtualPlayerData());
    }

    resetScores(): void {
        this.adminDatabaseLinkService.resetScores().subscribe();
    }

    resetGameLogs(): void {
        this.adminDatabaseLinkService.deleteGameLogs().subscribe();
    }

    resetVirtualPlayer(): void {
        this.adminDatabaseLinkService.resetVirtualPlayers().subscribe(() => {
            this.adminDatabaseLinkService.loadVirtualPlayerData();
        });
    }

    resetDictionaries(): void {
        this.dictionariesManager.resetAllDictionaries().subscribe(() => {
            this.dictionariesManager.loadDictionaryData();
        });
    }
}
