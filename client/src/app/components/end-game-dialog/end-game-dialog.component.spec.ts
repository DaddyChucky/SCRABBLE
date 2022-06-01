import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { EndGameService } from '@app/services/end-game/end-game.service';
import { EndGameDialogComponent } from './end-game-dialog.component';
import * as componentConstants from './end-game-dialog.component.constants';
import * as specConstants from './end-game-dialog.component.spec.constants';

describe('EndGameDialogComponent', () => {
    let component: EndGameDialogComponent;
    let fixture: ComponentFixture<EndGameDialogComponent>;
    let endGameServiceSpy: jasmine.SpyObj<EndGameService>;

    beforeEach(async () => {
        endGameServiceSpy = jasmine.createSpyObj('EndGameService', [], {
            currentPlayer: specConstants.CURRENT_PLAYER,
            opponentPlayer: specConstants.OPPONENT_PLAYER,
        });
        await TestBed.configureTestingModule({
            providers: [{ provide: EndGameService, useValue: endGameServiceSpy }],
            declarations: [EndGameDialogComponent],
            imports: [AppMaterialModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EndGameDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('isWinnerCSSClass should WINNER_CLASS if current player is winner', () => {
        spyOnProperty(component, 'isWinner').and.returnValue(true);
        expect(component.isWinnerCSSClass()).toEqual(componentConstants.WINNER_CLASS);
    });

    it('isWinnerCSSClass should LOSER_CLASS if current player is not winning', () => {
        spyOnProperty(component, 'isWinner').and.returnValue(false);
        expect(component.isWinnerCSSClass()).toEqual(componentConstants.LOSER_CLASS);
    });

    it('endGameMessage should return TIE_MESSAGE if game is a tie', () => {
        spyOnProperty(component, 'isTie').and.returnValue(true);
        expect(component.endGameMessage).toEqual(componentConstants.TIE_MESSAGE);
    });

    it('endGameMessage should return WINNER_MESSAGE if current player is the winner', () => {
        spyOnProperty(component, 'isTie').and.returnValue(false);
        spyOnProperty(component, 'isWinner').and.returnValue(true);
        expect(component.endGameMessage).toEqual(componentConstants.WINNER_MESSAGE);
    });

    it('endGameMessage should return LOSER_MESSAGE if current player is losing', () => {
        spyOnProperty(component, 'isTie').and.returnValue(false);
        spyOnProperty(component, 'isWinner').and.returnValue(false);
        expect(component.endGameMessage).toEqual(componentConstants.LOSER_MESSAGE);
    });

    it('currentPlayer should return currentPlayer from endGameService', () => {
        expect(component.currentPlayer).toEqual(specConstants.CURRENT_PLAYER);
    });

    it('opponentPlayer should return opponentPlayer from endGameService', () => {
        expect(component.opponentPlayer).toEqual(specConstants.OPPONENT_PLAYER);
    });

    it('isWinner should return true if current player score is higher than opponent', () => {
        spyOnProperty(component, 'currentPlayer').and.returnValue(specConstants.CURRENT_PLAYER);
        spyOnProperty(component, 'opponentPlayer').and.returnValue(specConstants.OPPONENT_PLAYER);
        expect(component.isWinner).toEqual(true);
    });

    it('isWinner should return false if current player score is not higher than opponent', () => {
        spyOnProperty(component, 'currentPlayer').and.returnValue(specConstants.OPPONENT_PLAYER);
        spyOnProperty(component, 'opponentPlayer').and.returnValue(specConstants.CURRENT_PLAYER);
        expect(component.isWinner).toEqual(false);
    });

    it('isTie should return true if scores of current and opponent players are equal', () => {
        spyOnProperty(component, 'currentPlayer').and.returnValue(specConstants.CURRENT_PLAYER);
        spyOnProperty(component, 'opponentPlayer').and.returnValue(specConstants.CURRENT_PLAYER);
        expect(component.isTie).toEqual(true);
    });

    it('isTie should return false if scores of current and opponent players are not equal', () => {
        spyOnProperty(component, 'currentPlayer').and.returnValue(specConstants.CURRENT_PLAYER);
        spyOnProperty(component, 'opponentPlayer').and.returnValue(specConstants.OPPONENT_PLAYER);
        expect(component.isTie).toEqual(false);
    });

    it('getRemainingLetters should return remaining letters of player', () => {
        expect(component.getRemainingLetters(specConstants.CURRENT_PLAYER.tiles)).toEqual(specConstants.REMAINING_LETTERS);
    });

    it('getRemainingLetters should return remaining letters of player (empty letters)', () => {
        expect(component.getRemainingLetters([])).toEqual([]);
    });
});
