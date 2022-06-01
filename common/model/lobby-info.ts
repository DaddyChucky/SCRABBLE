import { LobbyType } from './lobby-type';
import { Player } from './player';
import { VirtualPlayerInfo } from './virtual-player-info';

export class LobbyInfo {
    dictionary: string;
    lobbyType: LobbyType;
    player: Player;
    lobbyId: string;
    timerValue?: number;
    virtualPlayer?: VirtualPlayerInfo;
}
