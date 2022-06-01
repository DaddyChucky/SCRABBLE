import { Component, OnInit } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { STORAGE_SOCKET_ID } from '@app/services/socket-client/socket-client.service.constants';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(private readonly socketService: SocketClientService) {}

    ngOnInit(): void {
        if (!this.socketService.isSocketAlive()) {
            const idOldSocket: string | null = window.localStorage.getItem(STORAGE_SOCKET_ID);
            if (idOldSocket) {
                this.socketService.reconnect(idOldSocket);
            } else this.socketService.connect();
        }
    }
}
