import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ViewService {
    private timerValueInSeconds: number;

    constructor() {
        this.timerValueInSeconds = this.timer;
    }

    get timer(): number {
        return this.timerValueInSeconds;
    }

    setTimerValue(timerValue: number): void {
        this.timerValueInSeconds = timerValue;
    }
}
