import { HttpException } from '@app/classes/http.exception';
import { DatabaseService } from '@app/services/database/database.service';
import { DATABASE_COLLECTION_GAMES_LOGS, DEFAULT_GAME_LOG } from '@app/services/database/database.service.constants';
import Types from '@app/types';
import { GameLog } from '@common/model/game-log';
import { MultiplayerLobby } from '@common/model/lobby';
import { Player } from '@common/model/player';
import { PlayerInfoLog } from '@common/model/player-info-log';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Collection } from 'mongodb';
import 'reflect-metadata';
import * as serviceConstants from './games-logs.services.constants';

@injectable()
export class GamesLogsService {
    private startingGameDate: Map<string, Date>;

    constructor(@inject(Types.DatabaseService) private readonly databaseService: DatabaseService) {
        this.startingGameDate = new Map<string, Date>();
    }

    get collectionGamesLogs(): Collection<GameLog> {
        return this.databaseService.database.collection(DATABASE_COLLECTION_GAMES_LOGS);
    }

    async getAllLogs(): Promise<GameLog[]> {
        return this.collectionGamesLogs
            .find({})
            .toArray()
            .then((gameLogs: GameLog[]) => {
                return gameLogs;
            });
    }

    async addLog(lobby: MultiplayerLobby, isAbandonedAndSolo: boolean = false): Promise<void> {
        const newGameLog: GameLog | undefined = this.createGameLog(lobby, isAbandonedAndSolo);
        if (!newGameLog) return;
        await this.collectionGamesLogs.insertOne(newGameLog).catch(() => {
            throw new HttpException('Failed to insert log', StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }

    async resetLogs(): Promise<void> {
        await this.collectionGamesLogs.deleteMany({}).catch(() => {
            throw new HttpException('Failed to delete all logs', StatusCodes.INTERNAL_SERVER_ERROR);
        });
        await this.collectionGamesLogs.insertOne(DEFAULT_GAME_LOG);
    }

    addStartingDate(lobbyId: string): void {
        this.startingGameDate.set(lobbyId, new Date());
    }

    getTimeSinceStart(lobbyId: string): number {
        const startDate: Date | undefined = this.startingGameDate.get(lobbyId);
        if (startDate) {
            this.startingGameDate.delete(lobbyId);
            return Math.round((new Date().getTime() - startDate.getTime()) * serviceConstants.FACTOR_MS_TO_S);
        }
        return serviceConstants.NUMBER_ERROR_VALUE;
    }

    private createGameLog(lobby: MultiplayerLobby, isAbandoned: boolean): GameLog | undefined {
        const newGameLog: GameLog = {
            date: this.startingGameDate.get(lobby.lobbyId)?.toString(),
            mode: lobby.lobbyType,
            playerInfos: this.createPlayerLog(lobby.playerList),
            isAbandoned,
        } as GameLog;
        const timeSinceStart: number = this.getTimeSinceStart(lobby.lobbyId);
        if (timeSinceStart === serviceConstants.NUMBER_ERROR_VALUE) return undefined;
        newGameLog.minutes = Math.floor(timeSinceStart / serviceConstants.SECONDS_IN_MINUTE);
        newGameLog.seconds = timeSinceStart % serviceConstants.SECONDS_IN_MINUTE;
        return newGameLog;
    }

    private createPlayerLog(players: Player[]): PlayerInfoLog[] {
        const playerInfos: PlayerInfoLog[] = [];
        for (const player of players) playerInfos.push({ name: player.name, score: player.score } as PlayerInfoLog);
        return playerInfos;
    }
}
