import { Component, OnInit } from '@angular/core';
import { MultiplayerLobby } from '@app/../../../common/model/lobby';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { Player } from '@app/../../../common/model/player';
import { DataPassingService } from '@app/services/data-passing/data-passing.service';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { UsernameValidationService } from '@app/services/username-validation/username-validation.service';
import * as componentConstants from './join-multiplayer-page.component.constants';

@Component({
    selector: 'app-join-multiplayer-page',
    templateUrl: './join-multiplayer-page.component.html',
    styleUrls: ['./join-multiplayer-page.component.scss'],
})
export class JoinMultiplayerComponent implements OnInit {
    isClassic: boolean;
    displayedColumns: string[];
    lobbyJoined: boolean;
    private player2: Player;
    private lobbyType: LobbyType;

    constructor(
        private readonly playerManagement: PlayerManagementService,
        private readonly dataPassingService: DataPassingService,
        private readonly socketClient: SocketClientService,
        private readonly usernameService: UsernameValidationService,
    ) {
        this.displayedColumns = componentConstants.DEFAULT_COLUMN_NAMES;
    }

    ngOnInit(): void {
        this.isClassic = this.dataPassingService.isClassic;
        this.player2 = {} as Player;
        this.player2.name = this.dataPassingService.username;
        this.player2.playerId = this.socketClient.socket.id;
        this.player2.host = false;
        this.playerManagement.initializePlayerData(this.player2);
        this.lobbyType = this.dataPassingService.isClassic ? LobbyType.CLASSIC : LobbyType.LOG2990;
    }

    get isLobbyExist(): boolean {
        return this.playerManagement.lobbyInfo && this.playerManagement.lobbyInfo.lobbyId !== undefined;
    }

    joinLobby(lobbyId: string): void {
        this.lobbyJoined = true;
        this.usernameService.isEjectedFromLobby = false;
        this.usernameService.isSameUsername = false;
        this.playerManagement.joinLobby(lobbyId);
    }

    joinRandomLobby(): void {
        if (this.liveLobbies.length > 0) this.joinLobby(this.liveLobbies[Math.floor(Math.random() * this.liveLobbies.length)].lobbyId);
        this.lobbyJoined = true;
    }

    cancelJoin(): void {
        this.lobbyJoined = false;
        this.playerManagement.cancelJoin();
    }

    get liveLobbies(): MultiplayerLobby[] {
        if (!this.playerManagement.optionLobbies || !this.playerManagement.optionLobbies.length) return [];
        const availableLobbies = [] as MultiplayerLobby[];
        this.playerManagement.optionLobbies.forEach((lobby: MultiplayerLobby) => {
            if (lobby.lobbyType === this.lobbyType) availableLobbies.push(lobby);
        });
        return availableLobbies;
    }

    get isUsernameValid(): boolean {
        return this.usernameService.isValidUsername(this.player2Username);
    }

    update(): boolean {
        this.lobbyJoined = false;
        this.usernameService.isSameUsername = false;
        return this.isUsernameValid;
    }

    get isSameUsername(): boolean {
        return this.usernameService.isSameUsername;
    }

    get isEjectedFromLobby(): boolean {
        return this.usernameService.isEjectedFromLobby;
    }

    get player2Username(): string {
        return this.player2.name;
    }

    set player2Username(name: string) {
        this.player2.name = name;
    }
}
