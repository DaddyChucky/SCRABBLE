import { Component } from '@angular/core';
import { ScorePack } from '@app/../../../common/model/score-pack';
import { ScoreBoardService } from '@app/services/score-board/score-board.service';
import { BehaviorSubject } from 'rxjs';
@Component({
    selector: 'app-scores',
    templateUrl: './scores.component.html',
    styleUrls: ['./scores.component.scss'],
})
export class ScoresComponent {
    classicScores: BehaviorSubject<ScorePack[]> = new BehaviorSubject<ScorePack[]>([]);
    logScores: BehaviorSubject<ScorePack[]> = new BehaviorSubject<ScorePack[]>([]);
    displayedClassicColumn: string[] = ['medals', 'names', 'score'];
    displayed2990Column: string[] = ['Mode LOG2990'];

    constructor(private readonly scoreBoard: ScoreBoardService) {
        this.scoreBoard.getClassic().subscribe(this.classicScores);
        this.scoreBoard.getLog().subscribe(this.logScores);
    }
}
