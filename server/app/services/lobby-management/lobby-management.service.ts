import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import { SideQuestProviderService } from '@app/services/side-quest-provider/side-quest-provider.service';
import { TIMER_INITIAL_VALUE } from '@common/model/constants';
import { LetterBag } from '@common/model/letter-bag/letter-bag';
import { MultiplayerLobby } from '@common/model/lobby';
import { LobbyInfo } from '@common/model/lobby-info';
import { LobbyStatus } from '@common/model/lobby-status';
import { LobbyType } from '@common/model/lobby-type';
import { Player } from '@common/model/player';
import { Tile } from '@common/model/tile';
import { Service } from 'typedi';
import * as serviceConstants from './lobby-management.service.constants';

@Service()
export class LobbyManagementService {
    lobbyList: MultiplayerLobby[] = [];

    constructor(private readonly letterBagService: LetterBagService, private questProviderService: SideQuestProviderService) {}

    createLobby(player: Player, lobbyInfo: LobbyInfo): MultiplayerLobby {
        const myLobby = {} as MultiplayerLobby;
        const someLobby: MultiplayerLobby | undefined = this.availableLobbies().find((lobby) => lobby.lobbyId === lobbyInfo.lobbyId);
        if (this.isUniqueHostLobby(player.playerId) && someLobby) {
            return someLobby;
        }
        myLobby.dictionary = lobbyInfo.dictionary;
        myLobby.lobbyType = lobbyInfo.lobbyType;
        const playerList: Player[] = [];
        playerList.push(player);
        myLobby.playerList = playerList;
        myLobby.baseTimerValue = lobbyInfo.timerValue ? lobbyInfo.timerValue : TIMER_INITIAL_VALUE;
        myLobby.lobbyStatus = LobbyStatus.CREATED;
        myLobby.lobbyId = lobbyInfo.lobbyId;
        myLobby.letterBag = new LetterBag();
        this.lobbyList.push(myLobby);
        return myLobby;
    }

    setPlayerInfo(lobbyId: string, oldPlayerId: string, newPlayerId: string): void {
        const lobby: MultiplayerLobby | undefined = this.getLobby(lobbyId);
        if (lobby)
            lobby.playerList.forEach((player) => {
                if (player.playerId === oldPlayerId) player.playerId = newPlayerId;
            });
    }

    setPlayerEasel(lobbyId: string, playerID: string, tiles: Tile[]): void {
        const lobby: MultiplayerLobby | undefined = this.getLobby(lobbyId);
        if (!lobby) return;
        lobby.playerList.forEach((player) => {
            if (player.playerId === playerID && tiles) {
                player.tiles = tiles;
                player.tiles.forEach((tile) => {
                    tile.leftClicked = false;
                    tile.rightClicked = false;
                });
            }
        });
    }

    isUniqueHostLobby(playerId: string): boolean {
        const lobbyHost: MultiplayerLobby | undefined = this.lobbyList.find((lobby) => lobby.playerList[0].playerId === playerId);
        return lobbyHost !== undefined;
    }

    filterAliveLobbies(): MultiplayerLobby[] {
        return this.lobbyList.filter((lobby) => {
            if (lobby.playerList.length === 0) {
                lobby.lobbyStatus = LobbyStatus.DELETED;
            }
        });
    }

    joinLobby(player: Player, lobbyId: string): void {
        const chosenLobby: MultiplayerLobby | undefined = this.lobbyList.find((lobby) => lobby.lobbyId === lobbyId);
        if (!chosenLobby) return;
        else if (this.isSoloPlayerInList(chosenLobby.playerList)) {
            chosenLobby.playerList[1].name = player.name;
            chosenLobby.playerList[1].difficulty = player.difficulty;
        } else if (chosenLobby.playerList.length >= serviceConstants.NUMBERS_OF_PLAYERS) return;
        else {
            chosenLobby.playerList.push(player);
            chosenLobby.lobbyStatus = LobbyStatus.COMPLETED;
            this.initializePlayers(chosenLobby);
        }
    }

    getLobby(lobbyId: string): MultiplayerLobby | undefined {
        return this.lobbyList.find((lobby) => lobby.lobbyId === lobbyId);
    }

    getLobbyOfPlayer(playerId: string): MultiplayerLobby | undefined {
        return this.lobbyList.find((lobby) => this.isPlayerInLobby(lobby, playerId));
    }

    isPlayerInLobby(lobby: MultiplayerLobby, playerId: string): boolean {
        return lobby.playerList.find((playerInLobby) => playerInLobby.playerId === playerId) !== undefined;
    }

    rejectPlayer(lobbyId: string): MultiplayerLobby | undefined {
        const lobby: MultiplayerLobby | undefined = this.getLobby(lobbyId);
        if (!lobby) return undefined;
        const hostPlayer: Player | undefined = lobby.playerList.find((player) => player.host);
        if (!hostPlayer) return lobby;
        lobby.playerList = [hostPlayer];
        lobby.lobbyStatus = LobbyStatus.IN_PROGRESS;
        return lobby;
    }

    deleteLobby(lobbyId: string): void {
        const lobby: MultiplayerLobby | undefined = this.lobbyList.find((aLobby) => aLobby.lobbyId === lobbyId);
        if (lobby != null) {
            lobby.lobbyStatus = LobbyStatus.DELETED;
        }
    }

    availableLobbies(): MultiplayerLobby[] {
        return this.lobbyList.filter((lobby) => lobby.lobbyStatus !== LobbyStatus.DELETED && lobby.lobbyStatus !== LobbyStatus.COMPLETED);
    }

    exchangeLetter(lobby: MultiplayerLobby, player: Player, letters: string): string {
        const letterRemoved: string = this.letterBagService.removeLetters(player, letters);
        this.letterBagService.refillLetters(lobby.letterBag, player, letters);
        return letterRemoved;
    }

    private initializePlayers(lobby: MultiplayerLobby): void {
        for (const player of lobby.playerList) {
            player.tiles = [];
            this.letterBagService.refillLetters(lobby.letterBag, player);
            player.score = 0;
            player.isTurn = player.host;
            if (lobby.lobbyType === LobbyType.LOG2990) this.initializeQuests(player, lobby);
        }
        this.questProviderService.resetQuests();
        this.resetQuestProvider();
    }

    private initializeQuests(player: Player, lobby: MultiplayerLobby): void {
        player.sideQuest = this.questProviderService.assignPrivateQuest();
        lobby.sideQuests = this.questProviderService.assignPublicQuests();
    }

    private resetQuestProvider(): void {
        this.questProviderService = new SideQuestProviderService();
    }

    private isSoloPlayerInList(players: Player[]): boolean {
        return players.some((playerInList) => playerInList.playerId === serviceConstants.VIRTUAL_PLAYER_ID);
    }
}
