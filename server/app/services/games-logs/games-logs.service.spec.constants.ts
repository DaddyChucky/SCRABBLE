import { GameLog } from '@common/model/game-log';
import { MultiplayerLobby } from '@common/model/lobby';
import { LobbyType } from '@common/model/lobby-type';
import { Player } from '@common/model/player';
import { PlayerInfoLog } from '@common/model/player-info-log';
import { Quest } from '@common/model/quest';
import { SECONDS_IN_MINUTE } from './games-logs.services.constants';

export const SIZE_AFTER_INSERT = 1;
export const SIZE_AFTER_INSERT_2 = 2;
export const START_DATE = new Date();
export const GAME_DURATION_MINUTES = 80;
export const GAME_DURATION_SECONDS = 43;
export const GAME_DURATION = GAME_DURATION_MINUTES * SECONDS_IN_MINUTE + GAME_DURATION_SECONDS;
export const CLASSIC_TYPE: LobbyType = LobbyType.CLASSIC;
export const NAME1 = 'bob';
export const SCORE1 = 127;
export const NAME2 = 'alphonse';
export const SCORE2 = 66;
export const PLAYER1: Player = {
    name: NAME1,
    score: SCORE1,
    playerId: 'id1',
    isTurn: true,
    tiles: [],
    host: true,
    sideQuest: {} as Quest,
} as Player;
export const PLAYER2: Player = {
    name: NAME2,
    score: SCORE2,
    playerId: 'id12',
    isTurn: false,
    tiles: [],
    host: false,
    sideQuest: {} as Quest,
} as Player;
export const PLAYERS: Player[] = [PLAYER1, PLAYER2];
export const PLAYER_INFO_LOG1: PlayerInfoLog = {
    name: NAME1,
    score: SCORE1,
} as PlayerInfoLog;
export const PLAYER_INFO_LOG2: PlayerInfoLog = {
    name: NAME2,
    score: SCORE2,
} as PlayerInfoLog;
export const PLAYER_LOGS: PlayerInfoLog[] = [PLAYER_INFO_LOG1, PLAYER_INFO_LOG2];
export const GAME_LOG_ABANDONED: GameLog = {
    date: START_DATE.toString(),
    minutes: GAME_DURATION_MINUTES,
    seconds: GAME_DURATION_SECONDS,
    playerInfos: PLAYER_LOGS,
    mode: CLASSIC_TYPE,
    isAbandoned: true,
} as GameLog;
export const INITIAL_LOG: GameLog = {
    date: START_DATE.toString(),
    minutes: GAME_DURATION_MINUTES,
    seconds: GAME_DURATION_SECONDS,
    playerInfos: PLAYER_LOGS,
    mode: CLASSIC_TYPE,
} as GameLog;
export const LOBBY_ID = 'lobbyId';
export const LOBBY: MultiplayerLobby = {
    lobbyId: LOBBY_ID,
    lobbyType: CLASSIC_TYPE,
    playerList: PLAYERS,
} as MultiplayerLobby;
export const ONE_ELEMENT_ARRAY_LENGTH = 1;
