import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MultiplayerLobby } from '@app/../../../common/model/lobby';
import { LobbyInfo } from '@app/../../../common/model/lobby-info';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { Player } from '@app/../../../common/model/player';
import { Tile } from '@app/../../../common/model/tile';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';
import { DataPassingService } from '@app/services/data-passing/data-passing.service';
import { EndGameService } from '@app/services/end-game/end-game.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Guid } from 'guid-typescript';

@Injectable({ providedIn: 'root' })
export class PlayerManagementService {
    myLobby: MultiplayerLobby;
    optionLobbies: MultiplayerLobby[];
    private myPlayer: Player;
    private myLobbyInfo: LobbyInfo;

    constructor(
        private readonly socketService: SocketClientService,
        private readonly router: Router,
        private readonly data: DataPassingService,
        private readonly endGameService: EndGameService,
    ) {
        this.myLobbyInfo = new LobbyInfo();
    }

    get socketId(): string {
        if (!this.socketService.socket.id) return '';
        return this.socketService.socket.id;
    }

    get lobbyInfo(): MultiplayerLobby {
        return this.myLobby;
    }

    get currentPlayer(): Player {
        return this.myPlayer;
    }

    get activePlayer(): Player | undefined {
        return this.myLobby.playerList.find((player) => player.isTurn);
    }

    get opponentPlayer(): Player {
        const opponentPlayer: Player | undefined = this.myLobby.playerList.find((player) => player.name !== this.currentPlayer.name);
        return opponentPlayer ? opponentPlayer : ({} as Player);
    }

    get hostPlayer(): Player | undefined {
        return this.myLobby.playerList.find((player) => player.host);
    }

    initializePlayerData(player: Player): void {
        this.myPlayer = player;
        this.myLobbyInfo.player = player;
        this.configureBaseSocketFeatures();
    }

    configureBaseSocketFeatures(): void {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.socketService.on('connect', () => {});
        this.socketService.on(this.myPlayer.playerId, (receivedLobby: MultiplayerLobby) => {
            this.myLobby = receivedLobby;
            if (this.myLobby.playerList) this.updateCurrentPlayerInfo();
        });

        this.socketService.on('lobbyExistence', (receivedLobby: MultiplayerLobby) => {
            if (!this.myLobby) {
                return;
            }

            this.socketService.on(this.lobbyInfo.lobbyId, () => {
                this.myLobby = receivedLobby;
                this.updateCurrentPlayerInfo();
            });
        });

        this.socketService.on('redirect', (lobbyId: string) => {
            this.myLobby.lobbyId = lobbyId;
            this.data.lobbyId = lobbyId;
            this.router.navigate(['game/' + lobbyId]);
        });

        this.socketService.on('availableLobbies', (receivedLobbies: MultiplayerLobby[]) => {
            this.optionLobbies = receivedLobbies;
        });

        this.socketService.on(this.myPlayer.playerId, (receivedLobbies: MultiplayerLobby[]) => {
            this.optionLobbies = receivedLobbies;
        });

        this.socketService.on('gameEnded', () => {
            this.endGameService.setEndGameInformations(this.currentPlayer, this.opponentPlayer);
        });
    }

    redirectGame(): void {
        if (this.lobbyInfo) {
            this.socketService.send('redirectPlayer', this.myLobby);
        }
    }

    cancelGame(): void {
        this.socketService.send('cancelGame', this.lobbyInfo.lobbyId);
        this.router.navigate(['parameters']);
    }

    cancelJoin(): void {
        this.socketService.send('rejectPlayer2', this.lobbyInfo.lobbyId);
        this.socketService.send('availableLobbies', this.myLobbyInfo);
    }

    addVirtualPlayer(virtualPlayer: VirtualPlayerInfo): void {
        this.myLobbyInfo.virtualPlayer = virtualPlayer;
        this.socketService.send('createVirtualPlayer', this.myLobbyInfo);
    }

    sendResignation(): void {
        this.socketService.send('resignation', this.myLobby.lobbyId);
    }

    getAvailableLobbies(): MultiplayerLobby[] {
        this.socketService.send('availableLobbies', this.myLobbyInfo);
        if (!this.optionLobbies) return [];
        return this.optionLobbies;
    }

    joinLobby(lobbyId: string): void {
        this.myLobbyInfo.lobbyId = lobbyId;
        this.socketService.send('joinLobby', this.myLobbyInfo);
    }

    createLobby(myLobbyType: LobbyType): void {
        this.myLobbyInfo.lobbyType = myLobbyType;
        this.myLobbyInfo.dictionary = this.data.dict;
        this.myLobbyInfo.timerValue = this.data.timer;
        this.myLobbyInfo.lobbyId = Guid.create().toString();
        this.socketService.send('createLobby', this.myLobbyInfo);
    }

    updateCurrentPlayerInfo(): void {
        const playerUpdated: Player | undefined = this.myLobby.playerList.find((player) => player.playerId === this.myPlayer.playerId);
        if (playerUpdated) this.myPlayer = playerUpdated;
    }

    updatePlayerEasel(tiles: Tile[]): void {
        this.socketService.send('updatePlayerEasel', [this.myLobbyInfo.lobbyId, this.myPlayer.playerId, tiles]);
    }
}
