import { LobbyType } from '@app/../../../common/model/lobby-type';
import { Player } from '@app/../../../common/model/player';

export interface InfoLobbyMock {
    dictionary: string;
    lobbyType: LobbyType;
    player: Player;
    lobbyId: string;
}
