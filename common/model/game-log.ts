import { LobbyType } from './lobby-type';
import { PlayerInfoLog } from './player-info-log';

export interface GameLog {
    date: string;
    minutes: number;
    seconds: number;
    playerInfos: PlayerInfoLog[];
    mode: LobbyType;
    isAbandoned: boolean;
}
