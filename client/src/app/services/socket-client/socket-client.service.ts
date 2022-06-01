import { Injectable } from '@angular/core';
import { environment } from '@app/../environments/environment';
import { io, Socket } from 'socket.io-client';
import * as serviceConstants from './socket-client.service.constants';

@Injectable({
    providedIn: 'root',
})
export class SocketClientService {
    socket: Socket;

    isSocketAlive(): boolean {
        return this.socket && this.socket.connected;
    }

    listenOnUnload(): void {
        window.addEventListener('beforeunload', () => {
            window.localStorage.setItem(serviceConstants.STORAGE_SOCKET_ID, this.socket.id);
            window.localStorage.setItem(serviceConstants.STORAGE_DATE_ID, JSON.stringify(new Date().getTime()));
        });
    }

    connect(): void {
        this.socket = io(environment.serverUrl, { transports: ['websocket'], upgrade: false });
        this.listenOnUnload();
    }

    disconnect(): void {
        this.socket.disconnect();
    }

    on<T>(event: string, action: (data: T) => void): void {
        this.socket.on(event, action);
    }

    send<T>(event: string, data?: T): void {
        if (data) {
            this.socket.emit(event, JSON.stringify(data));
        } else {
            this.socket.emit(event);
        }
    }

    reconnect(oldSocketId: string | null): void {
        if (oldSocketId && !this.isSocketAlive()) {
            this.connect();
        }
        setTimeout(() => {
            if (oldSocketId) {
                this.send('reconnection', [oldSocketId, this.socket.id]);
            }
        }, serviceConstants.WAITING_TIME_TO_HAVE_SOCKETID);
    }
}
