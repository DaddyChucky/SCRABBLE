import { Component } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { ViewService } from '@app/services/view/view.service';
import * as componentConstants from './timer.component.constants';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {
    timer: number;
    lobbyId: string;

    constructor(private readonly socketService: SocketClientService, private readonly timerService: ViewService) {
        this.timer = this.timerValue;
        this.lobbyId = componentConstants.INITIAL_LOBBY_ID;
    }

    get socketId(): string {
        return this.socketService.socket.id ? this.socketService.socket.id : componentConstants.NO_SOCKET_ID;
    }

    get timerValue(): number {
        return this.timerService.timer;
    }

    get isTimerAlmostOver(): string {
        return this.timerValue < componentConstants.ALMOST_OVER_TIMER_VALUE ? componentConstants.CLASS_TIMER_IS_ALMOST_UP : '';
    }
}
