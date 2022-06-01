/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MultiplayerLobby } from '@app/../../../common/model/lobby';
import { Player } from '@app/../../../common/model/player';
import { Tile } from '@app/../../../common/model/tile';
import { SocketClientServiceMock } from '@app/classes/socket-client-test-helper';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { EndGameService } from '@app/services/end-game/end-game.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Socket } from 'socket.io-client';
import { PlayerManagementService } from './player-management.service';
import * as specConstants from './player-management.service.spec.constants';
import SpyObj = jasmine.SpyObj;

describe('PlayerManagementService', () => {
    let service: PlayerManagementService;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;
    let routerSpy: SpyObj<Router>;
    let endGameServiceSpy: SpyObj<EndGameService>;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        endGameServiceSpy = jasmine.createSpyObj('EndGameService', ['setEndGameInformations'], {
            isEndGame: false,
            currentPlayer: specConstants.MY_PLAYER,
            opponentPlayer: specConstants.PLAYER2,
        });

        await TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [],
            providers: [
                { provide: SocketClientService, useValue: socketServiceMock },
                { provide: Router, useValue: routerSpy },
                { provide: EndGameService, useValue: endGameServiceSpy },
            ],
        }).compileComponents();
        service = TestBed.inject(PlayerManagementService);
        service['myPlayer'] = specConstants.INFO_LOBBY_MOCK.player;
        service.configureBaseSocketFeatures();
        routerSpy.navigate.and.stub();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get the id of the socket', () => {
        socketServiceMock.socket.id = '123';
        const socketId = service.socketId;
        expect(socketId).toEqual('123');
    });

    it('should get empty string of the socket if not init', () => {
        const socketId = service.socketId;
        expect(socketId).toEqual('');
    });

    it('should get the lobbyInfo of player', () => {
        service.myLobby = specConstants.LOBBY_MOCK;
        const receivedInfo = service.lobbyInfo;
        expect(receivedInfo).toEqual(specConstants.LOBBY_MOCK);
    });

    it('initializePlayerData should call this.configureBaseSocketFeatures', () => {
        const configSpy = spyOn(service, 'configureBaseSocketFeatures').and.callThrough();
        service.initializePlayerData(specConstants.INFO_LOBBY_MOCK.player);
        expect(configSpy).toHaveBeenCalled();
    });

    it('should send an event if the lobby exists for redirectGame call', () => {
        service.myLobby = specConstants.LOBBY_MOCK;
        const sendSpy = spyOn(service['socketService'], 'send').and.callThrough();
        service.redirectGame();
        expect(sendSpy).toHaveBeenCalled();
    });

    it('should not send an event if no lobby for redirectGame call', () => {
        const sendSpy = spyOn(service['socketService'], 'send').and.callThrough();
        service.redirectGame();
        expect(sendSpy).not.toHaveBeenCalled();
    });

    it('should send an event if the lobby exists for getAvailableLobbies call', () => {
        const sendSpy = spyOn(service['socketService'], 'send').and.callThrough();
        service.getAvailableLobbies();
        expect(sendSpy).toHaveBeenCalled();
    });

    it('should return empty list if  getAvailablelobbies call on empty list', () => {
        expect(service.getAvailableLobbies()).toEqual([]);
    });

    it('should return list if  getAvailablelobbies call', () => {
        service.optionLobbies = [specConstants.LOBBY_MOCK];
        expect(service.getAvailableLobbies()).toEqual([specConstants.LOBBY_MOCK]);
    });

    it('should send an event if the lobby exists for joinLobby call', () => {
        const sendSpy = spyOn(service['socketService'], 'send').and.callThrough();
        service.joinLobby(specConstants.LOBBY_MOCK.lobbyId);
        expect(sendSpy).toHaveBeenCalled();
    });

    it('cancelGame should call send of socketService and navigate of router', () => {
        service.myLobby = specConstants.LOBBY_MOCK;
        const sendSpy = spyOn(service['socketService'], 'send');
        service.cancelGame();
        expect(sendSpy).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalled();
    });

    it('cancelJoin should call send of socketService', () => {
        service.myLobby = specConstants.LOBBY_MOCK;
        const sendSpy = spyOn(service['socketService'], 'send');
        service.cancelJoin();
        expect(sendSpy).toHaveBeenCalled();
    });

    it('should send createLobby if the lobby exists for createLobby call', () => {
        const sendSpy = spyOn(service['socketService'], 'send').and.callThrough();
        service.createLobby(specConstants.LOBBY_MOCK.lobbyType);
        expect(sendSpy).toHaveBeenCalledWith('createLobby', service['myLobbyInfo']);
    });

    it('updatePlayerEasel should send socket updatePlayerEasel', () => {
        const tiles = [] as Tile[];
        service.myLobby = {} as MultiplayerLobby;
        const sendSpy = spyOn(service['socketService'], 'send').and.callThrough();
        service.updatePlayerEasel(tiles);
        expect(sendSpy).toHaveBeenCalledWith('updatePlayerEasel', [service.myLobby.lobbyId, service.currentPlayer.playerId, tiles]);
    });

    it('connect should not call this.configureBaseSocketFeatures if alive socket', () => {
        spyOn(socketServiceMock, 'isSocketAlive').and.returnValue(true);
        const connectSpy = spyOn(socketServiceMock, 'connect').and.callThrough();
        service.initializePlayerData(specConstants.INFO_LOBBY_MOCK.player);
        expect(connectSpy).not.toHaveBeenCalled();
    });

    it('activePlayer should return player with isTurn true', () => {
        service.myLobby = specConstants.LOBBY_MOCK;
        expect(service.activePlayer).toEqual(specConstants.MY_PLAYER);
    });

    it('hostPlayer should return the host player', () => {
        service.myLobby = specConstants.LOBBY_MOCK;
        const playerReceived: Player | undefined = service.hostPlayer;
        expect(playerReceived).toBe(specConstants.MY_PLAYER);
    });

    it('currentPlayer should return myPlayer and call updateCurrentPlayerInfo', () => {
        const receivedPLayer = service.currentPlayer;
        expect(receivedPLayer).toEqual(specConstants.INFO_LOBBY_MOCK.player);
    });

    it('opponentPlayer should return opponent player from lobby', () => {
        service.myLobby = specConstants.LOBBY_MOCK;
        expect(service.opponentPlayer).toEqual(specConstants.PLAYER2);
    });

    it('addVirtualPlayer should set the virtualPlayer of lobbyInfo', () => {
        service.addVirtualPlayer(specConstants.VIRTUAL_PLAYER);
        expect(service['myLobbyInfo'].virtualPlayer).toEqual(specConstants.VIRTUAL_PLAYER);
    });

    it('addVirtualPlayer should call send of socketClient', () => {
        const sendSpy = spyOn(socketServiceMock, 'send');
        service.addVirtualPlayer(specConstants.VIRTUAL_PLAYER);
        expect(sendSpy).toHaveBeenCalled();
    });

    it('sendResignation should call send of socketClient', () => {
        Object.defineProperty(service, 'socketId', { value: socketServiceMock.socket.id });
        service.myLobby = specConstants.LOBBY_MOCK;
        service.myLobby.playerList[0].playerId = socketServiceMock.socket.id;
        const sendSpy = spyOn(socketServiceMock, 'send');
        service.sendResignation();
        expect(sendSpy).toHaveBeenCalledWith('resignation', specConstants.LOBBY_MOCK.lobbyId);
    });

    describe('Receiving events', () => {
        it('should receive lobby from event player id and call updateCurrentPLayer', () => {
            const updateSpy = spyOn(service, 'updateCurrentPlayerInfo' as never);
            socketHelper.peerSideEmit(specConstants.INFO_LOBBY_MOCK.player.playerId, specConstants.LOBBY_MOCK);
            expect(service.myLobby).toEqual(specConstants.LOBBY_MOCK);
            expect(updateSpy).toHaveBeenCalled();
        });

        it('should receive lobby from event lobbyExistence', () => {
            service.myLobby = specConstants.LOBBY_MOCK;
            socketHelper.peerSideEmit('lobbyExistence', specConstants.LOBBY_MOCK);
            socketHelper.peerSideEmit(specConstants.LOBBY_MOCK.lobbyId);
            expect(service.myLobby).toEqual(specConstants.LOBBY_MOCK);
        });

        it('should receive not lobby from event lobbyExistence if lobby does not exist', () => {
            socketHelper.peerSideEmit('lobbyExistence', specConstants.LOBBY_MOCK);
            socketHelper.peerSideEmit(specConstants.INFO_LOBBY_MOCK.lobbyId);
            expect(service.myLobby).toBeUndefined();
        });

        it('should redirect to received link', () => {
            service.myLobby = specConstants.LOBBY_MOCK;
            routerSpy.navigate.and.stub();
            socketHelper.peerSideEmit('redirect', '/game/1');
            expect(routerSpy.navigate).toHaveBeenCalled();
        });

        it('should receive lobbies from availableLobbies event', () => {
            socketHelper.peerSideEmit('availableLobbies', [specConstants.LOBBY_MOCK]);
            expect(service.optionLobbies).toEqual([specConstants.LOBBY_MOCK]);
        });

        it('should send lobbies to the player waiting for lobbies', () => {
            socketHelper.peerSideEmit(specConstants.INFO_LOBBY_MOCK.player.playerId, [specConstants.LOBBY_MOCK]);
            expect(service.optionLobbies).toEqual([specConstants.LOBBY_MOCK]);
        });

        it('should call setEndGameInformations from endGameService when receiving gameEnded', async () => {
            endGameServiceSpy.setEndGameInformations.and.stub();
            spyOnProperty(service, 'currentPlayer').and.returnValue(specConstants.MY_PLAYER);
            spyOnProperty(service, 'opponentPlayer').and.returnValue(specConstants.PLAYER2);
            socketHelper.peerSideEmit('gameEnded');
            expect(endGameServiceSpy.setEndGameInformations).toHaveBeenCalled();
        });
    });
});
