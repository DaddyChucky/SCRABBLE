import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Dictionary } from '@app/../../../common/model/dictionary';
import { InfoParameters } from '@app/classes/info-parameters';
import { DataPassingService } from '@app/services/data-passing/data-passing.service';
import { DictionariesManagerService } from '@app/services/dictionaries-manager/dictionaries-manager.service';
import { UsernameValidationService } from '@app/services/username-validation/username-validation.service';
import { BehaviorSubject } from 'rxjs';
import * as componentConstants from './parameters-page.component.constants';

@Component({
    selector: 'app-parameters-page',
    templateUrl: './parameters-page.component.html',
    styleUrls: ['./parameters-page.component.scss'],
})
export class ParametersComponent implements OnDestroy {
    displayedColumns: string[];
    timerValueInSeconds: number;
    username: string;
    currentDictionary: string;
    dictOptions: BehaviorSubject<Dictionary[]>;
    link: string;
    isSoloMode: boolean;
    isClassic: boolean;
    file: string;
    private isPollingNeeded: boolean = true;

    constructor(
        private readonly dataPassing: DataPassingService,
        private readonly router: Router,
        private readonly usernameValidationService: UsernameValidationService,
        private readonly dictionariesManager: DictionariesManagerService,
    ) {
        this.displayedColumns = ['name'];
        this.timerValueInSeconds = componentConstants.DEFAULT_TIMER_VALUE;
        this.isClassic = this.dataPassing.isClassic;
        this.isSoloMode = this.dataPassing.isSolo;
        this.dictOptions = this.dictionariesManager.dictionaries;
        this.polling();
        this.displayedColumns = componentConstants.DEFAULT_COLUMN_NAMES;
        this.timerValueInSeconds = componentConstants.DEFAULT_TIMER_VALUE;
    }

    ngOnDestroy(): void {
        this.isPollingNeeded = false;
        const myObj = {
            username: this.username,
            dict: this.currentDictionary,
            timer: this.timerValueInSeconds,
            isSolo: this.isSoloMode,
            isClassic: this.dataPassing.isClassic,
        } as InfoParameters;
        this.dataPassing.setInfo(myObj);
    }

    incrementTimer(): void {
        const tempTimerValue: number = this.timerValueInSeconds + componentConstants.TIMER_JUMP_VALUE;
        this.timerValueInSeconds = tempTimerValue > componentConstants.HIGHER_TIMER_VALUE ? componentConstants.HIGHER_TIMER_VALUE : tempTimerValue;
    }

    decrementTimer(): void {
        const tempTimerValue: number = this.timerValueInSeconds - componentConstants.TIMER_JUMP_VALUE;
        this.timerValueInSeconds = tempTimerValue < componentConstants.LOW_TIMER_VALUE ? componentConstants.LOW_TIMER_VALUE : tempTimerValue;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async validateDict(event: any): Promise<void> {
        const fileContent: string = await this.dictionariesManager.readDictionary(event.target.files[0]);
        this.dictionariesManager.dictVerification(fileContent);
        this.dictOptions = this.dictionariesManager.dictionaries;
        if (!this.isDictionaryValid) this.file = '';
    }

    get isDictionaryValid(): boolean {
        return this.dictionariesManager.isValid;
    }

    linkChoice(): void {
        this.link = componentConstants.MULTI_LINK_VALUE;
        if (this.isUsernameValid) this.router.navigate([this.link]);
    }

    get isUsernameValid(): boolean {
        return this.usernameValidationService.isValidUsername(this.username);
    }

    private async polling(): Promise<void> {
        if (!this.isPollingNeeded) return;
        this.dictionariesManager.loadDictionaryData();
        setTimeout(async () => this.polling(), componentConstants.POLLING_TIME);
    }
}
