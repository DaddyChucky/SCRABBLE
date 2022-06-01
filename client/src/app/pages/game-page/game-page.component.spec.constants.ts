import { LetterBag } from '@app/../../../common/model/letter-bag/letter-bag';
import { MultiplayerLobby } from '@app/../../../common/model/lobby';
import { LobbyStatus } from '@app/../../../common/model/lobby-status';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { Player } from '@app/../../../common/model/player';
import { Quest } from '@app/../../../common/model/quest';
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';

export const INITIAL_PLAYER_TILES: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'b', 3),
    new Tile({ x: 0, y: 0 } as Vec2, 'o', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'n', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'j', 2),
    new Tile({ x: 0, y: 0 } as Vec2, 'o', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'u', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'r', 1),
];
export const PLAYER1: Player = {
    name: 'Johhny Le Terrible',
    playerId: '',
    score: 30,
    tiles: INITIAL_PLAYER_TILES,
    host: true,
    isTurn: true,
    sideQuest: {} as Quest,
};
export const PLAYER2: Player = {
    name: 'Johhny Le Terrible',
    playerId: '',
    score: 88,
    tiles: INITIAL_PLAYER_TILES,
    host: true,
    isTurn: true,
    sideQuest: {} as Quest,
};
export const LOBBY_MOCK: MultiplayerLobby = {
    playerList: [PLAYER1, PLAYER2],
    lobbyType: LobbyType.LOG2990,
    dictionary: 'ENGLISH',
    baseTimerValue: 60,
    timeLeft: 0,
    lobbyId: 'lobbyID',
    lobbyStatus: LobbyStatus.CREATED,
    letterBag: new LetterBag(),
};
