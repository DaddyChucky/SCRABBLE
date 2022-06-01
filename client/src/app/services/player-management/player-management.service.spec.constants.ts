import { LetterBag } from '@app/../../../common/model/letter-bag/letter-bag';
import { LobbyMock } from '@app/../../../common/model/lobby-mock';
import { LobbyStatus } from '@app/../../../common/model/lobby-status';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { Player } from '@app/../../../common/model/player';
import { Quest } from '@app/../../../common/model/quest';
import { VirtualPlayerDifficulty } from '@app/../../../common/model/virtual-player-difficulty';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';
import { InfoLobbyMock } from '@app/classes/info-lobby-mock';

export const MY_PLAYER: Player = {
    name: 'player111',
    score: 10,
    playerId: 'iamplayer111',
    tiles: [],
    isTurn: true,
    host: true,
    sideQuest: {} as Quest,
} as Player;
export const PLAYER2: Player = {
    name: 'player2',
    score: 100,
    playerId: 'player2Id',
    tiles: [],
    isTurn: false,
    host: false,
    sideQuest: {} as Quest,
} as Player;
export const INFO_LOBBY_MOCK: InfoLobbyMock = {
    dictionary: 'ENGLISH',
    lobbyType: LobbyType.CLASSIC,
    player: MY_PLAYER,
    lobbyId: 'thisismylobby',
    letterBag: new LetterBag(),
} as InfoLobbyMock;
export const LOBBY_MOCK: LobbyMock = {
    playerList: [MY_PLAYER, PLAYER2],
    lobbyType: LobbyType.CLASSIC,
    dictionary: 'ENGLISH',
    baseTimerValue: 60,
    timeLeft: 0,
    lobbyId: 'thisismylobby',
    lobbyStatus: LobbyStatus.CREATED,
    letterBag: new LetterBag(),
} as LobbyMock;
export const VIRTUAL_PLAYER: VirtualPlayerInfo = {
    name: 'Madeleine La Baleine',
    difficulty: VirtualPlayerDifficulty.BEGINNER,
} as VirtualPlayerInfo;
export const RESIGNED_PLAYER_ID = 'resigned';
