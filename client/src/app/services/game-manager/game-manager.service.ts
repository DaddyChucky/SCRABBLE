import { Injectable } from '@angular/core';
import { ChatMessage } from '@app/../../../common/model/chat-message';
import { MultiplayerLobby } from '@app/../../../common/model/lobby';
import { Player } from '@app/../../../common/model/player';
import { TypeOfUser } from '@app/../../../common/model/type-of-user';
import { WordRequest } from '@app/../../../common/model/word-request';
import { WordValidation } from '@app/../../../common/model/word-validation';
import { DialogBoxService } from '@app/services/dialog-box/dialog-box.service';
import { MESSAGE_NOT_IN_DIC_ERROR } from '@app/services/dialog-box/dialog-box.service.constants';
import { MESSAGE_ERROR } from '@app/services/dialog-box/dialog-box.service.spec.constants';
import { EaselService } from '@app/services/easel/easel.service';
import { GridService } from '@app/services/grid/grid.service';
import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import { PlaceLettersService } from '@app/services/place-letters/place-letters.service';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { ViewService } from '@app/services/view/view.service';
import * as serviceConstants from './game-manager.service.constants';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    multiplayerLobby: MultiplayerLobby = {} as MultiplayerLobby;
    lobbyId: string;

    constructor(
        private readonly socketService: SocketClientService,
        private readonly timerService: ViewService,
        private readonly dialogService: DialogBoxService,
        private readonly gridService: GridService,
        private readonly playerManagement: PlayerManagementService,
        private readonly letterBagService: LetterBagService,
        private readonly placeLettersService: PlaceLettersService,
        private readonly easelService: EaselService,
    ) {}

    connect(): void {
        this.timerConfigureBaseSocketFeatures();
        this.dialogConfigureBaseSocketFeatures();
        this.informationConfigureBaseSocketFeatures();
        this.setUpGame();
    }

    timerConfigureBaseSocketFeatures(): void {
        this.socketService.on('timer', (time: number) => {
            if (time <= 0 && this.playerManagement.currentPlayer.host) this.socketService.send('passTurn', this.multiplayerLobby.lobbyId);

            this.timerService.setTimerValue(time);
        });
    }

    informationConfigureBaseSocketFeatures(): void {
        this.socketService.on(this.lobbyId, (lobby: MultiplayerLobby) => {
            if (this.placeLettersService.hasAddedTilesToGrid()) this.placeLettersService.cancelPlaceCommand();
            this.easelService.emptyLettersToExchange();
            this.multiplayerLobby = lobby;
            this.letterBagService.letterBag = lobby.letterBag;
            this.playerManagement.myLobby = lobby;
            this.playerManagement.updateCurrentPlayerInfo();
        });

        this.socketService.on('startPlayerTurn', () => {
            if (this.isCurrentPlayer(this.multiplayerLobby.playerList) || this.isSoloGame()) this.startPlayerTurn();
        });
    }

    dialogConfigureBaseSocketFeatures(): void {
        this.socketService.on('dialogBox', (message: ChatMessage) => {
            message.date = new Date(message.date);
            this.dialogService.determineUserType(message);
            this.dialogService.addMessageToDialogBox(message);
        });

        this.socketService.on('commandOfVirtualPlayer', (message: string) => {
            const messageChat: ChatMessage = {
                author: TypeOfUser.OPPONENT_PLAYER,
                text: message,
                date: new Date(),
                lobbyId: this.lobbyId,
                socketId: serviceConstants.VIRTUAL_PLAYER_ID,
            } as ChatMessage;
            this.dialogService.verificationTypeMessage(messageChat);
        });

        this.socketService.on('isInDict', (wordValidation: WordValidation) => {
            const wordRequest: WordRequest = {
                lobbyId: this.multiplayerLobby.lobbyId,
                socketId: this.socketService.socket.id,
                word: wordValidation.parsedInfo.lettersCommand,
                startPosition: wordValidation.parsedInfo.position,
                direction: wordValidation.parsedInfo.direction,
                tiles: wordValidation.tiles.newTilesToAdd,
            } as WordRequest;

            this.gridService.addTilesObservable(wordRequest);
            this.socketService.send('updateGridView', wordRequest);
            this.socketService.send('removeRefillLetters', wordRequest);
            const commandMessage: ChatMessage = this.dialogService.createValidCommandMessage(
                wordValidation.parsedInfo,
                this.playerManagement.currentPlayer,
            );
            this.socketService.send('dialogBoxMessage', commandMessage);
            this.socketService.send('switchTurn', this.multiplayerLobby.lobbyId);
        });

        this.socketService.on('isNotInDict', (wordValidation: WordValidation) => {
            const wordRequest: WordRequest = {
                lobbyId: this.multiplayerLobby.lobbyId,
                socketId: this.socketService.socket.id,
                word: wordValidation.parsedInfo.lettersCommand,
                startPosition: wordValidation.parsedInfo.position,
                direction: wordValidation.parsedInfo.direction,
                tiles: wordValidation.tiles.newTilesToAdd,
            } as WordRequest;
            this.gridService.addTilesObservable(wordRequest);
            this.socketService.send('removeLetters', wordRequest);
            setTimeout(() => {
                this.gridService.removeTilesObservable(wordRequest, wordValidation.tiles.newTilesToAdd);
                const errorMessageDictionary: ChatMessage = MESSAGE_ERROR;
                errorMessageDictionary.text = MESSAGE_NOT_IN_DIC_ERROR;
                this.dialogService.addMessageToDialogBox(errorMessageDictionary);
                this.socketService.send('giveBackLetters', wordRequest);
                this.socketService.send('switchTurn', this.multiplayerLobby.lobbyId);
            }, serviceConstants.WAIT_TIME_TO_REMOVE_TILES);
        });

        this.socketService.on('updateGridView', (wordRequest: WordRequest) => {
            if (wordRequest.socketId !== this.socketService.socket.id) this.gridService.addTilesObservable(wordRequest);
        });
    }

    startPlayerTurn(): void {
        this.sendStartTimer();
        this.dialogService.sendTurnMessage();
        if (this.isSoloGame() && !this.isCurrentPlayer(this.multiplayerLobby.playerList)) {
            this.socketService.send('startVirtualPlayerTurn', [this.multiplayerLobby, this.gridService.scrabbleGrid]);
        }
    }

    isCurrentPlayer(players: Player[]): boolean {
        const livePlayer: Player | undefined = players.find((player) => player.isTurn);
        return livePlayer ? livePlayer.playerId === this.socketService.socket.id : false;
    }

    passTurn(): void {
        if (this.socketService.socket.id === this.playerManagement.activePlayer?.playerId)
            this.dialogService.sendSkipCommand({
                author: this.isCurrentPlayer(this.multiplayerLobby.playerList) ? TypeOfUser.CURRENT_PLAYER : TypeOfUser.OPPONENT_PLAYER,
                text: serviceConstants.SKIP_COMMAND_MESSAGE,
                date: new Date(),
                lobbyId: this.lobbyId,
                socketId: this.socketService.socket.id,
            } as ChatMessage);
    }

    setUpGame(): void {
        const hostPlayer: Player | undefined = this.playerManagement.hostPlayer;
        if (this.lobbyId && hostPlayer?.playerId === this.socketService.socket.id) this.socketService.send('createGame', this.lobbyId);
    }

    private isSoloGame(): boolean {
        return this.multiplayerLobby.playerList.some((player) => player.playerId === serviceConstants.VIRTUAL_PLAYER_ID);
    }

    private sendStartTimer(): void {
        this.socketService.send('startTimer', this.multiplayerLobby);
    }
}
