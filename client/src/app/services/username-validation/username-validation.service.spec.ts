import { TestBed } from '@angular/core/testing';
import { SocketClientServiceMock } from '@app/classes/socket-client-test-helper';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { LOBBY_MOCK } from '@app/pages/join-multiplayer-page/join-multiplayer-page.component.constants';
import { PLAYER_IS_NOT_TURN } from '@app/services/game-manager/game-manager.service.spec.constants';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Socket } from 'socket.io-client/build/esm/socket';
import { UsernameValidationService } from './username-validation.service';
import * as specConstants from './username-validation.service.spec.constants';

describe('UsernameValidationService', () => {
    let service: UsernameValidationService;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;
    let playerManagementServiceSpy: jasmine.SpyObj<PlayerManagementService>;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        playerManagementServiceSpy = jasmine.createSpyObj('PlayerManagementService', [], {
            lobbyInfo: LOBBY_MOCK,
            currentPlayer: PLAYER_IS_NOT_TURN,
        });

        await TestBed.configureTestingModule({
            providers: [
                { provide: SocketClientService, useValue: socketServiceMock },
                { provide: PlayerManagementService, useValue: playerManagementServiceSpy },
            ],
        }).compileComponents();
        service = TestBed.inject(UsernameValidationService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('configureSocket should call on of socketClient', () => {
        const onSpy = spyOn(socketServiceMock, 'on');
        service.configureBaseSocketFeatures();
        expect(onSpy).toHaveBeenCalled();
    });

    it('should return false for each invalid username', () => {
        for (const username of specConstants.INVALID_USERNAME) expect(service.isValidUsername(username)).toEqual(false);
    });

    it('should return false for each invalid username', () => {
        for (const username of specConstants.VALID_USERNAME) expect(service.isValidUsername(username)).toEqual(true);
    });

    describe('Receiving events', () => {
        it('sameUsername should set isSameUsername to true', () => {
            service.isSameUsername = false;
            socketHelper.peerSideEmit('sameUsername');
            expect(service.isSameUsername).toBeTruthy();
        });

        it("ejectedFromLobby should set isEjectedFromLobby to true and call send if i'm not the host", () => {
            const sendSpy = spyOn(socketServiceMock, 'send');
            service.isEjectedFromLobby = false;
            socketHelper.peerSideEmit('ejectedFromLobby');
            expect(service.isEjectedFromLobby).toBeTruthy();
            expect(sendSpy).toHaveBeenCalled();
        });
    });
});
