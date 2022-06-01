import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { EndGameDialogComponent } from '@app/components/end-game-dialog/end-game-dialog.component';
import { EndGameService } from './end-game.service';
import * as specConstants from './end-game.service.spec.constants';

describe('EndGameService', () => {
    let service: EndGameService;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;

    beforeEach(() => {
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        TestBed.configureTestingModule({
            providers: [EndGameDialogComponent, { provide: MatDialog, useValue: matDialogSpy }],
        });
        service = TestBed.inject(EndGameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setEndGameInformations should set isEndGame, currentPlayer and opponentPlayer', () => {
        service.setEndGameInformations(specConstants.CURRENT_PLAYER, specConstants.OPPONENT_PLAYER);
        expect(service.currentPlayer).toEqual(specConstants.CURRENT_PLAYER);
        expect(service.opponentPlayer).toEqual(specConstants.OPPONENT_PLAYER);
        expect(service.isEndGame).toEqual(true);
    });
});
