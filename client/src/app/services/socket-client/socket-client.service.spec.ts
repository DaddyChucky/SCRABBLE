import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { Socket } from 'socket.io-client';
import { SocketClientService } from './socket-client.service';
import * as serviceConstants from './socket-client.service.constants';
import * as specConstants from './socket-client.service.spec.constants';

describe('SocketClientService', () => {
    let service: SocketClientService;
    let event: string;
    let data: string | undefined;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SocketClientService);
        service.socket = new SocketTestHelper() as unknown as Socket;
        event = 'helloWorld';
        data = 'messageASend';
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('connect should set socket and call listenOnUnload', () => {
        const listenOnUnloadSpy = spyOn(service, 'listenOnUnload');
        service.connect();
        expect(service.socket).toBeTruthy();
        expect(listenOnUnloadSpy).toHaveBeenCalled();
    });

    it('listenOnUnload should call window.addEventListener', () => {
        const addEventListenerSpy = spyOn(window, 'addEventListener');
        service.listenOnUnload();
        expect(addEventListenerSpy).toHaveBeenCalled();
    });

    it('should disconnect', () => {
        const disconnectSpy = spyOn(service.socket, 'disconnect').and.callThrough();
        service.disconnect();
        expect(disconnectSpy).toHaveBeenCalled();
    });

    it('isSocketAlive should return true if the socket is still connected', () => {
        service.socket.connected = true;
        const isAlive = service.isSocketAlive();
        expect(isAlive).toBeTruthy();
    });

    it('isSocketAlive should return false if the socket is no longer connected', () => {
        service.socket.connected = false;
        const isAlive = service.isSocketAlive();
        expect(isAlive).toBeFalsy();
    });

    it('isSocketAlive should return false if the socket is not defined', () => {
        (service.socket as unknown) = undefined;
        const isAlive = service.isSocketAlive();
        expect(isAlive).toBeFalsy();
    });

    it('should call socket.on with an event', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- needed to simulate an action
        const action = () => {};
        const spy = spyOn(service.socket, 'on');
        service.on(event, action);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(event, action);
    });

    it('should call emit with data when using send', () => {
        const spy = spyOn(service.socket, 'emit');
        service.send(event, data);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(event, JSON.stringify(data));
    });

    it('should call emit without data when using send if data is undefined', () => {
        data = undefined;
        const spy = spyOn(service.socket, 'emit');
        service.send(event, data);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(event);
    });

    it('reconnect should call isSocketAlive and connect if false', () => {
        const isSocketAliveSpy = spyOn(service, 'isSocketAlive').and.returnValue(false);
        const connectSpy = spyOn(service, 'connect');
        service.reconnect(specConstants.FAKE_OLD_ID);
        expect(isSocketAliveSpy).toHaveBeenCalled();
        expect(connectSpy).toHaveBeenCalled();
    });

    it('reconnect should call send', (done) => {
        const sendSpy = spyOn(service, 'send');
        service.reconnect(specConstants.FAKE_OLD_ID);
        setTimeout(() => {
            expect(sendSpy).toHaveBeenCalled();
            done();
        }, serviceConstants.WAITING_TIME_TO_HAVE_SOCKETID);
    });
});
