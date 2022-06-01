import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ScoresComponent } from '@app/pages/scores/scores.component';
import { DataPassingService } from '@app/services/data-passing/data-passing.service';
import * as componentConstants from './main-page.component.spec.constants';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnDestroy {
    buttons: string[];
    private isModeClassic: boolean;

    constructor(private readonly dataPassing: DataPassingService, private readonly router: Router, private readonly dialog: MatDialog) {
        this.isModeClassic = true;
        this.buttons = [
            componentConstants.CLASSIC_MODE_BUTTON_NAME,
            componentConstants.LOG2990_MODE_BUTTON_NAME,
            componentConstants.BEST_SCORE_BUTTON_NAME,
        ];
    }

    ngOnDestroy(): void {
        this.dataPassing.setMode(this.isModeClassic);
    }

    saveMode(isClassic: boolean): void {
        this.dataPassing.setGameMode(isClassic);
        this.router.navigate(['gameChoice']);
    }

    openScores(): void {
        this.dialog.open(ScoresComponent);
    }
}
