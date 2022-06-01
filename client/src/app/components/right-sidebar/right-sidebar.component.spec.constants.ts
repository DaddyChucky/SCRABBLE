import { LetterBag } from '@app/../../../common/model/letter-bag/letter-bag';
import { MultiplayerLobby } from '@app/../../../common/model/lobby';
import { LobbyStatus } from '@app/../../../common/model/lobby-status';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { Player } from '@app/../../../common/model/player';
import { Quest } from '@app/../../../common/model/quest';
import { QuestName } from '@app/../../../common/model/quest-name';

export const CURRENT_PLAYER: Player = {
    name: 'Johhny Le Terrible',
    playerId: 'id1',
    score: 1110,
    tiles: [],
    host: true,
    isTurn: true,
    sideQuest: { name: QuestName.PALINDROME, isAccomplished: true, isPrivate: false, points: 30 } as Quest,
};
export const OPPONENT_PLAYER: Player = {
    name: 'Arnold LeGentil',
    score: 30,
    playerId: 'id2',
    host: false,
    tiles: [],
    isTurn: false,
    sideQuest: { name: QuestName.PALINDROME, isAccomplished: false, isPrivate: false, points: 30 } as Quest,
};
export const LOBBY_MOCK: MultiplayerLobby = {
    playerList: [CURRENT_PLAYER, OPPONENT_PLAYER],
    lobbyType: LobbyType.LOG2990,
    dictionary: 'francais',
    baseTimerValue: 60,
    timeLeft: 0,
    lobbyId: 'lobbyID',
    lobbyStatus: LobbyStatus.CREATED,
    letterBag: new LetterBag(),
};
