import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { EndGameDialogComponent } from '@app/components/end-game-dialog/end-game-dialog.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameManagerService } from '@app/services/game-manager/game-manager.service';
import { PlaceLettersService } from '@app/services/place-letters/place-letters.service';
import { ButtonsAreaComponent } from './buttons-area.component';
import * as specConstants from './buttons-area.component.spec.constants';

describe('ButtonsAreaComponent', () => {
    let component: ButtonsAreaComponent;
    let fixture: ComponentFixture<ButtonsAreaComponent>;
    let gameManagerSpy: jasmine.SpyObj<GameManagerService>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;
    let endGameDialogComponentSpy: jasmine.SpyObj<EndGameDialogComponent>;
    let placeLettersServiceSpy: jasmine.SpyObj<PlaceLettersService>;

    beforeEach(async () => {
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        gameManagerSpy = jasmine.createSpyObj('GameManagerService', ['passTurn', 'isCurrentPlayer'], {
            multiplayerLobby: specConstants.LOBBY_MOCK,
        });
        endGameDialogComponentSpy = jasmine.createSpyObj('EndGameDialogComponent', ['openEndGameDialog'], {
            isEndGame: true,
        });
        placeLettersServiceSpy = jasmine.createSpyObj('PlaceLettersService', ['cancelPlaceCommand', 'confirmPlaceCommand'], {
            tilesAddedToGrid: specConstants.TILES,
        });
        await TestBed.configureTestingModule({
            declarations: [ButtonsAreaComponent],
            imports: [AppMaterialModule],
            providers: [
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: EndGameDialogComponent, useValue: endGameDialogComponentSpy },
                { provide: GameManagerService, useValue: gameManagerSpy },
                { provide: PlaceLettersService, useValue: placeLettersServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        gameManagerSpy.isCurrentPlayer.and.stub();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ButtonsAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('clicking on "passer" button should call passTurn()', () => {
        const passButton: DebugElement = fixture.debugElement.query(By.css(specConstants.ID_PASS_BUTTON));
        spyOn(component, 'passTurn');
        passButton.triggerEventHandler('click', null);
        expect(component.passTurn).toHaveBeenCalled();
    });

    it('passTurn() should call send from socketService', () => {
        component.passTurn();
        expect(gameManagerSpy.passTurn).toHaveBeenCalled();
    });

    it('give-up button should call popGiveUp()', () => {
        const giveUpButton: DebugElement = fixture.debugElement.query(By.css(specConstants.GIVE_UP_BTN_ID));
        spyOn(component, 'popGiveUp');
        giveUpButton.triggerEventHandler('click', null);
        expect(component.popGiveUp).toHaveBeenCalled();
    });

    it('popGiveUp should call open of MatDialog', () => {
        component.popGiveUp();
        expect(matDialogSpy.open).toHaveBeenCalled();
    });

    it("isPlayerTurn should return true if it is current player's turn", () => {
        gameManagerSpy.isCurrentPlayer.and.returnValue(true);
        expect(component.isPlayerTurn).toEqual(true);
    });

    it("isPlayerTurn should return false if it is not current player's turn", () => {
        gameManagerSpy.isCurrentPlayer.and.returnValue(false);
        expect(component.isPlayerTurn).toEqual(false);
    });

    it('isPlayerTurn should return true if playerList of gameManager.multiplayerLobby is undefined', () => {
        gameManagerSpy.multiplayerLobby.playerList = [];
        gameManagerSpy.isCurrentPlayer.and.returnValue(true);
        expect(component.isPlayerTurn).toEqual(true);
    });

    it('sendPlaceCommand should call confirmPlaceCommand if tilesAddedToGrid is not empty', () => {
        placeLettersServiceSpy.tilesAddedToGrid = specConstants.TILES_TO_ADD;
        placeLettersServiceSpy.tilesAddedToGrid.length = specConstants.TILES_TO_ADD.length;
        component.sendPlaceCommand();
        expect(placeLettersServiceSpy.confirmPlaceCommand).toHaveBeenCalled();
    });

    it('sendPlaceCommand should not call confirmPlaceCommand if tilesAddedToGrid is empty', () => {
        placeLettersServiceSpy.tilesAddedToGrid = [];
        placeLettersServiceSpy.tilesAddedToGrid.length = 0;
        expect(placeLettersServiceSpy.tilesAddedToGrid.length).toEqual(0);
        component.sendPlaceCommand();
        expect(placeLettersServiceSpy.confirmPlaceCommand).not.toHaveBeenCalled();
    });

    it('openEndGameDialog should call open from matDialog', () => {
        component.openEndGameDialog();
        expect(matDialogSpy.open).toHaveBeenCalled();
    });
});
