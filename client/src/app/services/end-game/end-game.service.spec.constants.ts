/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Player } from '@app/../../../common/model/player';
import { Quest } from '@app/../../../common/model/quest';

export const CURRENT_PLAYER: Player = {
    name: 'Johhny Le Terrible Terrifiant',
    playerId: 'id1',
    score: 10,
    tiles: [],
    host: false,
    isTurn: true,
    sideQuest: {} as Quest,
};
export const OPPONENT_PLAYER: Player = {
    name: 'La Muerte Sanguinaire',
    playerId: 'id2',
    score: 1110,
    tiles: [],
    host: true,
    isTurn: true,
    sideQuest: {} as Quest,
};
