import { LetterBag } from '@app/../../../common/model/letter-bag/letter-bag';
import { LobbyMock } from '@app/../../../common/model/lobby-mock';
import { LobbyStatus } from '@app/../../../common/model/lobby-status';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { Player } from '@app/../../../common/model/player';
import { Tile } from '@app/../../../common/model/tile';

export const FAKE_SOCKET_ID = 'socketId';
export const ID_RANDOM_JOIN = '#randomJoin';
export const LOBBY_MOCK: LobbyMock = {
    playerList: [] as Player[],
    lobbyType: LobbyType.CLASSIC,
    dictionary: 'ENGLISH',
    baseTimerValue: 60,
    timeLeft: 0,
    lobbyId: 'thisismylobby',
    lobbyStatus: LobbyStatus.CREATED,
    letterBag: new LetterBag(),
} as LobbyMock;
export const PLAYER: Player = {
    name: 'Roger',
    score: 0,
    playerId: 'id',
    tiles: [] as Tile[],
    isTurn: false,
    host: false,
} as Player;
export const DEFAULT_COLUMN_NAMES: string[] = ['host', 'timer', 'dict', 'join'];
export const DICTIONARY_PRINT_FRENCH = 'Français';
export const DICTIONARY_PRINT_ENGLISH = 'English';
export const DICTIONARY_PRINT_CUSTOM = 'Personnalisé';
