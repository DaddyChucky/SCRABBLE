/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TIMER_INITIAL_VALUE } from '@app/../../../common/model/constants';
import { DirectionType } from '@app/../../../common/model/direction-type';
import { ScrabbleGrid } from '@app/../../../common/model/scrabble-grid';
import { Tile } from '@app/../../../common/model/tile';
import { WordRequest } from '@app/../../../common/model/word-request';
import { WordValidation } from '@app/../../../common/model/word-validation';
import { CHAT_MESSAGE_MAX_LENGTH, MIDDLE_SQUARE_POSITION } from '@app/classes/constants';
import { LetterBagServiceMock } from '@app/classes/letter-bag-mock';
import { SocketClientServiceMock } from '@app/classes/socket-client-test-helper';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { ViewServiceMock } from '@app/classes/timer-mock';
import { DialogBoxService } from '@app/services/dialog-box/dialog-box.service';
import { MESSAGE_FROM_PLAYER } from '@app/services/dialog-box/dialog-box.service.spec.constants';
import { EaselService } from '@app/services/easel/easel.service';
import { GameManagerService } from '@app/services/game-manager/game-manager.service';
import { GridService } from '@app/services/grid/grid.service';
import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import { PlaceLettersService } from '@app/services/place-letters/place-letters.service';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { ViewService } from '@app/services/view/view.service';
import { Socket } from 'socket.io-client';
import * as serviceConstants from './game-manager.service.constants';
import * as specConstants from './game-manager.service.spec.constants';

describe('GameManagerService', () => {
    let service: GameManagerService;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;
    let playerManagementServiceSpy: jasmine.SpyObj<PlayerManagementService>;
    let timerMock: ViewServiceMock;
    let letterBagMock: LetterBagServiceMock;
    let dialogueSpy: jasmine.SpyObj<DialogBoxService>;
    let gridSpy: jasmine.SpyObj<GridService>;
    let placeLettersServiceSpy: jasmine.SpyObj<PlaceLettersService>;
    let easelServiceSpy: jasmine.SpyObj<EaselService>;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        timerMock = new ViewServiceMock();
        letterBagMock = new LetterBagServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        dialogueSpy = jasmine.createSpyObj(
            'DialogBoxService',
            [
                'determineUserType',
                'addMessageToDialogBox',
                'sendTurnMessage',
                'createValidCommandMessage',
                'sendSkipCommand',
                'verificationTypeMessage',
            ],
            {
                maxLengthOfInput: CHAT_MESSAGE_MAX_LENGTH,
                chatMessages: [],
            },
        );
        easelServiceSpy = jasmine.createSpyObj('EaselService', ['emptyLettersToExchange'], {});
        gridSpy = jasmine.createSpyObj('GridService', ['addTilesObservable', 'removeTilesObservable', 'convertStringWordToTiles'], {});
        playerManagementServiceSpy = jasmine.createSpyObj<any>('PlayerManagementService', ['updateCurrentPlayerInfo'], {
            currentPlayer: specConstants.DEFAULT_PLAYER_STUB,
            activePlayer: specConstants.PLAYER_IS_TURN,
            hostPlayer: specConstants.PLAYER_IS_TURN,
        });
        placeLettersServiceSpy = jasmine.createSpyObj<any>('PlaceLettersService', ['cancelPlaceCommand', 'hasAddedTilesToGrid'], {
            placeCommand: specConstants.PLACE_COMMAND,
            tilesAddedToGrid: [],
        });
        await TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [],
            providers: [
                { provide: SocketClientService, useValue: socketServiceMock },
                { provide: PlayerManagementService, useValue: playerManagementServiceSpy },
                { provide: ViewService, useValue: timerMock },
                { provide: LetterBagService, useValue: letterBagMock },
                { provide: DialogBoxService, useValue: dialogueSpy },
                { provide: GridService, useValue: gridSpy },
                { provide: PlaceLettersService, useValue: placeLettersServiceSpy },
                { provide: EaselService, useValue: easelServiceSpy },
            ],
        }).compileComponents();
        service = TestBed.inject(GameManagerService);
        service.connect();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('startPlayerTurn should call sendStartTimer() and sendDialogBoxMessage()', () => {
        service.multiplayerLobby = specConstants.LOBBY_MOCK_NEW_VALUE;
        spyOn<any>(service, 'isSoloGame').and.returnValue(false);
        const sendStartTimerSpy: jasmine.Spy<any> = spyOn<any>(service, 'sendStartTimer');
        service.startPlayerTurn();
        expect(sendStartTimerSpy).toHaveBeenCalled();
        expect(dialogueSpy.sendTurnMessage).toHaveBeenCalled();
    });

    it('startPlayerTurn should call send of socketService if isSoloGame', () => {
        service.multiplayerLobby = specConstants.LOBBY_MOCK_NEW_VALUE;
        const isSoloGamerSpy: jasmine.Spy<any> = spyOn<any>(service, 'isSoloGame').and.returnValue(true);
        const socketServiceSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(socketServiceMock, 'send');
        service.startPlayerTurn();
        expect(isSoloGamerSpy).toHaveBeenCalled();
        expect(socketServiceSpy).toHaveBeenCalled();
    });

    it('sendStartTimer should call send of socketService', () => {
        const sendSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(socketServiceMock, 'send');
        service['sendStartTimer']();
        expect(sendSpy).toHaveBeenCalledWith('startTimer', service.multiplayerLobby);
    });

    it('passTurn should use activePlayer from player info and sendSkipCommand from dialogService', () => {
        service.multiplayerLobby = specConstants.LOBBY_MOCK_INITIAL;
        socketServiceMock.socket.id = specConstants.PLAYER_IS_TURN.playerId;
        service.passTurn();
        expect(playerManagementServiceSpy.activePlayer).toEqual(specConstants.PLAYER_IS_TURN);
        expect(dialogueSpy.sendSkipCommand).toHaveBeenCalled();
    });

    it('setUpGame should call send from socketClientService', () => {
        service.lobbyId = 'idExist';
        socketServiceMock.socket.id = specConstants.PLAYER_IS_TURN.playerId;
        const socketServiceSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(socketServiceMock, 'send');
        service.setUpGame();
        expect(socketServiceSpy).toHaveBeenCalled();
    });

    it("setUpGame shouldn't call send from socketClientService if lobbyId not set", () => {
        const socketServiceSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(socketServiceMock, 'send');
        service.setUpGame();
        expect(socketServiceSpy).not.toHaveBeenCalled();
    });

    it("setUpGame shouldn't call send from socketClientService if host.playerId !== socketId", () => {
        service.lobbyId = 'idExist';
        socketServiceMock.socket.id = specConstants.PLAYER_IS_NOT_TURN.playerId;
        const socketServiceSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(socketServiceMock, 'send');
        service.setUpGame();
        expect(socketServiceSpy).not.toHaveBeenCalled();
    });

    it('isCurrentPlayer should return true if playerIsTurn id = socketId', () => {
        socketServiceMock.socket.id = specConstants.PLAYER_IS_TURN.playerId;
        const boolValue: boolean = service.isCurrentPlayer([specConstants.PLAYER_IS_TURN, specConstants.PLAYER_IS_NOT_TURN]);
        expect(boolValue).toBe(true);
    });

    it('isCurrentPlayer should return false if playerIsTurn id != socketId', () => {
        socketServiceMock.socket.id = specConstants.PLAYER_IS_NOT_TURN.playerId;
        const boolValue: boolean = service.isCurrentPlayer([specConstants.PLAYER_IS_TURN, specConstants.PLAYER_IS_NOT_TURN]);
        expect(boolValue).toBe(false);
    });

    it('isSoloGame should return true if one player have id = virtual_player', () => {
        service.multiplayerLobby.playerList = [specConstants.PLAYER_IS_TURN, specConstants.VIRTUAL_PLAYER];
        expect(service['isSoloGame']()).toBeTruthy();
    });

    it('isSoloGame should return false if none of the player have id = virtual_player', () => {
        service.multiplayerLobby.playerList = [specConstants.PLAYER_IS_TURN, specConstants.PLAYER_IS_NOT_TURN];
        expect(service['isSoloGame']()).toBeFalsy();
    });

    describe('connect function interactions', () => {
        it('connect should call timerConfigureBaseSocketFeatures', () => {
            const timerConfigSpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'timerConfigureBaseSocketFeatures').and.stub();
            service.connect();
            expect(timerConfigSpy).toHaveBeenCalled();
        });

        it('connect should call dialogConfigureBaseSocketFeatures', () => {
            const dialogConfigSpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'dialogConfigureBaseSocketFeatures').and.stub();
            service.connect();
            expect(dialogConfigSpy).toHaveBeenCalled();
        });

        it('connect should call informationConfigureBaseSocketFeatures', () => {
            const infoConfigSpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'informationConfigureBaseSocketFeatures').and.stub();
            service.connect();
            expect(infoConfigSpy).toHaveBeenCalled();
        });
    });

    describe('Receiving events', () => {
        it('should receive a timer value from timer event', () => {
            socketHelper.peerSideEmit('timer', TIMER_INITIAL_VALUE);
            expect(service['timerService'].timer).toEqual(TIMER_INITIAL_VALUE);
        });

        it('should send back passturn if receive a timer value <= 0 from timer event', () => {
            const socketServiceSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(socketServiceMock, 'send');
            socketHelper.peerSideEmit('timer', 0);
            expect(socketServiceSpy).toHaveBeenCalled();
        });

        it("Receiving 'startPlayerTurn' should call startPlayerTurn() if isSoloGame true", () => {
            const isSoloGamerSpy: jasmine.Spy<any> = spyOn<any>(service, 'isSoloGame').and.returnValue(true);
            const isCurrentPlayerSpy = spyOn(service, 'isCurrentPlayer').and.returnValue(false);
            const spyStartPlayerTurn: jasmine.Spy<() => void> = spyOn(service, 'startPlayerTurn');
            service.informationConfigureBaseSocketFeatures();
            socketHelper.peerSideEmit('startPlayerTurn');
            expect(spyStartPlayerTurn).toHaveBeenCalled();
            expect(isSoloGamerSpy).toHaveBeenCalled();
            expect(isCurrentPlayerSpy).toHaveBeenCalled();
        });

        it("Receiving 'startPlayerTurn' should call startPlayerTurn() is isCurrentPLayer true", () => {
            const isCurrentPlayerSpy = spyOn(service, 'isCurrentPlayer').and.returnValue(true);
            const spyStartPlayerTurn: jasmine.Spy<() => void> = spyOn(service, 'startPlayerTurn');
            service.informationConfigureBaseSocketFeatures();
            socketHelper.peerSideEmit('startPlayerTurn');
            expect(spyStartPlayerTurn).toHaveBeenCalled();
            expect(isCurrentPlayerSpy).toHaveBeenCalled();
        });

        it('Receiving lobby.id should call setPLayer form playerInfo and startPlayerTurn', () => {
            service.lobbyId = specConstants.DEFAULT_LOBBY_ID;
            service.informationConfigureBaseSocketFeatures();
            socketHelper.peerSideEmit(specConstants.DEFAULT_LOBBY_ID, specConstants.LOBBY_MOCK_INITIAL);
            expect(service.multiplayerLobby).toEqual(specConstants.LOBBY_MOCK_INITIAL);
        });

        it('Receiving lobby.id should call cancelPlaceCommand if hasAddedTilesToGrid is true', () => {
            placeLettersServiceSpy.hasAddedTilesToGrid.and.stub().and.returnValue(true);
            service.lobbyId = specConstants.DEFAULT_LOBBY_ID;
            service.informationConfigureBaseSocketFeatures();
            socketHelper.peerSideEmit(specConstants.DEFAULT_LOBBY_ID, specConstants.LOBBY_MOCK_INITIAL);
            expect(service.multiplayerLobby).toEqual(specConstants.LOBBY_MOCK_INITIAL);
            expect(placeLettersServiceSpy.cancelPlaceCommand).toHaveBeenCalled();
        });

        it('should call dialogService from dialogBox event', () => {
            socketHelper.peerSideEmit('dialogBox', MESSAGE_FROM_PLAYER);
            expect(dialogueSpy.addMessageToDialogBox).toHaveBeenCalledWith(MESSAGE_FROM_PLAYER);
            expect(dialogueSpy.determineUserType).toHaveBeenCalledWith(MESSAGE_FROM_PLAYER);
        });

        it('should call addTilesObservable from dialogBox event', () => {
            socketHelper.peerSideEmit('isInDict', specConstants.WORD_VALIDATION);
            expect(gridSpy.addTilesObservable).toHaveBeenCalled();
        });

        it('commandOfVirtualPlayer should call verificationTypeMessage from dialogService', () => {
            socketHelper.peerSideEmit('commandOfVirtualPlayer', JSON.stringify(serviceConstants.SKIP_COMMAND_MESSAGE));
            expect(dialogueSpy.verificationTypeMessage).toHaveBeenCalled();
        });

        it('should call removeTilesObservable from dialogBox event', (done) => {
            const wordValidation: WordValidation = specConstants.WORD_VALIDATION;
            wordValidation.parsedInfo = {
                lobbyId: specConstants.DEFAULT_LOBBY_ID,
                scrabbleGrid: { elements: [] } as ScrabbleGrid,
                lettersCommand: 'placer',
                position: MIDDLE_SQUARE_POSITION,
                direction: DirectionType.HORIZONTAL,
            };
            socketHelper.peerSideEmit('isNotInDict', wordValidation);
            expect(gridSpy.addTilesObservable).toHaveBeenCalled();
            setTimeout(() => {
                expect(gridSpy.removeTilesObservable).toHaveBeenCalled();
                done();
            }, serviceConstants.WAIT_TIME_TO_REMOVE_TILES);
        });

        it('should call addTilesObservable from updateGridView event', () => {
            const wordRequest: WordRequest = {
                lobbyId: 'this.lobbyInfo.lobbyId',
                socketId: 'this.socketService.socket.id',
                word: 'salut',
                startPosition: MIDDLE_SQUARE_POSITION,
                direction: DirectionType.HORIZONTAL,
                tiles: [new Tile(MIDDLE_SQUARE_POSITION, 'A', 1)],
            } as WordRequest;
            socketHelper.peerSideEmit('updateGridView', wordRequest);
            expect(gridSpy.addTilesObservable).toHaveBeenCalled();
        });
    });
});
