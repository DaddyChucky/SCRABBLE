import { Player } from '@common/model/player';
import { Quest } from '@common/model/quest';
import { ScorePack } from '@common/model/score-pack';

export const PLAYER_MOD: Player = {
    name: 'bobs friend 3',
    score: 135236,
    playerId: 'NEWplayerid',
    isTurn: false,
    tiles: [],
    host: true,
    sideQuest: {} as Quest,
} as Player;
export const PLAYER: Player = {
    name: 'pp',
    score: 3,
    playerId: 'NEWplayerid',
    isTurn: false,
    tiles: [],
    host: true,
    sideQuest: {} as Quest,
} as Player;
export const FAKE_NAME = 'fakename';
export const FAKE_SCORE = 123;
export const SCORE1: ScorePack = { score: 10, names: ['bob', 'frr a bob'] } as ScorePack;
export const SCORE2: ScorePack = { score: 7, names: ['bobs2'] } as ScorePack;
export const SCORE3: ScorePack = { score: 5, names: ['bobs3'] } as ScorePack;
export const SCORE4: ScorePack = { score: 3, names: ['bobs4'] } as ScorePack;
export const SCORE5: ScorePack = { score: 1, names: ['bobs5', 'frr a bobs5', 'frr a bob'] } as ScorePack;
export const FICTIVE_SCORES: ScorePack[] = [SCORE1, SCORE2, SCORE3, SCORE4, SCORE5];
