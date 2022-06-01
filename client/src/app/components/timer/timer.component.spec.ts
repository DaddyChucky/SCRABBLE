import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TIMER_INITIAL_VALUE } from '@app/../../../common/model/constants';
import { SocketClientServiceMock } from '@app/classes/socket-client-test-helper';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { ViewServiceMock } from '@app/classes/timer-mock';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameManagerService } from '@app/services/game-manager/game-manager.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { ViewService } from '@app/services/view/view.service';
import { Socket } from 'socket.io-client';
import { TimerComponent } from './timer.component';
import { NO_SOCKET_ID } from './timer.component.constants';

describe('TimerComponent', () => {
    let component: TimerComponent;
    let fixture: ComponentFixture<TimerComponent>;
    let timerServiceMock: ViewServiceMock;
    let gameManagerServiceSpy: jasmine.SpyObj<GameManagerService>;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        timerServiceMock = new ViewServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        gameManagerServiceSpy = jasmine.createSpyObj(GameManagerService, ['startPlayerTurn']);
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [TimerComponent],
            providers: [
                { provide: ViewService, useValue: timerServiceMock },
                { provide: GameManagerService, useValue: gameManagerServiceSpy },
                { provide: SocketClientService, useValue: socketServiceMock },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TimerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get the id of the socket', () => {
        const expectedSocketId = 'lobbyb';
        socketServiceMock.socket.id = expectedSocketId;
        const socketId: string = component.socketId;
        expect(socketId).toEqual(expectedSocketId);
    });

    it('getter for socketId should return empty string if socketId is undefined', () => {
        socketServiceMock.socket.id = NO_SOCKET_ID;
        expect(component.socketId).toEqual(NO_SOCKET_ID);
    });

    it('should get the timerValue of the timer service', () => {
        const timerValue: number = component.timerValue;
        expect(timerValue).toEqual(TIMER_INITIAL_VALUE);
    });
});
