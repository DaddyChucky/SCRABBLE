import { Dictionary } from '@app/../../../common/model/dictionary';
import { MultiplayerLobby } from '@app/../../../common/model/lobby';
import { Player } from '@app/../../../common/model/player';

export const MULTIPLAYERLOBBY_STUB: MultiplayerLobby = { playerList: [{ name: 'Nom' } as Player] } as MultiplayerLobby;
export const MULTIPLAYERLOBBY_WITH_UNDEFINED_PLAYERS_STUB: MultiplayerLobby = {} as MultiplayerLobby;
export const GAME_HOST_STUB: Player = { name: 'GAME_HOST' } as Player;
export const DICT: Dictionary = { title: 'ff', description: 'ggg' };
export const STATIC_MULTIPLAYER_LOBBY_ONE_PLAYER: MultiplayerLobby = { playerList: [{ name: 'p1' } as Player] } as MultiplayerLobby;
export const STATIC_MULTIPLAYER_LOBBY_THREE_PLAYERS: MultiplayerLobby = {
    playerList: [{ name: 'p1' } as Player, { name: 'p2' } as Player, { name: 'p3' } as Player],
} as MultiplayerLobby;
export const WAITING_TIME = 1000;
