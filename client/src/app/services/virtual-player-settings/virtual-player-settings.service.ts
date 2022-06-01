import { Injectable } from '@angular/core';
import { VirtualPlayerDifficulty } from '@app../../../common/model/virtual-player-difficulty';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';
import { AdminDatabaseLinkService } from '@app/services/admin-db-link/admin-db-link.service';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerSettingService {
    private usernames: VirtualPlayerInfo[];
    private virtualPlayer: VirtualPlayerInfo;

    constructor(private readonly bdLink: AdminDatabaseLinkService, private readonly playerManagement: PlayerManagementService) {
        this.virtualPlayer = new VirtualPlayerInfo();
        this.bdLink.loadVirtualPlayerData();
    }

    createVirtualPlayer(): void {
        this.playerManagement.addVirtualPlayer(this.virtualPlayer);
    }

    get virtualPlayerRandomName(): string {
        if (!this.playerManagement.currentPlayer || !this.virtualPlayer) {
            return '';
        }
        this.usernames =
            this.virtualPlayer.difficulty === VirtualPlayerDifficulty.EXPERT
                ? this.bdLink.expertPlayers.getValue()
                : this.bdLink.beginnerPlayers.getValue();
        do {
            this.virtualPlayer.name = this.usernames[this.randomIndex()].name;
        } while (this.virtualPlayer.name === this.playerManagement.currentPlayer.name);
        return this.virtualPlayer.name;
    }

    get virtualPlayerDifficulty(): VirtualPlayerDifficulty {
        return this.virtualPlayer.difficulty;
    }

    set virtualPlayerDifficulty(difficulty: VirtualPlayerDifficulty) {
        this.virtualPlayer.difficulty = difficulty;
    }

    set virtualPlayerName(name: string) {
        this.virtualPlayer.name = name;
    }

    private randomIndex(): number {
        return Math.floor(Math.random() * this.usernames.length);
    }
}
