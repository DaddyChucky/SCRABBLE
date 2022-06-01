import { MultiplayerLobby } from '@common/model/lobby';
import { LobbyStatus } from '@common/model/lobby-status';
import { Player } from '@common/model/player';
import { Quest } from '@common/model/quest';
import { Tile } from '@common/model/tile';

export const EXPECTED_LOBBY = {} as MultiplayerLobby;
export const EXPECTED_TIME = 60;
export const CORRECT_LENGHT_PUBLIC_QUESTS = 2;
export const LARGE_NUMBER_OF_TRIES = 30;
export const EXPECTED_LOBBY_STATUS = LobbyStatus.CREATED;
export const PLAYER1_ID = 'aihaidhs';
export const PLAYER2_ID = 'rr010204r';
export const PLAYER3_ID = 'notMyId';
export const PLAYER4_ID = 'ghfjda';
export const PLAYER1: Player = {
    name: 'bob',
    score: 12,
    playerId: PLAYER1_ID,
    isTurn: true,
    tiles: [],
    host: true,
    sideQuest: {} as Quest,
} as Player;
export const PLAYER2: Player = {
    name: 'bobs friend',
    score: 100,
    playerId: PLAYER2_ID,
    isTurn: false,
    tiles: [],
    host: false,
    sideQuest: {} as Quest,
} as Player;
export const PLAYER3: Player = {
    name: 'bobs friends friend',
    score: 500,
    playerId: PLAYER3_ID,
    isTurn: false,
    tiles: [],
    host: false,
    sideQuest: {} as Quest,
} as Player;
export const PLAYER4: Player = {
    name: 'not bob friend',
    score: 600,
    playerId: PLAYER4_ID,
    isTurn: false,
    tiles: [],
    host: false,
    sideQuest: {} as Quest,
} as Player;
export const PLAYER5_TILES: Tile[] = [
    new Tile({ x: 0, y: 0 }, 'A', 1),
    new Tile({ x: 0, y: 0 }, 'B', 1),
    new Tile({ x: 0, y: 0 }, 'C', 1),
    new Tile({ x: 0, y: 0 }, 'D', 1),
    new Tile({ x: 0, y: 0 }, 'E', 1),
    new Tile({ x: 0, y: 0 }, 'F', 1),
    new Tile({ x: 0, y: 0 }, 'G', 1),
];
export const PLAYER5: Player = {
    name: 'not bob friend',
    score: 600,
    playerId: PLAYER4_ID,
    isTurn: false,
    tiles: [],
    host: false,
    sideQuest: {} as Quest,
} as Player;
export const JOIN_LOBBY = { playerList: [PLAYER1, PLAYER2] } as MultiplayerLobby;

export const FAKE_LOBBY_ID = 'notAnId';
export const PLAYER_LIST: Player[] = [PLAYER1];
export const PLAYER_LIST_WITH_2_PLAYER: Player[] = [PLAYER1, PLAYER2];
export const LENGTH_OF_PLAYER_LIST_WITH_ONE_PLAYER = 1;
export const indexA = 0;
export const LETTER_TO_REMOVE = 'ABCZX';
export const EXPECTED_LETTER_REMOVED = 'ABC';
