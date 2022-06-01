import { ScoresService } from '@app/services/scores/scores.service';
import Types from '@app/types';
import { MultiplayerLobby } from '@common/model/lobby';
import { LobbyType } from '@common/model/lobby-type';
import { inject } from 'inversify';
import { Service } from 'typedi';
import * as serviceConstants from './end-game-database-gestion.service.constants';

@Service()
export class EndGameDatabaseGestion {
    constructor(@inject(Types.ScoresService) private readonly scoresService: ScoresService) {}

    async sendScores(lobby: MultiplayerLobby): Promise<void> {
        const isClassic: boolean = lobby.lobbyType === LobbyType.CLASSIC;
        lobby.playerList.forEach(async (player) => {
            let name;
            if (player.playerId === serviceConstants.VP_TEST_NAME || player.playerId === serviceConstants.RESIGNED_PLAYER_ID) return;
            const scoreExists = await this.scoresService.getScore(player.score, isClassic);
            if (scoreExists) name = await this.scoresService.getPlayerScore(player.name, player.score, isClassic);

            if (name) return;
            if (scoreExists && !name) await this.scoresService.modifyScore(player, isClassic);
            else await this.scoresService.addPlayerScore(player, isClassic);
        });
    }
}
