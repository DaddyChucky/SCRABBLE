import { Component, OnDestroy } from '@angular/core';
import { GameLog } from '@app/../../../common/model/game-log';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { AdminDatabaseLinkService } from '@app/services/admin-db-link/admin-db-link.service';
import { BehaviorSubject } from 'rxjs';
import * as componentConstants from './game-history.component.constants';

@Component({
    selector: 'app-game-history',
    templateUrl: './game-history.component.html',
    styleUrls: ['./game-history.component.scss'],
})
export class GameHistoryComponent implements OnDestroy {
    columnNames;
    gameLogs: BehaviorSubject<GameLog[]>;
    gameLogsValue: GameLog[];
    private isPollingNeeded: boolean;

    constructor(private readonly adminDbLink: AdminDatabaseLinkService) {
        this.columnNames = componentConstants.GAME_HISTORY_TABLE_COLUMNS;
        this.gameLogs = new BehaviorSubject<GameLog[]>([]);
        this.isPollingNeeded = true;
        this.adminDbLink.getGameLogs().subscribe(this.gameLogs);
        this.polling();
    }

    get isServerNotReady(): boolean {
        return this.gameLogsValue && !this.gameLogsValue.length;
    }

    getGameModeDisplay(gameMode: LobbyType): string {
        return gameMode === LobbyType.CLASSIC ? componentConstants.GAME_MODE_CLASSIC : componentConstants.GAME_MODE_LOG2990;
    }

    ngOnDestroy(): void {
        this.isPollingNeeded = false;
    }

    async polling(): Promise<void> {
        if (!this.isPollingNeeded) return;
        setTimeout(async () => this.polling(), componentConstants.INTERVAL_FOR_POLLING);
        this.gameLogs = new BehaviorSubject<GameLog[]>(this.gameLogs.getValue());
        this.adminDbLink.getGameLogs().subscribe(this.gameLogs);
        this.gameLogsValue = this.gameLogs.getValue();
        this.gameLogsValue.shift();
    }
}
