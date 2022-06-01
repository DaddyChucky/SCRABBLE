/* eslint-disable max-lines */
import { TIMER_END_VALUE, TIMER_INTERVAL_VALUE_ONE_SECOND } from '@app/classes/constants';
import { VirtualPlayer } from '@app/classes/virtual-player';
import { container } from '@app/inversify.config';
import { BoardAnalyzerService } from '@app/services/board-analyzer/board-analyzer.service';
import { CommandMessageCreatorService } from '@app/services/command-message-creator/command-message-creator.service';
import { EndGameManagementService } from '@app/services/end-game-management/end-game-management.service';
import { GamesLogsService } from '@app/services/games-logs/games-logs.service';
import { HintsProviderService } from '@app/services/hints-provider/hints-provider.service';
import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import { LobbyManagementService } from '@app/services/lobby-management/lobby-management.service';
import { PointCalculatorService } from '@app/services/point-calculator/point-calculator.service';
import { ScrabbleGridService } from '@app/services/scrabble-grid/scrabble-grid.service';
import { SideQuestProviderService } from '@app/services/side-quest-provider/side-quest-provider.service';
import { TurnManagerService } from '@app/services/turn-manager/turn-manager.service';
import { UsernameManagerService } from '@app/services/username-verification/username-manager.service';
import { VirtualPlayerService } from '@app/services/virtual-player/virtual-player.service';
import { PASS_COMMAND } from '@app/services/virtual-player/virtual-player.service.constants';
import { WordValidatorService } from '@app/services/word-validator/word-validator.service';
import Types from '@app/types';
import { ChatMessage } from '@common/model/chat-message';
import { MultiplayerLobby } from '@common/model/lobby';
import { LobbyInfo } from '@common/model/lobby-info';
import { LobbyType } from '@common/model/lobby-type';
import { ParsedInfo } from '@common/model/parsed-info';
import { Player } from '@common/model/player';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Tile } from '@common/model/tile';
import { TypeOfUser } from '@common/model/type-of-user';
import { WordRequest } from '@common/model/word-request';
import { WordValidation } from '@common/model/word-validation';
import * as http from 'http';
import { Callback } from 'mongodb';
import * as io from 'socket.io';
import { Service } from 'typedi';
import * as serviceConstants from './socket-management.service.constants';

@Service()
export class SocketManagementService {
    private sio: io.Server;
    private lobbyManager: LobbyManagementService;
    private turnManager: TurnManagerService;
    private timerInterval: Map<string, NodeJS.Timeout>;
    private timeSpentOnMove: Map<string, number>;
    private dateResignation: Map<string, Date>;
    private scrabbleGridService: ScrabbleGridService;
    private lobbyDict: Map<string, WordValidatorService>;

    private readonly gameLogsService: GamesLogsService;
    private readonly usernameService: UsernameManagerService;
    private readonly commandMessageCreatorService: CommandMessageCreatorService;

    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.lobbyManager = new LobbyManagementService(new LetterBagService(), new SideQuestProviderService());
        this.scrabbleGridService = new ScrabbleGridService();
        this.commandMessageCreatorService = new CommandMessageCreatorService();
        this.usernameService = new UsernameManagerService();
        this.dateResignation = new Map();
        this.timerInterval = new Map();
        this.timeSpentOnMove = new Map();
        this.lobbyDict = new Map();
        this.turnManager = new TurnManagerService(
            new LetterBagService(),
            new EndGameManagementService(new LetterBagService()),
            new PointCalculatorService(
                this.scrabbleGridService.scrabbleGrid,
                [],
                new WordValidatorService(serviceConstants.DEFAULT_DICT),
                this.scrabbleGridService,
            ),
        );
        this.gameLogsService = container.get<GamesLogsService>(Types.GamesLogsService);
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            socket.on('createLobby', (data: string) => {
                const infoLobby: LobbyInfo = JSON.parse(data);
                const lobby: MultiplayerLobby = this.lobbyManager.createLobby(infoLobby.player, infoLobby);
                socket.join(lobby.lobbyId);
                socket.emit(infoLobby.player.playerId, lobby);
                socket.emit('lobbyCreated', lobby);
            });

            socket.on('createVirtualPlayer', (data: string) => {
                const infoLobby: LobbyInfo = JSON.parse(data);
                const lobby: MultiplayerLobby | undefined = this.lobbyManager.getLobby(infoLobby.lobbyId);
                if (!(lobby && infoLobby.virtualPlayer)) return;
                const vp: VirtualPlayer = {
                    name: infoLobby.virtualPlayer.name,
                    playerId: serviceConstants.VIRTUAL_PLAYER_ID,
                    host: false,
                    difficulty: infoLobby.virtualPlayer.difficulty,
                } as VirtualPlayer;
                this.lobbyManager.joinLobby(vp, infoLobby.lobbyId);
                this.verifyTurn(lobby);
                this.sio.to(lobby.lobbyId).emit(lobby.lobbyId);
                socket.emit(infoLobby.player.playerId, lobby);
            });

            socket.on('joinLobby', (data: string) => {
                const infoLobby: LobbyInfo = JSON.parse(data);
                const lobby: MultiplayerLobby | undefined = this.lobbyManager.getLobby(infoLobby.lobbyId);
                if (lobby) {
                    if (this.usernameService.sameNamesLobby(infoLobby.player.name, lobby?.playerList[serviceConstants.INDEX_DATA_0].name)) {
                        socket.emit('sameUsername');
                        return;
                    }
                    this.lobbyManager.joinLobby(infoLobby.player, infoLobby.lobbyId);
                    socket.join(infoLobby.lobbyId);
                    this.sio.to(lobby.lobbyId).emit('lobbyExistence', lobby);
                    this.sio.to(lobby.lobbyId).emit(lobby.lobbyId);
                }
                socket.emit(infoLobby.player.playerId, lobby);
            });

            socket.on('cancelGame', (data: string) => {
                const lobbyId: string = JSON.parse(data);
                this.lobbyManager.deleteLobby(lobbyId);
                this.leaveRoom(socket, lobbyId);
            });

            socket.on('availableLobbies', (data: string) => {
                const infoLobby: LobbyInfo = JSON.parse(data);
                socket.emit(infoLobby.player.playerId, this.lobbyManager.availableLobbies());
            });

            socket.on('redirectPlayer', (data: string) => {
                const lobby: MultiplayerLobby = JSON.parse(data);
                if (!socket.rooms.has(lobby.lobbyId)) return;
                this.sio.to(lobby.lobbyId).emit('getLobbyInfo', lobby);
                this.sio.to(lobby.lobbyId).emit('redirect', lobby.lobbyId);
            });

            socket.on('resignation', (data: string) => {
                const lobby: MultiplayerLobby | undefined = this.lobbyManager.getLobby(JSON.parse(data));
                if (lobby && socket.rooms.has(lobby.lobbyId)) this.resignation(lobby, socket);
            });

            socket.on('rejectPlayer2', (data: string) => {
                const newLobby: MultiplayerLobby | undefined = this.lobbyManager.rejectPlayer(JSON.parse(data));
                if (!newLobby) return;
                this.sio.to(newLobby.lobbyId).emit('ejectedFromLobby');
                this.sio.to(newLobby.lobbyId).emit('lobbyExistence', newLobby);
                this.sio.to(newLobby.lobbyId).emit(newLobby.lobbyId);
                socket.emit(newLobby.playerList[0].playerId, newLobby);
            });

            socket.on('leaveRoom', (data: string) => {
                this.leaveRoom(socket, JSON.parse(data));
            });

            socket.on('createGame', (data: string) => {
                const lobby: MultiplayerLobby | undefined = this.lobbyManager.getLobby(JSON.parse(data));
                if (!lobby) return;

                this.turnManager.createGame(lobby.lobbyId);
                this.emitCurrentLobbyState(lobby);
                this.sio.to(lobby.lobbyId).emit('startPlayerTurn');
            });

            socket.on('startVirtualPlayerTurn', async (data: string) => {
                const lobby: MultiplayerLobby = JSON.parse(data)[0];
                const scrabbleGrid: ScrabbleGrid = JSON.parse(data)[1];
                const virtualPlayer: Player | undefined = lobby.playerList.find((player) => player.playerId === serviceConstants.VIRTUAL_PLAYER_ID);
                let commandToExecute = '';
                let letters = '';
                virtualPlayer?.tiles.forEach((tile) => {
                    letters += tile.name;
                });
                const worldV: WordValidatorService | undefined = this.getWordValidatorOfLobby(lobby);
                if (!worldV) return;
                const virtualPlayerService: VirtualPlayerService = new VirtualPlayerService(
                    scrabbleGrid,
                    new BoardAnalyzerService(scrabbleGrid, worldV.dictionary),
                    lobby.letterBag,
                    letters,
                    new PointCalculatorService(this.scrabbleGridService.scrabbleGrid, [], worldV, this.scrabbleGridService),
                    this.turnManager,
                    this.scrabbleGridService,
                    (virtualPlayer as VirtualPlayer).difficulty,
                );
                this.timeout(() => {
                    if (commandToExecute && commandToExecute !== PASS_COMMAND)
                        this.sio.to(lobby.lobbyId).emit('commandOfVirtualPlayer', commandToExecute);
                    else
                        this.timeout(() => {
                            if (commandToExecute) this.sio.to(lobby.lobbyId).emit('commandOfVirtualPlayer', commandToExecute);
                            else this.sio.to(lobby.lobbyId).emit('commandOfVirtualPlayer', '!passer');
                        }, serviceConstants.TIME_LEFT_VIRTUAL_PLAYER);
                }, serviceConstants.SECOND_VIRTUAL_PLAYER_PLAY);
                commandToExecute = await virtualPlayerService.play();
            });

            socket.on('switchTurn', (data: string) => {
                const lobby: MultiplayerLobby | undefined = this.lobbyManager.getLobby(JSON.parse(data));
                if (!lobby) return;
                this.turnManager.switchTurn(lobby);
                this.turnSwitched(lobby);
            });

            socket.on('passTurn', (data: string) => {
                const lobby: MultiplayerLobby | undefined = this.lobbyManager.getLobby(JSON.parse(data));
                if (!lobby) return;
                this.turnManager.passTurn(lobby);
                this.turnSwitched(lobby);
            });

            socket.on('dialogBoxMessage', (data: string) => {
                const dialogMessage: ChatMessage = JSON.parse(data);
                if (!dialogMessage.lobbyId) return;
                if (socket.rooms.has(dialogMessage.lobbyId)) this.sio.to(dialogMessage.lobbyId).emit('dialogBox', dialogMessage);
            });

            socket.on('updateGridView', (data: string) => {
                const wordRequest: WordRequest = JSON.parse(data);
                if (!wordRequest.lobbyId) return;
                if (socket.rooms.has(wordRequest.lobbyId)) this.sio.to(wordRequest.lobbyId).emit('updateGridView', wordRequest);
            });

            socket.on('removeRefillLetters', (data: string) => {
                const wordRequest: WordRequest = JSON.parse(data);
                const lobby: MultiplayerLobby | undefined = this.lobbyManager.getLobby(wordRequest.lobbyId);
                if (!wordRequest.lobbyId || !socket.rooms.has(wordRequest.lobbyId) || !lobby) return;
                this.turnManager.removeAndRefillTiles(lobby, wordRequest.word);
            });

            socket.on('removeLetters', (data: string) => {
                const wordRequest: WordRequest = JSON.parse(data);
                const lobby: MultiplayerLobby | undefined = this.lobbyManager.getLobby(wordRequest.lobbyId);
                if (!wordRequest.lobbyId || !socket.rooms.has(wordRequest.lobbyId) || !lobby) return;
                this.turnManager.removeTilesFromPlayerTemporary(lobby, wordRequest.word);
                this.emitCurrentLobbyState(lobby);
            });

            socket.on('giveBackLetters', (data: string) => {
                const wordRequest: WordRequest = JSON.parse(data);
                const lobby: MultiplayerLobby | undefined = this.lobbyManager.getLobby(wordRequest.lobbyId);
                if (!wordRequest.lobbyId || !socket.rooms.has(wordRequest.lobbyId) || !lobby) return;
                this.turnManager.giveBackTilesOfPlayer(lobby, wordRequest.word);
                this.emitCurrentLobbyState(lobby);
            });

            socket.on('wordValidation', (data: string) => {
                const parsedInfo: ParsedInfo | undefined = JSON.parse(data);
                if (!parsedInfo) return;
                const lobby: MultiplayerLobby | undefined = this.lobbyManager.getLobby(parsedInfo.lobbyId);
                if (!lobby) return;
                const worldV: WordValidatorService | undefined = this.getWordValidatorOfLobby(lobby);
                if (!worldV) return;
                this.turnManager.setPointCalculator(
                    new PointCalculatorService(this.scrabbleGridService.scrabbleGrid, [], worldV, this.scrabbleGridService),
                );
                const wordValidation: WordValidation = this.scrabbleGridService.createWordValidation(parsedInfo);
                if (!this.turnManager.checkWordValidationAndPoints(wordValidation)) socket.emit('isNotInDict', wordValidation);
                else {
                    if (lobby.lobbyType === LobbyType.LOG2990)
                        this.turnManager.verifyQuestCompletion(lobby, wordValidation, this.timeSpentOnMove.get(lobby.lobbyId));

                    socket.emit('isInDict', wordValidation);
                    this.turnManager.addPointsToActivePlayer(lobby);
                }
            });

            socket.on('disconnect', () => {
                const lobby: MultiplayerLobby | undefined = this.lobbyManager.getLobbyOfPlayer(socket.id);
                if (!(lobby && lobby.playerList.length > 1)) return;
                this.dateResignation.set(socket.id, new Date());
                setTimeout(() => {
                    if (this.dateResignation.get(socket.id)) this.resignation(lobby, socket);
                }, serviceConstants.SECOND_BEFORE_GIVEUP);
            });

            socket.on('startTimer', (data: string) => {
                const lobby: MultiplayerLobby = JSON.parse(data);
                if (!socket.rooms.has(lobby.lobbyId)) return;
                lobby.timeLeft = lobby.baseTimerValue;
                this.timerInterval.set(
                    lobby.lobbyId,
                    setInterval(() => {
                        this.sio.to(lobby.lobbyId).emit('timer', lobby.timeLeft);
                        if (lobby.timeLeft <= TIMER_END_VALUE) lobby.timeLeft = lobby.baseTimerValue;
                        if (lobby.lobbyType === LobbyType.LOG2990) this.timeSpentOnMove.set(lobby.lobbyId, lobby.baseTimerValue - lobby.timeLeft);
                        --lobby.timeLeft;
                    }, TIMER_INTERVAL_VALUE_ONE_SECOND),
                );
            });

            socket.on('getLetterBag', (data: string) => {
                const lobby: MultiplayerLobby | undefined = this.lobbyManager.getLobby(JSON.parse(data)[serviceConstants.INDEX_DATA_0]);
                const playerId: string = JSON.parse(data)[serviceConstants.INDEX_DATA_1];
                if (!lobby) return;
                const letterBagMessage: ChatMessage[] = this.commandMessageCreatorService.createGetLetterBagMessage(
                    playerId,
                    lobby.letterBag,
                    lobby.lobbyId,
                );
                for (const chatMessage of letterBagMessage) {
                    this.sio.to(playerId).emit('dialogBox', chatMessage);
                }
            });

            socket.on('getIndice', async (data: string) => {
                const lobby: MultiplayerLobby | undefined = this.lobbyManager.getLobby(JSON.parse(data)[serviceConstants.INDEX_DATA_0]);
                const playerId: string = JSON.parse(data)[serviceConstants.INDEX_DATA_1];
                let player: Player | undefined;
                if (!lobby) return;
                if (lobby) player = lobby.playerList.find((thePlayer) => thePlayer.playerId === playerId);
                const wordV: WordValidatorService | undefined = this.getWordValidatorOfLobby(lobby);
                if (!wordV) return;
                if (!(lobby && player?.isTurn)) return;
                const hintsProviderService: HintsProviderService = new HintsProviderService(
                    this.turnManager,
                    this.scrabbleGridService,
                    wordV.dictionary,
                );

                this.sio.to(playerId).emit('dialogBox', this.commandMessageCreatorService.createGetIndiceBeginMessage(playerId, lobby.lobbyId));
                for (const word of await hintsProviderService.getThreeHints(JSON.parse(data)[serviceConstants.INDEX_DATA_2], player))
                    this.sio
                        .to(playerId)
                        .emit('dialogBox', this.commandMessageCreatorService.createGetIndiceFullMessage(playerId, lobby.lobbyId, word));
            });

            socket.on('exchangeLetter', (data: string) => {
                let letter: string = JSON.parse(data)[serviceConstants.INDEX_DATA_0];
                const lobbyID: string = JSON.parse(data)[serviceConstants.INDEX_DATA_1];
                const lobby: MultiplayerLobby | undefined = this.lobbyManager.getLobby(lobbyID);
                if (!lobby) return;
                const currentPlayer: Player | undefined = this.turnManager.getActivePlayer(lobby.playerList);
                if (!currentPlayer) return;
                letter = this.lobbyManager.exchangeLetter(lobby, currentPlayer, letter);
                this.emitCurrentLobbyState(lobby);
                for (const player of lobby.playerList)
                    this.sio
                        .to(player.playerId)
                        .emit('dialogBox', this.commandMessageCreatorService.createExchangeMessage(letter, currentPlayer, lobbyID, player.isTurn));
            });

            socket.on('reconnection', (data: string) => {
                const oldIdSockets: string = JSON.parse(data)[serviceConstants.INDEX_DATA_0];
                const newIdSockets: string = JSON.parse(data)[serviceConstants.INDEX_DATA_1];
                const lobby = this.lobbyManager.getLobbyOfPlayer(oldIdSockets);
                if (!lobby) return;
                this.lobbyManager.setPlayerInfo(lobby.lobbyId, oldIdSockets, newIdSockets);
                socket.emit(newIdSockets, lobby);
                this.sio.to(lobby.lobbyId).emit('getLobbyInfo', lobby);
                this.sio.to(lobby.lobbyId).emit('redirect', lobby.lobbyId);
                this.dateResignation.delete(oldIdSockets);
            });

            socket.on('updatePlayerEasel', (data: string) => {
                const lobbyID: string = JSON.parse(data)[serviceConstants.INDEX_DATA_0];
                const playerID: string = JSON.parse(data)[serviceConstants.INDEX_DATA_1];
                const tiles: Tile[] = JSON.parse(data)[serviceConstants.INDEX_DATA_2];
                this.lobbyManager.setPlayerEasel(lobbyID, playerID, tiles);
            });
        });
        setInterval(() => {
            this.emitLobbies();
        }, serviceConstants.RESPONSE_DELAY);
    }

    emitEndGame(lobby: MultiplayerLobby, messages: string[]): void {
        for (const message of messages) {
            this.sio.to(lobby.lobbyId).emit('dialogBox', {
                author: TypeOfUser.SYSTEM,
                text: message,
                date: new Date(),
                lobbyId: lobby.lobbyId,
                socketId: '',
            } as ChatMessage);
        }
        lobby.playerList.forEach((player) => {
            this.sio.to(lobby.lobbyId).emit('dialogBox', this.commandMessageCreatorService.createEndGameEaselMessage(player, lobby.lobbyId));
            this.sio.to(player.playerId).emit('gameEnded');
        });
    }

    private timeout(a: Callback, time: number): void {
        setTimeout(a, time);
    }

    private verifyTurn(lobby: MultiplayerLobby): void {
        if (Math.random() * lobby.playerList.length >= lobby.playerList.length / 2) this.turnManager.switchTurn(lobby);
    }

    private leaveRoom(socket: io.Socket, roomId: string): void {
        socket.leave(roomId);
    }

    private emitCurrentLobbyState(lobby: MultiplayerLobby): void {
        this.sio.to(lobby.lobbyId).emit(lobby.lobbyId, lobby);
    }

    private emitLobbies(): void {
        this.sio.sockets.emit('availableLobbies', this.lobbyManager.availableLobbies());
    }

    private turnSwitched(lobby: MultiplayerLobby): void {
        const timer: NodeJS.Timeout | undefined = this.timerInterval.get(lobby.lobbyId);
        if (timer) clearInterval(timer);
        this.emitCurrentLobbyState(lobby);
        if (this.turnManager.isGameEnd(lobby)) {
            this.emitEndGame(lobby, [this.turnManager.messageletterBagEndGame(lobby), this.turnManager.messageEndGame(lobby)]);
        } else this.sio.to(lobby.lobbyId).emit('startPlayerTurn');
    }

    private async resignation(lobby: MultiplayerLobby, socket: io.Socket): Promise<void> {
        serviceConstants.RESIGNATION_MESSAGE.lobbyId = lobby.lobbyId;
        serviceConstants.RESIGNATION_MESSAGE.socketId = socket.id;
        this.sio.to(lobby.lobbyId).emit('dialogBox', serviceConstants.RESIGNATION_MESSAGE);
        const room: Set<string> | undefined = this.sio.sockets.adapter.rooms.get(lobby.lobbyId);
        if (!room || room.size <= 1) {
            this.timerInterval.delete(lobby.lobbyId);
            this.gameLogsService.addLog(lobby, true);
        } else if (await this.turnManager.resignation(lobby, socket.id)) this.turnSwitched(lobby);
        else this.emitCurrentLobbyState(lobby);
        this.leaveRoom(socket, lobby.lobbyId);
    }

    private getWordValidatorOfLobby(lobby: MultiplayerLobby): WordValidatorService | undefined {
        if (!this.lobbyDict.get(lobby.lobbyId)) this.lobbyDict.set(lobby.lobbyId, new WordValidatorService(lobby.dictionary));
        const wordValidator: WordValidatorService | undefined = this.lobbyDict.get(lobby.lobbyId);
        return wordValidator;
    }
}
