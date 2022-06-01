import { Component, OnInit } from '@angular/core';
import { Dictionary } from '@app/../../../common/model/dictionary';
import { MultiplayerLobby } from '@app/../../../common/model/lobby';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { Player } from '@app/../../../common/model/player';
import { DataPassingService } from '@app/services/data-passing/data-passing.service';
import { DictionariesManagerService } from '@app/services/dictionaries-manager/dictionaries-manager.service';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { BehaviorSubject } from 'rxjs';
import * as componentConstants from './multiplayer-page.component.constants';

@Component({
    selector: 'app-multiplayer-page',
    templateUrl: './multiplayer-page.component.html',
    styleUrls: ['./multiplayer-page.component.scss'],
})
export class MultiplayerComponent implements OnInit {
    currentLobby: MultiplayerLobby;
    isChoiceDictionary: boolean = false;
    private gameHost: Player;
    private dict: Dictionary;

    constructor(
        private readonly playerManagement: PlayerManagementService,
        private readonly data: DataPassingService,
        private readonly socketClient: SocketClientService,
        private readonly dictManager: DictionariesManagerService,
    ) {}

    get subjectDictionaries(): BehaviorSubject<Dictionary[]> {
        return this.dictManager.dictionaries;
    }

    get lobbyInfo(): MultiplayerLobby {
        return this.playerManagement.lobbyInfo ? this.playerManagement.lobbyInfo : this.currentLobby;
    }

    get hostInfo(): Player {
        return this.gameHost;
    }

    get isSolo(): boolean {
        return this.data.isSolo;
    }

    get isClassic(): boolean {
        return this.data.isClassic;
    }

    ngOnInit(): void {
        this.gameHost = {} as Player;
        this.currentLobby = {} as MultiplayerLobby;
        this.currentLobby.playerList = [];
        this.currentLobby.lobbyType = this.data.isClassic ? LobbyType.CLASSIC : LobbyType.LOG2990;
        this.currentLobby.dictionary = this.data.dict;
        this.gameHost.name = this.data.username;
        this.gameHost.playerId = this.socketClient.socket.id;
        this.gameHost.host = true;
        this.playerManagement.initializePlayerData(this.gameHost);
        this.playerManagement.createLobby(this.currentLobby.lobbyType);
    }

    cancelGame(): void {
        this.playerManagement.cancelGame();
    }

    rejectPlayer(): void {
        this.socketClient.send('rejectPlayer2', this.playerManagement.lobbyInfo.lobbyId);
    }

    redirectPlayer(): void {
        this.dictManager.getDictionary(this.currentLobby.dictionary).subscribe((dict) => {
            this.dict = dict;
        });
        setTimeout(() => {
            if (!this.dict) {
                this.dictManager.loadDictionaryData();
                this.isChoiceDictionary = true;
            } else this.playerManagement.redirectGame();
        }, componentConstants.WAITING_TIME);
    }

    lobbyIsFull(): boolean {
        return this.lobbyInfo.playerList && this.lobbyInfo.playerList.length === componentConstants.MAX_LOBBY_PLAYERS;
    }

    convertSolo(): void {
        this.data.setMode(true);
    }
}
