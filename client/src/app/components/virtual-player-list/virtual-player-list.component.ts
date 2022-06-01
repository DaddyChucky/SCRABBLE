import { Component, Input } from '@angular/core';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';
import { AdminDatabaseLinkService } from '@app/services/admin-db-link/admin-db-link.service';

@Component({
    selector: 'app-virtual-player-list',
    templateUrl: './virtual-player-list.component.html',
    styleUrls: ['./virtual-player-list.component.scss'],
})
export class VirtualPlayerListComponent {
    @Input() playerNamesList: VirtualPlayerInfo[];
    @Input() tableTile: string;
    columnNamesVirtualPlayer = ['name', 'actions'];
    activePlayerEdit: VirtualPlayerInfo = {} as VirtualPlayerInfo;
    virtualPlayerNames: string[] = [];

    constructor(private readonly adminDatabaseLinkService: AdminDatabaseLinkService) {}

    get updatedVirtualPlayerNames(): string[] {
        if (this.playerNamesList.length === this.virtualPlayerNames.length) return this.virtualPlayerNames;
        this.virtualPlayerNames = [];
        this.playerNamesList.forEach((player) => this.virtualPlayerNames.push(player.name));
        return this.virtualPlayerNames;
    }

    isDefaultPlayer(virtualPlayer: VirtualPlayerInfo): boolean {
        return virtualPlayer.default;
    }

    isValidNewName(indexOfPlayer: number): boolean {
        return this.adminDatabaseLinkService.isValidPlayerName(this.virtualPlayerNames[indexOfPlayer]);
    }

    canEditName(virtualPlayer: VirtualPlayerInfo): boolean {
        return virtualPlayer.name === this.activePlayerEdit.name;
    }

    activateEdit(virtualPlayer: VirtualPlayerInfo): void {
        this.activePlayerEdit = virtualPlayer;
    }

    deleteVirtualPlayer(virtualPlayer: VirtualPlayerInfo): void {
        this.adminDatabaseLinkService.deleteVirtualPlayer(virtualPlayer.name).subscribe(() => this.adminDatabaseLinkService.loadVirtualPlayerData());
    }

    editVirtualPlayer(indexOfPlayer: number): void {
        this.adminDatabaseLinkService
            .modifyVirtualPlayer(this.activePlayerEdit.name, {
                name: this.virtualPlayerNames[indexOfPlayer].trim(),
                difficulty: this.activePlayerEdit.difficulty,
                default: this.activePlayerEdit.default,
            } as VirtualPlayerInfo)
            .subscribe(() => {
                this.adminDatabaseLinkService.loadVirtualPlayerData();
                this.activePlayerEdit = {} as VirtualPlayerInfo;
            });
    }

    cancelEdit(indexOfPlayer: number): void {
        this.virtualPlayerNames[indexOfPlayer] = this.playerNamesList[indexOfPlayer].name;
        this.activePlayerEdit = {} as VirtualPlayerInfo;
    }
}
