import { container } from '@app/inversify.config';
import { EndGameDatabaseGestion } from '@app/services/end-game-database-gestion/end-game-database-gestion.service';
import { GamesLogsService } from '@app/services/games-logs/games-logs.service';
import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import { ScoresService } from '@app/services/scores/scores.service';
import Types from '@app/types';
import { LetterBag } from '@common/model/letter-bag/letter-bag';
import { MultiplayerLobby } from '@common/model/lobby';
import { Player } from '@common/model/player';
import { Service } from 'typedi';
import * as serviceConstants from './end-game-management.service.constants';

@Service()
export class EndGameManagementService {
    turnPassedNb: number;
    fetch: EndGameDatabaseGestion;
    private readonly gameLogsService: GamesLogsService;

    constructor(private readonly letterBag: LetterBagService) {
        this.fetch = new EndGameDatabaseGestion(container.get<ScoresService>(Types.ScoresService));
        this.gameLogsService = container.get<GamesLogsService>(Types.GamesLogsService);
    }

    endGameVerification(lobby: MultiplayerLobby): void {
        if (!this.isPlayersTurn(lobby.playerList) || this.landSlideWin(lobby)) {
            this.endGamePointsCalculus(lobby);
            this.sendLogToDatabase(lobby);
        }
    }

    isEndGame(lobby: MultiplayerLobby): boolean {
        for (const player of lobby.playerList) {
            if (!player.tiles.length && this.letterBag.letterBagIsEmpty(lobby.letterBag)) return true;
        }
        return this.turnPassedNb === serviceConstants.MAX_NUMBER_TURN_PASSED || this.isPlayerGaveUp(lobby.playerList);
    }

    async sendScoresToDatabase(lobby: MultiplayerLobby): Promise<void> {
        await this.fetch.sendScores(lobby);
    }

    async sendLogToDatabase(lobby: MultiplayerLobby): Promise<void> {
        await this.gameLogsService.addLog(lobby);
    }

    messageToSend(lobby: MultiplayerLobby): string {
        const players: Player[] = lobby.playerList;
        this.sendScoresToDatabase(lobby);
        if (this.isPlayerGaveUp(players)) return this.winningMessage(players[0].name);
        if (players[serviceConstants.PLAYER_1_INDEX].score === players[serviceConstants.PLAYER_2_INDEX].score) {
            return this.equalityMessage(players);
        }
        const winner: string =
            players[serviceConstants.PLAYER_1_INDEX].score > players[serviceConstants.PLAYER_2_INDEX].score
                ? players[serviceConstants.PLAYER_1_INDEX].name
                : players[serviceConstants.PLAYER_2_INDEX].name;
        return this.winningMessage(winner);
    }

    letterBagSizeMessage(letterBag: LetterBag): string {
        const size: number = letterBag.letters.map((letter) => letter.quantity).reduce((amountTileInBag, amount) => amountTileInBag + amount, 0);
        return serviceConstants.LETTER_BAG_SIZE_MESSAGE[0] + size.toString() + serviceConstants.LETTER_BAG_SIZE_MESSAGE[1];
    }

    private isPlayerGaveUp(players: Player[]): boolean {
        return players.length === 1;
    }

    private winningMessage(name: string): string {
        return name + serviceConstants.WINNING_MESSAGE;
    }

    private equalityMessage(players: Player[]): string {
        return (
            serviceConstants.EQUALITY_MESSAGE[0] +
            players[serviceConstants.PLAYER_1_INDEX].name +
            serviceConstants.EQUALITY_MESSAGE[1] +
            players[serviceConstants.PLAYER_2_INDEX].name
        );
    }

    private endGamePointsCalculus(lobby: MultiplayerLobby): void {
        const players: Player[] = lobby.playerList;
        const hardWinner: Player | null = this.landSlideWin(lobby);
        if (hardWinner && hardWinner === players[serviceConstants.PLAYER_1_INDEX]) {
            for (const tile of players[serviceConstants.PLAYER_2_INDEX].tiles) players[serviceConstants.PLAYER_1_INDEX].score += tile.weight;
        }
        if (hardWinner && hardWinner === players[serviceConstants.PLAYER_2_INDEX]) {
            for (const tile of players[serviceConstants.PLAYER_1_INDEX].tiles) players[serviceConstants.PLAYER_2_INDEX].score += tile.weight;
        }
        for (const player of lobby.playerList) {
            player.tiles.forEach((tile) => (player.score = Math.max(player.score - tile.weight, serviceConstants.START_SCORE)));
        }
    }

    private isPlayersTurn(players: Player[]): boolean {
        return players.some((player) => player.isTurn);
    }

    private landSlideWin(lobby: MultiplayerLobby): Player | null {
        for (const player of lobby.playerList) {
            if (!player.tiles.length && this.letterBag.letterBagIsEmpty(lobby.letterBag)) return player;
        }
        return null;
    }
}
