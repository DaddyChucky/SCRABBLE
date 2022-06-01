import { MultiplayerLobby } from '@common/model/lobby';
import { LobbyType } from '@common/model/lobby-type';
import { Player } from '@common/model/player';
import { ScorePack } from '@common/model/score-pack';

export const SCORE1: ScorePack = { score: 10, names: ['bob', 'frr a bob'] } as ScorePack;
export const SCORE2: ScorePack = { score: 7, names: ['bobs2'] } as ScorePack;
export const SCORE3: ScorePack = { score: 5, names: ['bobs3'] } as ScorePack;
export const SCORE4: ScorePack = { score: 3, names: ['bobs4'] } as ScorePack;
export const SCORE5: ScorePack = { score: 1, names: ['bobs5', 'frr a bobs5', 'frr a bob'] } as ScorePack;
export const FICTIVE_SCORES = [SCORE1, SCORE2, SCORE3, SCORE4, SCORE5];
export const PLAYER: Player = { name: 'bob', score: 10 } as Player;
export const EXPECTED_LOBBY: MultiplayerLobby = {
    lobbyType: LobbyType.CLASSIC,
    playerList: [PLAYER],
} as MultiplayerLobby;
