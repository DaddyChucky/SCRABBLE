/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { TestHelper } from '@app/classes/test-helper';
import { container } from '@app/inversify.config';
import { Server } from '@app/server';
import { BoardAnalyzerService } from '@app/services/board-analyzer/board-analyzer.service';
import { CHAT_MESSAGE_EXCHANGE } from '@app/services/command-message-creator/command-message-creator.service.spec.constants';
import { VirtualPlayerService } from '@app/services/virtual-player/virtual-player.service';
import { WordValidatorService } from '@app/services/word-validator/word-validator.service';
import Types from '@app/types';
import { ChatMessage } from '@common/model/chat-message';
import { DirectionType } from '@common/model/direction-type';
import { LetterBag } from '@common/model/letter-bag/letter-bag';
import { MultiplayerLobby } from '@common/model/lobby';
import { LobbyStatus } from '@common/model/lobby-status';
import { LobbyType } from '@common/model/lobby-type';
import { Player } from '@common/model/player';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Tile } from '@common/model/tile';
import { Vec2 } from '@common/model/vec2';
import { WordRequest } from '@common/model/word-request';
import { WordValidation } from '@common/model/word-validation';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { io as ioClient, Socket } from 'socket.io-client';
import { SocketManagementService } from './socket-management.service';
import * as serviceConstants from './socket-management.service.constants';
import * as specConstants from './socket-management.service.spec.constants';

// eslint-disable-next-line @typescript-eslint/no-require-imports
import Sinon = require('sinon');
describe('SocketManagementService tests', () => {
    let service: SocketManagementService;
    let clientSocket: Socket;
    let grid: ScrabbleGrid = { elements: [] } as ScrabbleGrid;
    const testHelper: TestHelper = new TestHelper(grid);
    const server: Server = container.get<Server>(Types.Server);

    server.init();

    beforeEach(async () => {
        grid = testHelper.initializeGrid();
        service = server['socketManager'];
        clientSocket = ioClient(specConstants.URL_STRING, { transports: ['websocket'], upgrade: false });
        specConstants.EXPECTED_LOBBY.lobbyStatus = LobbyStatus.CREATED;
        specConstants.PLAYER1.isTurn = true;
        specConstants.EXPECTED_LOBBY.playerList = [specConstants.PLAYER1, specConstants.PLAYER2];
    });

    afterEach(async () => {
        clientSocket.close();
        sinon.restore();
        service['dateResignation'].clear();
    });

    it('createLobby should emit back the lobby info', (done: Mocha.Done) => {
        const clock: sinon.SinonFakeTimers = sinon.useFakeTimers();
        sinon.stub(service['lobbyManager'], 'createLobby').callsFake(() => {
            return specConstants.EXPECTED_LOBBY;
        });
        clientSocket.emit('createLobby', JSON.stringify(specConstants.LOBBY_INFO));
        clock.tick(serviceConstants.RESPONSE_DELAY);
        clientSocket.on(specConstants.LOBBY_INFO.player.playerId, (lobby: MultiplayerLobby) => {
            expect(lobby.dictionary).to.be.equal(specConstants.EXPECTED_LOBBY.dictionary);
            expect(lobby.lobbyType).to.be.equal(specConstants.EXPECTED_LOBBY.lobbyType);
            expect(lobby.baseTimerValue).to.be.equal(specConstants.EXPECTED_LOBBY.baseTimerValue);
            expect(lobby.lobbyStatus).to.be.equal(specConstants.EXPECTED_LOBBY.lobbyStatus);
            expect(lobby.playerList).to.eql(specConstants.EXPECTED_LOBBY.playerList);
            clock.restore();
            done();
        });
    });

    it('createVirtualPlayer should call getLobby of lobbyManager', (done: Mocha.Done) => {
        const getLobbySpy: sinon.SinonStub<[lobbyId: string], MultiplayerLobby | undefined> = sinon
            .stub(service['lobbyManager'], 'getLobby')
            .callsFake(() => {
                return specConstants.EXPECTED_LOBBY;
            });
        sinon.stub(service['lobbyManager'], 'joinLobby').callsFake(() => {
            return;
        });
        sinon.stub(service['turnManager'], 'switchTurn').callsFake(() => {
            return;
        });
        const clock: sinon.SinonFakeTimers = sinon.useFakeTimers();
        clientSocket.emit('createVirtualPlayer', JSON.stringify(specConstants.LOBBY_INFO));
        clock.tick(serviceConstants.RESPONSE_DELAY);
        clientSocket.on(specConstants.LOBBY_INFO.player.playerId, (lobby: MultiplayerLobby) => {
            expect(lobby.lobbyId).to.eql(specConstants.LOBBY_INFO.lobbyId);
            expect(getLobbySpy.called);
            clock.restore();
            done();
        });
    });

    it('createVirtualPlayer should joinLobby and emit if lobby is found', (done: Mocha.Done) => {
        const joinLobbySpy: sinon.SinonStub<[player: Player, lobbyId: string], void> = sinon
            .stub(service['lobbyManager'], 'joinLobby')
            .callsFake(() => {
                return;
            });
        sinon.stub(service['turnManager'], 'switchTurn').callsFake(() => {
            return;
        });
        const clock: sinon.SinonFakeTimers = sinon.useFakeTimers();
        Sinon.stub(service['lobbyManager'], 'getLobby').returns(specConstants.EXPECTED_LOBBY);
        const emitSpy: sinon.SinonSpy<[ev: string, ...args: any[]], boolean> = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('createVirtualPlayer', JSON.stringify(specConstants.LOBBY_INFO));
        clock.tick(serviceConstants.RESPONSE_DELAY);
        clientSocket.on(specConstants.LOBBY_INFO.player.playerId, (lobby: MultiplayerLobby) => {
            expect(lobby.lobbyId).to.eql(specConstants.LOBBY_INFO.lobbyId);
            expect(joinLobbySpy.calledWithExactly(specConstants.EXPECTED_VIRTUAL_PLAYER, specConstants.LOBBY_INFO.lobbyId));
            expect(emitSpy.called);
            clock.restore();
            done();
        });
    });

    it('joinLobby should emit back the lobby info to the lobby', (done: Mocha.Done) => {
        const clock: sinon.SinonFakeTimers = sinon.useFakeTimers();
        sinon.stub(service['lobbyManager'], 'getLobby').callsFake(() => {
            return specConstants.EXPECTED_LOBBY;
        });
        sinon.stub(service['lobbyManager'], 'joinLobby').callsFake(() => {
            return;
        });
        sinon.stub(service['usernameService'], 'sameNamesLobby').callsFake(() => {
            return false;
        });
        clientSocket.emit('joinLobby', JSON.stringify(specConstants.LOBBY_INFO));
        clock.tick(serviceConstants.RESPONSE_DELAY);
        clientSocket.on('lobbyExistence', (receivedLobby: MultiplayerLobby) => {
            clientSocket.on(specConstants.LOBBY_INFO.lobbyId, () => {
                expect(receivedLobby.baseTimerValue).to.eql(specConstants.EXPECTED_LOBBY.baseTimerValue);
                expect(receivedLobby.dictionary).to.eql(specConstants.EXPECTED_LOBBY.dictionary);
                expect(receivedLobby.lobbyId).to.eql(specConstants.EXPECTED_LOBBY.lobbyId);
                expect(receivedLobby.lobbyType).to.eql(specConstants.EXPECTED_LOBBY.lobbyType);
            });
            clock.restore();
            done();
        });
    });

    it('joinLobby should not emit anything if non existent lobby', (done: Mocha.Done) => {
        const clock: sinon.SinonFakeTimers = sinon.useFakeTimers();
        Sinon.stub(service['lobbyManager'], 'getLobby').returns(undefined);
        clientSocket.emit('joinLobby', JSON.stringify(specConstants.LOBBY_INFO));
        clock.tick(serviceConstants.RESPONSE_DELAY);
        clientSocket.on(specConstants.LOBBY_INFO.player.playerId, (lobby: MultiplayerLobby) => {
            expect(lobby).to.be.equal(null);
            clock.restore();
            done();
        });
    });

    it('joinLobby should call sameNamesLobby from usernameService', (done: Mocha.Done) => {
        const clock: sinon.SinonFakeTimers = sinon.useFakeTimers();
        sinon.stub(service['lobbyManager'], 'getLobby').callsFake(() => {
            return specConstants.EXPECTED_LOBBY;
        });
        const spy: sinon.SinonStub<[firstUsername: string, secondUsername: string], boolean> = sinon
            .stub(service['usernameService'], 'sameNamesLobby')
            .callsFake(() => {
                return false;
            });
        clientSocket.emit('joinLobby', JSON.stringify(specConstants.LOBBY_INFO));
        clock.tick(serviceConstants.RESPONSE_DELAY);
        clientSocket.on(specConstants.LOBBY_INFO.player.playerId, (lobby: MultiplayerLobby) => {
            expect(lobby).to.eql(specConstants.EXPECTED_LOBBY);
            expect(spy.called);
            clock.restore();
            done();
        });
    });

    it('joinLobby should emit sameUsername if sameNameLobby return true', (done: Mocha.Done) => {
        const clock: sinon.SinonFakeTimers = sinon.useFakeTimers();
        const spy: sinon.SinonSpy<[ev: string, ...args: any[]], boolean> = sinon.spy(service['sio'].sockets, 'emit');
        sinon.stub(service['lobbyManager'], 'getLobby').callsFake(() => {
            return specConstants.EXPECTED_LOBBY;
        });
        sinon.stub(service['usernameService'], 'sameNamesLobby').callsFake(() => {
            return true;
        });
        clientSocket.emit('joinLobby', JSON.stringify(specConstants.LOBBY_INFO));
        clock.tick(serviceConstants.RESPONSE_DELAY);
        clientSocket.on('sameUsername', () => {
            expect(spy.called);
            clock.restore();
            done();
        });
    });

    it('cancelGame should call deleteLobby of lobbyManagement', (done: Mocha.Done) => {
        const deleteLobbySpy: sinon.SinonStub<[lobbyId: string], void> = sinon.stub(service['lobbyManager'], 'deleteLobby').callsFake(() => {
            return;
        });
        const leaveRommSpy = sinon.spy(service['leaveRoom']);
        clientSocket.emit('cancelGame', JSON.stringify(specConstants.LOBBY_INFO.lobbyId));

        setTimeout(() => {
            expect(deleteLobbySpy.called);
            expect(leaveRommSpy.called);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('redirectPlayer should send link to players if lobby exists', (done: Mocha.Done) => {
        const clock: sinon.SinonFakeTimers = sinon.useFakeTimers();
        const expectedLink: string = specConstants.EXPECTED_LOBBY.lobbyId;
        Sinon.stub(service['lobbyManager'], 'createLobby').returns(specConstants.EXPECTED_LOBBY);
        clientSocket.emit('createLobby', JSON.stringify(specConstants.LOBBY_INFO));
        clientSocket.emit('redirectPlayer', JSON.stringify(specConstants.EXPECTED_LOBBY));
        clock.tick(serviceConstants.RESPONSE_DELAY);
        clientSocket.on('redirect', (gameLink: string) => {
            expect(gameLink).to.be.equal(expectedLink);
            clock.restore();
            done();
        });
    });

    it('redirectPlayer should do nothing if lobby does not exist', (done: Mocha.Done) => {
        const clock: sinon.SinonFakeTimers = sinon.useFakeTimers();
        const spy = sinon.spy(service['sio'], 'to');
        clientSocket.emit('redirectPlayer', JSON.stringify(specConstants.EXPECTED_LOBBY));
        clock.tick(serviceConstants.RESPONSE_DELAY);
        expect(spy.notCalled);
        clock.restore();
        done();
    });

    it('dialogBoxMessage sends the message to the lobby', (done: Mocha.Done) => {
        Sinon.stub(service['lobbyManager'], 'createLobby').returns(specConstants.EXPECTED_LOBBY);
        clientSocket.emit('createLobby', JSON.stringify(specConstants.LOBBY_INFO));
        clientSocket.emit('dialogBoxMessage', JSON.stringify(specConstants.CHAT_MSG));
        clientSocket.on('dialogBox', (msg: ChatMessage) => {
            msg.date = specConstants.CHAT_MSG.date; // type Date loss
            expect(msg).to.eql(specConstants.CHAT_MSG);
            done();
        });
    });

    it('updateGridView sends the message to the lobby', (done: Mocha.Done) => {
        Sinon.stub(service['lobbyManager'], 'createLobby').returns(specConstants.EXPECTED_LOBBY);
        clientSocket.emit('createLobby', JSON.stringify(specConstants.LOBBY_INFO));
        const spy = sinon.spy(service['sio'], 'to');
        const wordRequest: WordRequest = {
            lobbyId: specConstants.EXPECTED_LOBBY.lobbyId,
            socketId: 'this.socketService.socket.id',
            word: 'salut',
            startPosition: { x: 7, y: 7 } as Vec2,
            direction: DirectionType.HORIZONTAL,
        } as WordRequest;

        clientSocket.emit('updateGridView', JSON.stringify(wordRequest));
        clientSocket.on('updateGridView', (receivedWordRequest: WordRequest) => {
            expect(receivedWordRequest).to.eql(wordRequest);
            expect(spy.called);
            done();
        });
    });

    it("updateGridView shouldn't sends the message to the lobby", () => {
        const spy = sinon.spy(service['sio'], 'to');
        const wordRequest: WordRequest = {
            socketId: 'this.socketService.socket.id',
            word: 'salut',
            startPosition: { x: 7, y: 7 } as Vec2,
            direction: DirectionType.HORIZONTAL,
        } as WordRequest;
        clientSocket.emit('updateGridView', JSON.stringify(wordRequest));
        expect(spy.notCalled);
    });

    it('wordValidation emits back position and letters when is in dict', (done: Mocha.Done) => {
        specConstants.EXPECTED_LOBBY.lobbyType = LobbyType.LOG2990;
        Sinon.stub(service['lobbyManager']).getLobby.returns(specConstants.EXPECTED_LOBBY);
        Sinon.stub(service['scrabbleGridService'], 'createWordValidation').returns(specConstants.WORD_VALIDATION);
        Sinon.stub(service['turnManager'], 'checkWordValidationAndPoints').returns(true);
        Sinon.stub(service, 'getWordValidatorOfLobby' as any).returns(new WordValidatorService(specConstants.DEFAULT_DICT));

        clientSocket.emit('wordValidation', JSON.stringify(specConstants.WORD_VALIDATION.parsedInfo));
        clientSocket.on('isInDict', (data: WordValidation) => {
            expect(data).to.eql(specConstants.WORD_VALIDATION);
            done();
        });
    });

    it('startVirtualPlayerTurn should emit and call play', (done: Mocha.Done) => {
        const clock = sinon.useFakeTimers();
        const virtualPlayerSpy = Sinon.stub(VirtualPlayerService.prototype, 'play').callsFake(async () => {
            return '!jouer';
        });
        Sinon.stub(service, 'timeout' as any).callsFake(async () => {
            service['sio'].to(specConstants.EXPECTED_LOBBY.lobbyId).emit('commandOfVirtualPlayer', '!jouer');
            clock.restore();
            done();
        });
        const spy = sinon.spy(service['sio'], 'to');
        specConstants.EXPECTED_LOBBY.playerList[0] = specConstants.VIRTUAL_PLAYER;
        clientSocket.emit('startVirtualPlayerTurn', JSON.stringify([specConstants.EXPECTED_LOBBY, grid]));
        clock.tick(specConstants.RESPONSE_DELAY + specConstants.SECOND_VIRTUAL_PLAYER_PLAY);
        expect(spy.called);
        expect(virtualPlayerSpy.called);
    });

    it('wordValidation emits back position and letters when is not in dict', (done: Mocha.Done) => {
        Sinon.stub(service['lobbyManager']).getLobby.returns(specConstants.EXPECTED_LOBBY);
        Sinon.stub(service['turnManager'], 'checkWordValidationAndPoints').returns(false);
        Sinon.stub(service['scrabbleGridService'], 'createWordValidation').returns(specConstants.WORD_VALIDATION);
        Sinon.stub(service, 'getWordValidatorOfLobby' as any).returns(new WordValidatorService(specConstants.DEFAULT_DICT));

        clientSocket.emit('wordValidation', JSON.stringify(specConstants.WORD_VALIDATION.parsedInfo));
        clientSocket.on('isNotInDict', (data: WordValidation) => {
            expect(data).to.eql(specConstants.WORD_VALIDATION);
            done();
        });
    });

    it('dialogBoxMessage should send back nothing if message is empty', (done: Mocha.Done) => {
        const clock: sinon.SinonFakeTimers = sinon.useFakeTimers();
        const spy = sinon.spy(service['sio'], 'to');
        Sinon.stub(service['lobbyManager'], 'createLobby').returns(specConstants.EXPECTED_LOBBY);
        clientSocket.emit('createLobby', JSON.stringify(specConstants.LOBBY_INFO));
        clientSocket.emit('dialogBoxMessage', JSON.stringify({}));
        clock.tick(serviceConstants.RESPONSE_DELAY);
        expect(spy.notCalled);
        clock.restore();
        done();
    });

    it('dialogBoxMessage should emit back nothing if room does not exist', (done: Mocha.Done) => {
        const spy = sinon.spy(service['sio'], 'to');
        clientSocket.emit('dialogBoxMessage', JSON.stringify(specConstants.CHAT_MSG));
        setTimeout(() => {
            expect(spy.notCalled);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('availableLobbies should emit an empty list of there is no available lobby', (done: Mocha.Done) => {
        specConstants.EXPECTED_LOBBY.lobbyStatus = LobbyStatus.DELETED;
        service['lobbyManager'].lobbyList.push(specConstants.EXPECTED_LOBBY);
        clientSocket.emit('availableLobbies', JSON.stringify(specConstants.LOBBY_INFO));
        clientSocket.on(specConstants.LOBBY_INFO.player.playerId, (lobbies: MultiplayerLobby[]) => {
            expect(lobbies).to.eql([]);
            done();
        });
    });

    it('startTimer should emit to room a timer event with a timer value', (done: Mocha.Done) => {
        sinon.stub(service['turnManager'], 'passTurn').callsFake(() => {
            return;
        });
        clientSocket.emit('createLobby', JSON.stringify(specConstants.LOBBY_INFO));
        sinon.stub(service['lobbyManager'], 'createLobby').callsFake(() => {
            return specConstants.EXPECTED_LOBBY;
        });
        const spy = sinon.spy(service['sio'], 'to');
        specConstants.EXPECTED_LOBBY.lobbyType = LobbyType.LOG2990;
        clientSocket.emit('startTimer', JSON.stringify(specConstants.EXPECTED_LOBBY));
        clientSocket.on('timer', (timer: number) => {
            expect(timer).to.equal(specConstants.EXPECTED_LOBBY.baseTimerValue);
            expect(spy.called);
            done();
        });
    });

    it('should emit to all sockets when emitting lobbies', () => {
        const spy: sinon.SinonSpy<[ev: string, ...args: any[]], boolean> = sinon.spy(service['sio'].sockets, 'emit');
        service['emitLobbies']();
        assert(spy.called);
    });

    it('should call emitTime on socket configuration', (done: Mocha.Done) => {
        const spy: sinon.SinonSpy<unknown[], unknown> = sinon.spy(service, 'emitLobbies' as never);
        setTimeout(() => {
            expect(spy.called);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('on emit switch turn, should call switch turn of turnManager', (done) => {
        const lobbyStub: sinon.SinonStub<[lobbyId: string], MultiplayerLobby | undefined> = sinon
            .stub(service['lobbyManager'], 'getLobby')
            .callsFake(() => {
                return specConstants.EXPECTED_LOBBY;
            });
        const switchStub: sinon.SinonStub<[lobby: MultiplayerLobby], void> = sinon.stub(service['turnManager'], 'switchTurn').callsFake(() => {
            return;
        });
        clientSocket.emit('switchTurn', JSON.stringify(specConstants.EXPECTED_LOBBY.lobbyId));
        setTimeout(() => {
            expect(lobbyStub.calledWith(specConstants.EXPECTED_LOBBY.lobbyId));
            expect(switchStub.calledWith(specConstants.EXPECTED_LOBBY));
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('on emit passTurn, should call passTurn of turnManager', (done: Mocha.Done) => {
        const lobbyStub: sinon.SinonStub<[lobbyId: string], MultiplayerLobby | undefined> = sinon
            .stub(service['lobbyManager'], 'getLobby')
            .callsFake(() => {
                return specConstants.EXPECTED_LOBBY;
            });
        const turnStub: sinon.SinonStub<[lobby: MultiplayerLobby], void> = sinon.stub(service['turnManager'], 'passTurn').callsFake(() => {
            return;
        });
        clientSocket.emit('passTurn', JSON.stringify(specConstants.EXPECTED_LOBBY.lobbyId));
        setTimeout(() => {
            expect(lobbyStub.calledWith(specConstants.EXPECTED_LOBBY.lobbyId));
            expect(turnStub.calledWith(specConstants.EXPECTED_LOBBY));
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it("on emit creategame, shouldn't call createGame of turnManager if lobby doesn't exist", (done: Mocha.Done) => {
        const lobbyStub: sinon.SinonStub<[lobbyId: string], MultiplayerLobby | undefined> = sinon
            .stub(service['lobbyManager'], 'getLobby')
            .callsFake(() => {
                return undefined;
            });
        const gameManagStub: sinon.SinonStub<[lobbyID: string], void> = sinon.stub(service['turnManager'], 'createGame').callsFake(() => {
            return;
        });
        clientSocket.emit('createGame', JSON.stringify('lobbyId'));
        setTimeout(() => {
            expect(lobbyStub.called);
            expect(gameManagStub.notCalled);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('on emit creategame, should call createGame of turnManager if lobby exist', (done: Mocha.Done) => {
        const lobbyStub: sinon.SinonStub<[lobbyId: string], MultiplayerLobby | undefined> = sinon
            .stub(service['lobbyManager'], 'getLobby')
            .callsFake(() => {
                return specConstants.EXPECTED_LOBBY;
            });
        const gameManagStub: sinon.SinonStub<[lobbyID: string], void> = sinon.stub(service['turnManager'], 'createGame').callsFake(() => {
            return;
        });
        clientSocket.emit('createGame', JSON.stringify('lobbyId'));
        setTimeout(() => {
            expect(lobbyStub.called);
            expect(gameManagStub.called);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('on receiving reconnection, should call getLobby of player and setPlayerInfo if getLobby return a lobby', (done: Mocha.Done) => {
        const getlobbyStub: sinon.SinonStub<[playerId: string], MultiplayerLobby | undefined> = sinon
            .stub(service['lobbyManager'], 'getLobbyOfPlayer')
            .returns(specConstants.EXPECTED_LOBBY);
        const setPlayerlobbyStub: sinon.SinonStub<[lobbyId: string, oldPlayerId: string, newPlayerId: string], void> = sinon
            .stub(service['lobbyManager'], 'setPlayerInfo')
            .callsFake(() => {
                return;
            });
        const spy: sinon.SinonSpy<[ev: string, ...args: any[]], boolean> = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('reconnection', JSON.stringify([specConstants.PLAYER1.playerId, specConstants.PLAYER2.playerId]));
        setTimeout(() => {
            expect(getlobbyStub.calledWith(specConstants.PLAYER1.playerId));
            expect(
                setPlayerlobbyStub.calledWith(specConstants.EXPECTED_LOBBY.lobbyId, specConstants.PLAYER1.playerId, specConstants.PLAYER2.playerId),
            );
            expect(spy.called);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it("on receiving reconnection, shouldn't call setPlayerInfo if getLobby return undefined", (done: Mocha.Done) => {
        const getlobbyStub: sinon.SinonStub<[playerId: string], MultiplayerLobby | undefined> = sinon
            .stub(service['lobbyManager'], 'getLobbyOfPlayer')
            .callsFake(() => {
                return undefined;
            });
        const setPlayerlobbyStub: sinon.SinonStub<[lobbyId: string, oldPlayerId: string, newPlayerId: string], void> = sinon
            .stub(service['lobbyManager'], 'setPlayerInfo')
            .callsFake(() => {
                return;
            });
        clientSocket.emit('reconnection', JSON.stringify([specConstants.PLAYER1.playerId, specConstants.PLAYER2.playerId]));
        setTimeout(() => {
            expect(getlobbyStub.called);
            expect(setPlayerlobbyStub.notCalled);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('removeRefillLetters should call getLobby and removeAndRefillTiles', (done: Mocha.Done) => {
        Sinon.stub(service['lobbyManager'], 'createLobby').returns(specConstants.EXPECTED_LOBBY);
        clientSocket.emit('createLobby', JSON.stringify(specConstants.LOBBY_INFO));
        const getLobbyStub: sinon.SinonStub<[lobbyId: string], MultiplayerLobby | undefined> = sinon
            .stub(service['lobbyManager'], 'getLobby')
            .callsFake(() => {
                return specConstants.EXPECTED_LOBBY;
            });
        const removeAndRefillTilesStub: sinon.SinonStub<[lobby: MultiplayerLobby, word: string], void> = sinon
            .stub(service['turnManager'], 'removeAndRefillTiles')
            .callsFake(() => {
                return;
            });

        clientSocket.emit('removeRefillLetters', JSON.stringify(specConstants.WORD_REQUEST));
        setTimeout(() => {
            expect(getLobbyStub.calledWith(specConstants.EXPECTED_LOBBY.lobbyId));
            expect(removeAndRefillTilesStub.calledWith(specConstants.EXPECTED_LOBBY, specConstants.WORD_REQUEST.word));
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('on receiving rejectPlayer2, should call rejectPlayer from lobby Manager and emit', (done: Mocha.Done) => {
        const rejectPlayerStub: sinon.SinonStub<[lobbyId: string], MultiplayerLobby | undefined> = sinon
            .stub(service['lobbyManager'], 'rejectPlayer')
            .callsFake(() => {
                return specConstants.EXPECTED_LOBBY;
            });
        const emitSpy: sinon.SinonSpy<[ev: string, ...args: any[]], boolean> = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('rejectPlayer2', JSON.stringify(specConstants.EXPECTED_LOBBY.lobbyId));
        setTimeout(() => {
            expect(rejectPlayerStub.called);
            expect(emitSpy.called);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('on resignation, should call resignation and leaveRoom', (done: Mocha.Done) => {
        Sinon.stub(service['lobbyManager'], 'createLobby').returns(specConstants.EXPECTED_LOBBY);
        clientSocket.emit('createLobby', JSON.stringify(specConstants.LOBBY_INFO));
        const resignStub: sinon.SinonStub<unknown[], unknown> = sinon.stub(service, 'resignation' as never).callsFake(() => {
            return;
        });
        const leaveSpy: sinon.SinonSpy<unknown[], unknown> = sinon.spy(service, 'leaveRoom' as never);
        clientSocket.emit('resignation', JSON.stringify(specConstants.EXPECTED_LOBBY.lobbyId));
        setTimeout(() => {
            expect(resignStub.called);
            expect(leaveSpy.called);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('on resignation, should not call endgame from turn manager and emit if lobby is not in sockets.room', (done: Mocha.Done) => {
        const resignStub: sinon.SinonStub<[lobby: MultiplayerLobby], void> = sinon.stub(service['turnManager'], 'endGame');
        const leaveSpy: sinon.SinonSpy<unknown[], unknown> = sinon.spy(service, 'leaveRoom' as never);
        specConstants.EXPECTED_LOBBY.lobbyId = clientSocket.id;
        clientSocket.emit('resignation', JSON.stringify(specConstants.EXPECTED_LOBBY.lobbyId));
        setTimeout(() => {
            expect(resignStub.notCalled);
            expect(leaveSpy.notCalled);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('resignation function should call turnManager.resignation and emit', () => {
        sinon.stub(service['sio'].sockets.adapter.rooms, 'get').returns({ size: 2 } as Set<string>);
        const emitSpy: sinon.SinonStub<[ev: string, ...args: any[]], boolean> = sinon.stub(service['sio'].sockets, 'emit');
        const resignationSpy: sinon.SinonStub<[lobby: MultiplayerLobby, playerId: string], Promise<boolean>> = sinon
            .stub(service['turnManager'], 'resignation')
            .returns(new Promise(() => true));
        const leaveRoomSpy: sinon.SinonStub<unknown[], unknown> = sinon.stub(service, 'leaveRoom' as never);
        const turnSwitchedSpy: sinon.SinonStub<unknown[], unknown> = sinon.stub(service, 'turnSwitched' as never);
        service['resignation'](specConstants.EXPECTED_LOBBY, { id: serviceConstants.VIRTUAL_PLAYER_ID } as io.Socket);
        expect(emitSpy.called);
        expect(resignationSpy.called);
        expect(leaveRoomSpy.called);
        expect(turnSwitchedSpy.called);
    });

    it('resignation function should call emitCurrentLobbyState if resignation returns false', () => {
        sinon.stub(service, 'leaveRoom' as never);
        sinon.stub(service['sio'].sockets.adapter.rooms, 'get').returns({ size: 2 } as Set<string>);
        sinon.stub(service['turnManager'], 'resignation').returns(new Promise(() => false));
        const emitLobbySpy: sinon.SinonSpy<unknown[], unknown> = sinon.spy(service, 'emitCurrentLobbyState' as never);
        service['resignation'](specConstants.EXPECTED_LOBBY, { id: serviceConstants.VIRTUAL_PLAYER_ID } as io.Socket);
        expect(emitLobbySpy.called);
    });

    it('resignation function should call timerInterval.delete and addLog if romm.size <=1 ', () => {
        sinon.stub(service, 'leaveRoom' as never);
        sinon.stub(service['sio'].sockets.adapter.rooms, 'get').returns({ size: 1 } as Set<string>);
        const deleteSpy: sinon.SinonStub<[key: string], boolean> = sinon.stub(service['timerInterval'], 'delete');
        const addLogSpy: sinon.SinonStub<[lobby: MultiplayerLobby, isAbandonedAndSolo?: boolean | undefined], Promise<void>> = sinon.stub(
            service['gameLogsService'],
            'addLog',
        );
        service['resignation'](specConstants.EXPECTED_LOBBY, { id: serviceConstants.VIRTUAL_PLAYER_ID } as io.Socket);
        expect(deleteSpy.called);
        expect(addLogSpy.calledWith(specConstants.EXPECTED_LOBBY, true));
    });

    it('resignation function should call timerInterval.delete if isTransportClose true', () => {
        sinon.stub(service, 'leaveRoom' as never);
        sinon.stub(service['sio'].sockets.adapter.rooms, 'get').returns({ size: 2 } as Set<string>);
        const deleteSpy: sinon.SinonStub<[key: string], boolean> = sinon.stub(service['timerInterval'], 'delete');
        service['resignation'](specConstants.EXPECTED_LOBBY, { id: serviceConstants.VIRTUAL_PLAYER_ID } as io.Socket);
        expect(deleteSpy.called);
    });

    it('removeRefillLetters should not call getLobby and removeAndRefillTiles if wordRequest.lobbyId is not defined ', (done: Mocha.Done) => {
        Sinon.stub(service['lobbyManager'], 'createLobby').returns(specConstants.EXPECTED_LOBBY);
        clientSocket.emit('createLobby', JSON.stringify(specConstants.LOBBY_INFO));
        const getLobbyStub: sinon.SinonStub<[lobbyId: string], MultiplayerLobby | undefined> = sinon
            .stub(service['lobbyManager'], 'getLobby')
            .callsFake(() => {
                return specConstants.EXPECTED_LOBBY;
            });
        const removeAndRefillTilesStub: sinon.SinonStub<[lobby: MultiplayerLobby, word: string], void> = sinon
            .stub(service['turnManager'], 'removeAndRefillTiles')
            .callsFake(() => {
                return;
            });

        clientSocket.emit('removeRefillLetters', JSON.stringify(specConstants.WORD_REQUEST_LOBBY_UNDEFINED));
        setTimeout(() => {
            expect(getLobbyStub.notCalled);
            expect(removeAndRefillTilesStub.notCalled);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('on receiving leaveRoom should leave the room', (done: Mocha.Done) => {
        const leaveRommSpy = sinon.spy(service['leaveRoom']);
        clientSocket.emit('leaveRoom', JSON.stringify(specConstants.LOBBY_INFO.lobbyId));
        setTimeout(() => {
            expect(leaveRommSpy.called);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('event leaveRoom should make the socket leave the room', (done: Mocha.Done) => {
        clientSocket.emit('createLobby', JSON.stringify(specConstants.LOBBY_INFO));
        clientSocket.emit('leaveRoom', JSON.stringify(specConstants.LOBBY_INFO.lobbyId));
        setTimeout(() => {
            expect(service['sio'].sockets.adapter.rooms[0]).to.equal(undefined);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('removeLetters should call getLobby and removeAndRefillTiles', (done: Mocha.Done) => {
        specConstants.EXPECTED_LOBBY.lobbyId = specConstants.LOBBY_ID;
        Sinon.stub(service['lobbyManager'], 'createLobby').returns(specConstants.EXPECTED_LOBBY);
        clientSocket.emit('createLobby', JSON.stringify(specConstants.LOBBY_INFO));
        const getLobbyStub: sinon.SinonStub<[lobbyId: string], MultiplayerLobby | undefined> = sinon
            .stub(service['lobbyManager'], 'getLobby')
            .callsFake(() => {
                return specConstants.EXPECTED_LOBBY;
            });
        const removeTilesFromPlayerTemporaryStub: sinon.SinonStub<[lobby: MultiplayerLobby, word: string], void> = sinon
            .stub(service['turnManager'], 'removeTilesFromPlayerTemporary')
            .callsFake(() => {
                return;
            });
        specConstants.WORD_REQUEST.lobbyId = specConstants.LOBBY_ID;
        clientSocket.emit('removeLetters', JSON.stringify(specConstants.WORD_REQUEST));
        setTimeout(() => {
            expect(getLobbyStub.calledWith(specConstants.WORD_REQUEST.lobbyId));
            expect(removeTilesFromPlayerTemporaryStub.calledWith(specConstants.EXPECTED_LOBBY, specConstants.WORD_REQUEST.word));
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('removeLetters should not call getLobby and removeAndRefillTiles if wordRequest.lobbyId is not defined ', (done: Mocha.Done) => {
        Sinon.stub(service['lobbyManager'], 'createLobby').returns(specConstants.EXPECTED_LOBBY);
        clientSocket.emit('createLobby', JSON.stringify(specConstants.LOBBY_INFO));
        const getLobbyStub: sinon.SinonStub<[lobbyId: string], MultiplayerLobby | undefined> = sinon
            .stub(service['lobbyManager'], 'getLobby')
            .callsFake(() => {
                return specConstants.EXPECTED_LOBBY;
            });
        const removeTilesFromPlayerTemporaryStub: sinon.SinonStub<[lobby: MultiplayerLobby, word: string], void> = sinon
            .stub(service['turnManager'], 'removeTilesFromPlayerTemporary')
            .callsFake(() => {
                return;
            });

        clientSocket.emit('removeLetters', JSON.stringify(specConstants.WORD_REQUEST_LOBBY_UNDEFINED));
        setTimeout(() => {
            expect(getLobbyStub.notCalled);
            expect(removeTilesFromPlayerTemporaryStub.notCalled);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('giveBackLetters should call getLobby and giveBackTilesOfPlayer', (done: Mocha.Done) => {
        Sinon.stub(service['lobbyManager'], 'createLobby').returns(specConstants.EXPECTED_LOBBY);
        clientSocket.emit('createLobby', JSON.stringify(specConstants.LOBBY_INFO));
        const emitCurrentLobbySpy: sinon.SinonSpy<unknown[], any> = sinon.spy<any>(service['emitCurrentLobbyState']);
        const getLobbyStub: sinon.SinonStub<[lobbyId: string], MultiplayerLobby | undefined> = sinon
            .stub(service['lobbyManager'], 'getLobby')
            .callsFake(() => {
                return specConstants.EXPECTED_LOBBY;
            });
        const giveBackTilesOfPlayerStub: sinon.SinonStub<[lobby: MultiplayerLobby, word: string], void> = sinon
            .stub(service['turnManager'], 'giveBackTilesOfPlayer')
            .callsFake(() => {
                return;
            });

        clientSocket.emit('giveBackLetters', JSON.stringify(specConstants.WORD_REQUEST));
        setTimeout(() => {
            expect(getLobbyStub.calledWith(specConstants.WORD_REQUEST.lobbyId));
            expect(giveBackTilesOfPlayerStub.calledWith(specConstants.EXPECTED_LOBBY, specConstants.WORD_REQUEST.word));
            expect(emitCurrentLobbySpy.calledWith(specConstants.EXPECTED_LOBBY));
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('giveBackLetters should not call getLobby and giveBackTilesOfPlayer if wordRequest.lobbyId is undefined', (done: Mocha.Done) => {
        Sinon.stub(service['lobbyManager'], 'createLobby').returns(specConstants.EXPECTED_LOBBY);
        clientSocket.emit('createLobby', JSON.stringify(specConstants.LOBBY_INFO));
        const emitCurrentLobbySpy: sinon.SinonSpy<unknown[], any> = sinon.spy<any>(service['emitCurrentLobbyState']);
        const getLobbyStub: sinon.SinonStub<[lobbyId: string], MultiplayerLobby | undefined> = sinon.stub(service['lobbyManager'], 'getLobby');
        const giveBackTilesOfPlayerStub: sinon.SinonStub<[lobby: MultiplayerLobby, word: string], void> = sinon.stub(
            service['turnManager'],
            'giveBackTilesOfPlayer',
        );

        clientSocket.emit('giveBackLetters', JSON.stringify(specConstants.WORD_REQUEST_LOBBY_UNDEFINED));
        setTimeout(() => {
            expect(specConstants.WORD_REQUEST_LOBBY_UNDEFINED.lobbyId).to.equal(undefined);
            expect(getLobbyStub.notCalled);
            expect(giveBackTilesOfPlayerStub.notCalled);
            expect(emitCurrentLobbySpy.notCalled);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('on exchangeLetters should be called', (done: Mocha.Done) => {
        specConstants.EXPECTED_LOBBY.letterBag = new LetterBag();
        Sinon.stub(service['lobbyManager'], 'createLobby').returns(specConstants.EXPECTED_LOBBY);
        const spyEmitCurrentLobby: sinon.SinonSpy<[lobby: MultiplayerLobby], void> = sinon.spy(service['emitCurrentLobbyState']);
        const spyExchangeLetters: sinon.SinonSpy<[lobby: MultiplayerLobby, player: Player, letters: string], string> = sinon.spy(
            service['lobbyManager'],
            'exchangeLetter',
        );
        const lettersToExchange = 'xyz';
        Sinon.stub(service['lobbyManager'], 'getLobby').returns(specConstants.EXPECTED_LOBBY);
        clientSocket.emit('exchangeLetter', JSON.stringify([lettersToExchange, specConstants.LOBBY_INFO.lobbyId]));
        setTimeout(() => {
            expect(spyEmitCurrentLobby.called);
            expect(spyExchangeLetters.called);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('exchangeLetter should call getActivePlayer, exchangeLetter and emitCurrentLobbyState,', (done: Mocha.Done) => {
        Sinon.stub(service['lobbyManager'], 'createLobby').returns(specConstants.EXPECTED_LOBBY);
        clientSocket.emit('createLobby', JSON.stringify(specConstants.LOBBY_INFO));
        const emitCurrentLobbySpy: sinon.SinonSpy<unknown[], any> = sinon.spy<any>(service['emitCurrentLobbyState']);
        const exchangeLetterStub: sinon.SinonStub<[lobby: MultiplayerLobby, player: Player, letters: string], string> = sinon
            .stub(service['lobbyManager'], 'exchangeLetter')
            .callsFake(() => {
                return '';
            });
        const getLobbyStub: sinon.SinonStub<[lobbyId: string], MultiplayerLobby | undefined> = sinon
            .stub(service['lobbyManager'], 'getLobby')
            .callsFake(() => {
                return specConstants.EXPECTED_LOBBY;
            });
        const getActivePlayerStub: sinon.SinonStub<[playerList: Player[]], Player | undefined> = sinon
            .stub(service['turnManager'], 'getActivePlayer')
            .callsFake(() => {
                return specConstants.ACTIVE_PLAYER;
            });

        clientSocket.emit('exchangeLetter', JSON.stringify([specConstants.LETTERS_TO_EXCHANGE, specConstants.EXPECTED_LOBBY.lobbyId]));
        setTimeout(() => {
            expect(getLobbyStub.calledWith(specConstants.WORD_REQUEST.lobbyId));
            expect(emitCurrentLobbySpy.calledWith(specConstants.EXPECTED_LOBBY));
            expect(getActivePlayerStub.called);
            expect(exchangeLetterStub.calledWith(specConstants.EXPECTED_LOBBY, specConstants.ACTIVE_PLAYER, specConstants.LETTERS_TO_EXCHANGE));
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('resignation should call getLobby', (done: Mocha.Done) => {
        const spy: sinon.SinonStub<[lobbyId: string], MultiplayerLobby | undefined> = Sinon.stub(service['lobbyManager'], 'getLobby').returns(
            specConstants.EXPECTED_LOBBY,
        );
        clientSocket.emit('resignation', JSON.stringify(specConstants.LOBBY_INFO));
        setTimeout(() => {
            expect(spy.called);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('getLetterBag should call getLobby', (done: Mocha.Done) => {
        const spy: sinon.SinonStub<[lobbyId: string], MultiplayerLobby | undefined> = Sinon.stub(service['lobbyManager'], 'getLobby').returns(
            specConstants.EXPECTED_LOBBY,
        );
        clientSocket.emit('getLetterBag', JSON.stringify([specConstants.EXPECTED_LOBBY.lobbyId, specConstants.ACTIVE_PLAYER.playerId]));
        setTimeout(() => {
            expect(spy.called);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('getIndice should call createGetIndiceMessage', (done: Mocha.Done) => {
        const spy = Sinon.stub(service['commandMessageCreatorService'], 'createGetIndiceBeginMessage').callsFake(() => {
            return CHAT_MESSAGE_EXCHANGE;
        });
        Sinon.stub(BoardAnalyzerService.prototype, 'calculateWordPossibilities').callsFake(async () => {
            return new Set();
        });
        Sinon.stub(service['lobbyManager'], 'getLobby').callsFake(() => {
            return specConstants.EXPECTED_LOBBY;
        });
        Sinon.stub(service, 'getWordValidatorOfLobby' as any).returns(new WordValidatorService(specConstants.DEFAULT_DICT));

        clientSocket.emit('getIndice', JSON.stringify([specConstants.EXPECTED_LOBBY.lobbyId, specConstants.ACTIVE_PLAYER.playerId, grid]));
        setTimeout(() => {
            expect(spy.called);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('getIndice should not call createGetIndiceMessage if lobby is undefined', (done: Mocha.Done) => {
        const spy = Sinon.stub(service['commandMessageCreatorService'], 'createGetIndiceBeginMessage').callsFake(() => {
            return CHAT_MESSAGE_EXCHANGE;
        });
        Sinon.stub(BoardAnalyzerService.prototype, 'calculateWordPossibilities').callsFake(async () => {
            return new Set();
        });
        Sinon.stub(service, 'getWordValidatorOfLobby' as any).returns(new WordValidatorService(specConstants.DEFAULT_DICT));

        clientSocket.emit('getIndice', JSON.stringify([specConstants.INVALID_LOBBY, specConstants.ACTIVE_PLAYER.playerId, grid]));
        setTimeout(() => {
            expect(spy.called);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('getIndice should call createGetIndiceMessage', (done: Mocha.Done) => {
        const spy = Sinon.stub(service['commandMessageCreatorService'], 'createGetIndiceBeginMessage').callsFake(() => {
            return CHAT_MESSAGE_EXCHANGE;
        });
        Sinon.stub(BoardAnalyzerService.prototype, 'calculateWordPossibilities').callsFake(async () => {
            return new Set();
        });
        Sinon.stub(service['lobbyManager'], 'getLobby').callsFake(() => {
            return specConstants.EXPECTED_LOBBY;
        });

        Sinon.stub(service, 'getWordValidatorOfLobby' as any).returns(new WordValidatorService(specConstants.DEFAULT_DICT));

        clientSocket.emit('getIndice', JSON.stringify([specConstants.EXPECTED_LOBBY.lobbyId, specConstants.ACTIVE_PLAYER.playerId, grid]));
        setTimeout(() => {
            expect(spy.called);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('turnSwitched should call emitCurrentLobbyState and emit if endGame false', () => {
        const emitSpy: sinon.SinonSpy<[ev: string, ...args: any[]], boolean> = sinon.spy(service['sio'].sockets, 'emit');
        Sinon.stub(service['turnManager'], 'isGameEnd').returns(false);
        const emitCurrentSpy: sinon.SinonSpy<unknown[], any> = sinon.spy<any>(service['emitCurrentLobbyState']);
        service['turnSwitched'](specConstants.EXPECTED_LOBBY);
        expect(emitSpy.called);
        expect(emitCurrentSpy.called);
    });

    it('turnSwitched should call emitEndGame and messageEndGame if endGame true', () => {
        Sinon.stub(service['turnManager'], 'isGameEnd').returns(true);
        const emitEndGamespy: sinon.SinonStub<[lobby: MultiplayerLobby, messages: string[]], void> = Sinon.stub(service, 'emitEndGame').callsFake(
            () => {
                return;
            },
        );
        const messageSpy: sinon.SinonStub<[lobby: MultiplayerLobby], string> = Sinon.stub(service['turnManager'], 'messageEndGame').callsFake(() => {
            return '';
        });
        const emitCurrentSpy: sinon.SinonSpy<unknown[], any> = sinon.spy<any>(service['emitCurrentLobbyState']);
        service['turnSwitched'](specConstants.EXPECTED_LOBBY);
        expect(emitCurrentSpy.called);
        expect(emitEndGamespy.called);
        expect(messageSpy.called);
    });

    it('should emit a dialogBox event and gameEnded event', () => {
        Sinon.stub(service['commandMessageCreatorService'], 'createEndGameEaselMessage').returns({} as ChatMessage);
        const emitSpy: sinon.SinonSpy<[ev: string, ...args: any[]], boolean> = sinon.spy(service['sio'].sockets, 'emit');
        service.emitEndGame(specConstants.EXPECTED_LOBBY, ['']);
        expect(emitSpy.calledOnceWith('dialogBox', {} as ChatMessage));
        expect(emitSpy.calledOnceWith('gameEnded', ''));
    });

    it('updatePlayerEasel should call lobbyManager.setPlayerEasel', (done: Mocha.Done) => {
        const spy: sinon.SinonStub<[lobbyId: string, playerID: string, tiles: Tile[]], void> = Sinon.stub(service['lobbyManager'], 'setPlayerEasel');
        clientSocket.emit('updatePlayerEasel', JSON.stringify(['', '', [] as Tile[]]));
        setTimeout(() => {
            expect(spy.called);
            done();
        }, serviceConstants.RESPONSE_DELAY);
    });

    it('should return a wordValidatorService', () => {
        expect(typeof service['getWordValidatorOfLobby'](specConstants.EXPECTED_LOBBY)).to.equal(typeof WordValidatorService.prototype);
    });
});
