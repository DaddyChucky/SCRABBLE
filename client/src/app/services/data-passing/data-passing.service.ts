import { Injectable } from '@angular/core';
import { InfoParameters } from '@app/classes/info-parameters';

@Injectable({
    providedIn: 'root',
})
export class DataPassingService {
    isClassic: boolean;
    isSolo: boolean;
    username: string;
    dict: string;
    timer: number;
    lobbyId: string;

    setInfo(info: InfoParameters): void {
        this.username = info.username;
        this.dict = info.dict;
        this.timer = info.timer;
        this.isSolo = info.isSolo;
    }

    setMode(isSoloMode: boolean): void {
        this.isSolo = isSoloMode;
    }

    setGameMode(isClassic: boolean): void {
        this.isClassic = isClassic;
    }

    setUsername(name: string): void {
        this.username = name;
    }
}
