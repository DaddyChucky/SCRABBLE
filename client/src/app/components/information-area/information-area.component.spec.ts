import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Player } from '@app/../../../common/model/player';
import { AppMaterialModule } from '@app/modules/material.module';
import { PlayerInformationService } from '@app/services/player-information/player-information.service';
import { InformationAreaComponent } from './information-area.component';
import * as specConstants from './information-area.component.spec.constants';

describe('InformationAreaComponent', () => {
    let component: InformationAreaComponent;
    let fixture: ComponentFixture<InformationAreaComponent>;
    let playerInformationServiceSpy: jasmine.SpyObj<PlayerInformationService>;

    beforeEach(() => {
        playerInformationServiceSpy = jasmine.createSpyObj('PlayerInformationService', ['getSortedPlayersByHighestScore'], {
            players: [specConstants.PLAYER1, specConstants.PLAYER2],
        });
        playerInformationServiceSpy.getSortedPlayersByHighestScore.and.returnValue([specConstants.PLAYER2, specConstants.PLAYER1]);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InformationAreaComponent],
            providers: [{ provide: PlayerInformationService, useValue: playerInformationServiceSpy }],
            imports: [AppMaterialModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InformationAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('player has less than 7 letters, should return true', () => {
        const HAS_LESS_THAN_7_LETTERS: boolean = component.hasLessThan7Letters(specConstants.PLAYER1);
        expect(HAS_LESS_THAN_7_LETTERS).toEqual(true);
    });

    it('player has 7 letters, should return false', () => {
        const HAS_LESS_THAN_7_LETTERS: boolean = component.hasLessThan7Letters(specConstants.PLAYER2);
        expect(HAS_LESS_THAN_7_LETTERS).toEqual(false);
    });

    it('should return CSS_CLASS_IS_TURN when isTurn is true', () => {
        const CSS_CLASS: string = component.getPlayerClass(specConstants.PLAYER1);
        expect(CSS_CLASS).toEqual(specConstants.CSS_CLASS_IS_TURN);
    });

    it('should return CSS_CLASS_IS_NOT_TURN when isTurn is false', () => {
        const CSS_CLASS: string = component.getPlayerClass(specConstants.PLAYER2);
        expect(CSS_CLASS).toEqual(specConstants.CSS_CLASS_IS_NOT_TURN);
    });

    it('get playersOrderedByScore() should call getSortedPlayersByHighestScore() from service', () => {
        const players: Player[] = component.playersOrderedByScore;
        expect(playerInformationServiceSpy.getSortedPlayersByHighestScore).toHaveBeenCalled();
        expect(players).toEqual([specConstants.PLAYER2, specConstants.PLAYER1]);
    });
});
