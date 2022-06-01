import { Component, OnInit } from '@angular/core';
import { DataPassingService } from '@app/services/data-passing/data-passing.service';

@Component({
    selector: 'app-game-choice-page',
    templateUrl: './game-choice-page.component.html',
    styleUrls: ['./game-choice-page.component.scss'],
})
export class GameChoiceComponent implements OnInit {
    isModeClassic: boolean;

    constructor(private readonly dataPassingService: DataPassingService) {}

    ngOnInit(): void {
        this.isModeClassic = this.dataPassingService.isClassic;
    }

    gameModeChoice(isModeSolo: boolean): void {
        this.dataPassingService.setMode(isModeSolo);
    }
}
