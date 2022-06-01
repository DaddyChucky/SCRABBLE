import { LetterBag } from './letter-bag/letter-bag';
import { LobbyStatus } from './lobby-status';
import { LobbyType } from './lobby-type';
import { Player } from './player';
import { Quest } from './quest';

export class MultiplayerLobby {
    playerList: Player[];
    lobbyType: LobbyType;
    dictionary: string;
    baseTimerValue: number;
    timeLeft: number;
    lobbyId: string;
    lobbyStatus: LobbyStatus;
    letterBag: LetterBag;
    sideQuests?: Quest[];
}
