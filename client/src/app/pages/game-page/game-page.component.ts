import { Component } from '@angular/core';
import { DataPassingService } from '@app/services/data-passing/data-passing.service';
import { GameManagerService } from '@app/services/game-manager/game-manager.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(private readonly gameManager: GameManagerService, private readonly data: DataPassingService) {
        this.gameManager.lobbyId = this.data.lobbyId;
        this.gameManager.connect();
    }
}
