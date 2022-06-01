import { LetterBag } from '@app/../../../common/model/letter-bag/letter-bag';
import { MultiplayerLobby } from '@app/../../../common/model/lobby';
import { LobbyStatus } from '@app/../../../common/model/lobby-status';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { Player } from '@app/../../../common/model/player';
import { Quest } from '@app/../../../common/model/quest';
import { Tile } from '@app/../../../common/model/tile';
import { Vec2 } from '@app/../../../common/model/vec2';

export const PLAYER2: Player = {
    name: 'Arnold LeGentil',
    score: 30,
    playerId: 'id2',
    host: false,
    tiles: [],
    isTurn: false,
    sideQuest: {} as Quest,
};

export const ID_PASS_BUTTON = '#skip-button';
export const QUIT_BTN_ID = 'leave-button';
export const GIVE_UP_BTN_ID = '#give-up-button';
export const PLAYER1: Player = {
    name: 'Johhny Le Terrible',
    playerId: 'id1',
    score: 1110,
    tiles: [],
    host: true,
    isTurn: true,
    sideQuest: {} as Quest,
};
export const LOBBY_MOCK: MultiplayerLobby = {
    playerList: [PLAYER1, PLAYER2],
    lobbyType: LobbyType.LOG2990,
    dictionary: 'anglais',
    baseTimerValue: 60,
    timeLeft: 0,
    lobbyId: 'lobbyID',
    lobbyStatus: LobbyStatus.CREATED,
    letterBag: new LetterBag(),
};
export const TILES: Tile[] = [new Tile({ x: 0, y: 0 } as Vec2, 'A', 1)];
export const TILES_TO_ADD: Tile[] = [
    new Tile({ x: 0, y: 0 } as Vec2, 'A', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'A', 1),
    new Tile({ x: 0, y: 0 } as Vec2, 'A', 1),
];
