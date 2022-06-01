/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/../../../common/model/vec2';
import { WordRequest } from '@app/../../../common/model/word-request';
import { MouseButton } from '@app/classes/mouse-button';
import { EaselComponent } from '@app/components/easel/easel.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SliderFontSizeComponent } from '@app/components/slider-font-size/slider-font-size.component';
import { TileComponent } from '@app/components/tile/tile.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { EaselService } from '@app/services/easel/easel.service';
import { GridService } from '@app/services/grid/grid.service';
import { MouseService } from '@app/services/mouse/mouse.service';
import { PlaceLettersService } from '@app/services/place-letters/place-letters.service';
import { PlayerInformationService } from '@app/services/player-information/player-information.service';
import { of } from 'rxjs';
import * as specConstants from './play-area.component.spec.constants';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let playerInformationServiceSpy: jasmine.SpyObj<PlayerInformationService>;
    let mouseServiceSpy: jasmine.SpyObj<MouseService>;
    let placeLettersServiceSpy: jasmine.SpyObj<PlaceLettersService>;
    let easelServiceSpy: jasmine.SpyObj<EaselService>;

    beforeEach(() => {
        playerInformationServiceSpy = jasmine.createSpyObj<any>('PlayerInformationService', [], { currentPlayer: specConstants.PLAYER });
        mouseServiceSpy = jasmine.createSpyObj<any>('MouseService', ['updatePositionOnClick'], { mousePosition: { x: 0, y: 0 } as Vec2 });
        easelServiceSpy = jasmine.createSpyObj<any>('EaselService', ['selectEaselLetter', 'manipulate', 'clearEaselSelection'], {});
        placeLettersServiceSpy = jasmine.createSpyObj<any>(
            'PlaceLettersService',
            [
                'cancelPlaceCommand',
                'addLetterToPlaceCommand',
                'isValidKeyPressed',
                'isValidPosition',
                'hasAddedTilesToGrid',
                'cancelPlaceCommand',
                'confirmPlaceCommand',
                'cancelLastLetterPlacement',
                'setGridPositionOfClick',
                'manageClickOnEmptyGridSquare',
            ],
            { placeCommand: specConstants.PLACE_COMMAND, tilesAddedToGrid: specConstants.TILES },
        );
        gridServiceSpy = jasmine.createSpyObj(GridService, [
            'drawTilesAndScrabbleGrid',
            'gridContext',
            'initializeGrid',
            'convertStringWordToTiles',
            'addWordToGrid',
            'addTilesObservable',
            'subjectScrabbleGrid',
            'convertPositionToSquareName',
            'isValidGridPosition',
        ]);
        gridServiceSpy.scrabbleGridObservable$ = of({} as WordRequest);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent, TileComponent, SliderFontSizeComponent],
            providers: [
                EaselComponent,
                { provide: GridService, useValue: gridServiceSpy },
                { provide: PlayerInformationService, useValue: playerInformationServiceSpy },
                { provide: MouseService, useValue: mouseServiceSpy },
                { provide: PlaceLettersService, useValue: placeLettersServiceSpy },
                { provide: EaselService, useValue: easelServiceSpy },
            ],
            imports: [AppMaterialModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', async () => {
        spyOn<any>(component, 'subscribeToScrabbleGrid').and.stub();
        expect(component).toBeTruthy();
    });

    it('redrawTilesWithNewFontSize should call drawTilesAndScrabbleGrid from GridService', async () => {
        component.redrawTilesWithNewFontSize(specConstants.FONT_SIZE);
        expect(gridServiceSpy.drawTilesAndScrabbleGrid).toHaveBeenCalledWith(specConstants.FONT_SIZE);
    });

    it('mousePosition.x should return mousePositionX of mouseService', async () => {
        expect(component.mousePosition.x).toEqual(mouseServiceSpy.mousePosition.x);
    });

    it('mousePosition.y should return mousePositionY of mouseService', async () => {
        expect(component.mousePosition.y).toEqual(mouseServiceSpy.mousePosition.y);
    });

    it('placeCommand should return placeCommand of placeLettersService', async () => {
        expect(component.placeCommand).toEqual(specConstants.PLACE_COMMAND);
    });

    it('isValidStartPosition should return isValidStartPosition of placeLettersService', async () => {
        expect(component.isValidStartPosition).toEqual(placeLettersServiceSpy.isValidStartPosition);
    });

    it('squareClickName should call convertPositionToSquareName from gridService', async () => {
        gridServiceSpy.convertPositionToSquareName.and.returnValue(specConstants.SQUARE_NAME);
        placeLettersServiceSpy.gridPosition = specConstants.GRID_POSITION;
        expect(component.squareClickName).toEqual(specConstants.SQUARE_NAME);
        expect(gridServiceSpy.convertPositionToSquareName).toHaveBeenCalledWith(specConstants.GRID_POSITION);
    });

    it('On keydown with escape button, should call cancelPlaceCommand if hasAddedTilesToGrid is true', async () => {
        placeLettersServiceSpy.hasAddedTilesToGrid.and.returnValue(true);
        component.buttonDetectAction(
            new KeyboardEvent('keydown', {
                key: specConstants.ESCAPE_BUTTON,
            }),
        );
        expect(placeLettersServiceSpy.cancelPlaceCommand).toHaveBeenCalled();
    });

    it('keydown event with escape button, should not call cancelPlaceCommand if hasAddedTilesToGrid is false', async () => {
        placeLettersServiceSpy.hasAddedTilesToGrid.and.returnValue(false);
        component.buttonDetectAction(
            new KeyboardEvent('keydown', {
                key: specConstants.ESCAPE_BUTTON,
            }),
        );
        expect(placeLettersServiceSpy.cancelPlaceCommand).not.toHaveBeenCalled();
    });

    it('keydown event with enter button, should call confirmPlaceCommand if hasAddedTilesToGrid is true', async () => {
        placeLettersServiceSpy.hasAddedTilesToGrid.and.returnValue(true);
        component.buttonDetectAction(
            new KeyboardEvent('keydown', {
                key: specConstants.ENTER_BUTTON,
            }),
        );
        expect(placeLettersServiceSpy.confirmPlaceCommand).toHaveBeenCalled();
    });

    it('keydown event with enter button, should not call confirmPlaceCommand if hasAddedTilesToGrid is false', async () => {
        placeLettersServiceSpy.hasAddedTilesToGrid.and.returnValue(false);
        component.buttonDetectAction(
            new KeyboardEvent('keydown', {
                key: specConstants.ENTER_BUTTON,
            }),
        );
        expect(placeLettersServiceSpy.confirmPlaceCommand).not.toHaveBeenCalled();
    });

    it('keydown event with backspace button, should not call cancelLastLetterPlacement if hasAddedTilesToGrid is false', async () => {
        placeLettersServiceSpy.hasAddedTilesToGrid.and.returnValue(false);
        component.buttonDetectAction(
            new KeyboardEvent('keydown', {
                key: specConstants.BACKSPACE_BUTTON,
            }),
        );
        expect(placeLettersServiceSpy.cancelLastLetterPlacement).not.toHaveBeenCalled();
    });

    it('keydown event with backspace button, should call cancelLastLetterPlacement if hasAddedTilesToGrid is true', async () => {
        placeLettersServiceSpy.hasAddedTilesToGrid.and.returnValue(true);
        component.buttonDetectAction(
            new KeyboardEvent('keydown', {
                key: specConstants.BACKSPACE_BUTTON,
            }),
        );
        expect(placeLettersServiceSpy.cancelLastLetterPlacement).toHaveBeenCalled();
    });

    it('keydown event should call selectEaselLetter and manipulate if event.key if not enter, backspace or escape', async () => {
        component.buttonDetectAction(
            new KeyboardEvent('keydown', {
                key: specConstants.ARROW_BUTTON,
            }),
        );
        expect(easelServiceSpy.selectEaselLetter).toHaveBeenCalled();
        expect(easelServiceSpy.manipulate).toHaveBeenCalled();
    });

    it('keydown event not should call selectEaselLetter and manipulate if not specific key and hasAddedTilesToGrid is true', async () => {
        placeLettersServiceSpy.hasAddedTilesToGrid.and.returnValue(true);
        component.buttonDetectAction(
            new KeyboardEvent('keydown', {
                key: specConstants.ARROW_BUTTON,
            }),
        );
        expect(easelServiceSpy.selectEaselLetter).not.toHaveBeenCalled();
        expect(easelServiceSpy.manipulate).not.toHaveBeenCalled();
    });

    it('buttonDetect should call addLetterToPlaceCommand if isValidStartPosition, isValidKeyPressed and isValidGridPosition are true', async () => {
        placeLettersServiceSpy.isValidKeyPressed.and.returnValue(true);
        gridServiceSpy.isValidGridPosition.and.stub().and.returnValue(true);
        placeLettersServiceSpy.isValidStartPosition = true;
        component.buttonDetect(
            new KeyboardEvent('keypress', {
                key: specConstants.KEY_A,
            }),
        );
        expect(placeLettersServiceSpy.addLetterToPlaceCommand).toHaveBeenCalled();
        expect(easelServiceSpy.clearEaselSelection).not.toHaveBeenCalled();
        expect(easelServiceSpy.selectEaselLetter).not.toHaveBeenCalled();
    });

    it('buttonDetect should not call addLetterToPlaceCommand if isValidStartPosition is true and isValidKeyPressed false', async () => {
        placeLettersServiceSpy.isValidStartPosition = true;
        placeLettersServiceSpy.isValidKeyPressed.and.returnValue(false);
        gridServiceSpy.isValidGridPosition.and.returnValue(true);
        component.buttonDetect(
            new KeyboardEvent('keypress', {
                key: specConstants.KEY_A,
            }),
        );
        expect(placeLettersServiceSpy.addLetterToPlaceCommand).not.toHaveBeenCalled();
        expect(easelServiceSpy.clearEaselSelection).not.toHaveBeenCalled();
        expect(easelServiceSpy.selectEaselLetter).not.toHaveBeenCalled();
    });

    it('buttonDetect should not call addLetterToPlaceCommand if isValidStartPosition is true and isValidGridPosition false', async () => {
        placeLettersServiceSpy.isValidStartPosition = true;
        placeLettersServiceSpy.isValidKeyPressed.and.returnValue(true);
        gridServiceSpy.isValidGridPosition.and.returnValue(false);
        component.buttonDetect(
            new KeyboardEvent('keypress', {
                key: specConstants.KEY_A,
            }),
        );
        expect(placeLettersServiceSpy.addLetterToPlaceCommand).not.toHaveBeenCalled();
        expect(easelServiceSpy.clearEaselSelection).not.toHaveBeenCalled();
        expect(easelServiceSpy.selectEaselLetter).not.toHaveBeenCalled();
    });

    it('buttonDetect should call selectEaselLetter if isValidStartPosition is false and isValidKeyPressed true', async () => {
        placeLettersServiceSpy.isValidStartPosition = false;
        placeLettersServiceSpy.isValidKeyPressed.and.returnValue(true);
        component.buttonDetect(
            new KeyboardEvent('keypress', {
                key: specConstants.KEY_A,
            }),
        );
        expect(easelServiceSpy.selectEaselLetter).toHaveBeenCalled();
        expect(placeLettersServiceSpy.addLetterToPlaceCommand).not.toHaveBeenCalled();
        expect(easelServiceSpy.clearEaselSelection).not.toHaveBeenCalled();
    });

    it('buttonDetect should call selectEaselLetter if isValidStartPosition is false and event.key is blank tile', async () => {
        placeLettersServiceSpy.isValidStartPosition = false;
        placeLettersServiceSpy.isValidKeyPressed.and.returnValue(false);
        component.buttonDetect(
            new KeyboardEvent('keypress', {
                key: specConstants.BLANK_TILE,
            }),
        );
        expect(easelServiceSpy.selectEaselLetter).toHaveBeenCalled();
        expect(placeLettersServiceSpy.addLetterToPlaceCommand).not.toHaveBeenCalled();
        expect(easelServiceSpy.clearEaselSelection).not.toHaveBeenCalled();
    });

    it('buttonDetect should not call selectEaselLetter or clearEaselSelection if invalid position and hasAddedTilesToGrid true', async () => {
        placeLettersServiceSpy.isValidStartPosition = false;
        placeLettersServiceSpy.hasAddedTilesToGrid.and.returnValue(true);
        placeLettersServiceSpy.isValidKeyPressed.and.returnValue(false);
        component.buttonDetect(
            new KeyboardEvent('keypress', {
                key: specConstants.BLANK_TILE,
            }),
        );
        expect(easelServiceSpy.selectEaselLetter).not.toHaveBeenCalled();
        expect(placeLettersServiceSpy.addLetterToPlaceCommand).not.toHaveBeenCalled();
        expect(easelServiceSpy.clearEaselSelection).not.toHaveBeenCalled();
    });

    it('buttonDetect should call clearEaselSelection if isValidStartPosition false, key is not blank tile and isValidKeyPressed false', async () => {
        placeLettersServiceSpy.isValidStartPosition = false;
        placeLettersServiceSpy.isValidKeyPressed.and.returnValue(false);
        component.buttonDetect(
            new KeyboardEvent('keypress', {
                key: specConstants.KEY_A,
            }),
        );
        expect(easelServiceSpy.clearEaselSelection).toHaveBeenCalled();
        expect(easelServiceSpy.selectEaselLetter).not.toHaveBeenCalled();
        expect(placeLettersServiceSpy.addLetterToPlaceCommand).not.toHaveBeenCalled();
    });

    it('updatePositionOnClick should only call hasAddedTilesToGrid if at least one tile has been added', async () => {
        placeLettersServiceSpy.hasAddedTilesToGrid.and.returnValue(true);
        component.updatePositionOnClick(
            new MouseEvent('click', {
                button: MouseButton.LEFT,
                clientX: specConstants.CLICK_POSITION.x,
                clientY: specConstants.CLICK_POSITION.y,
            }),
        );
        expect(placeLettersServiceSpy.hasAddedTilesToGrid).toHaveBeenCalled();
        expect(mouseServiceSpy.updatePositionOnClick).not.toHaveBeenCalled();
        expect(placeLettersServiceSpy.setGridPositionOfClick).not.toHaveBeenCalled();
        expect(placeLettersServiceSpy.manageClickOnEmptyGridSquare).not.toHaveBeenCalled();
    });

    it('updatePositionOnClick should call all methods if no tile has been added to grid', async () => {
        placeLettersServiceSpy.hasAddedTilesToGrid.and.returnValue(false);
        component.updatePositionOnClick(
            new MouseEvent('click', {
                button: MouseButton.LEFT,
                clientX: specConstants.CLICK_POSITION.x,
                clientY: specConstants.CLICK_POSITION.y,
            }),
        );
        expect(placeLettersServiceSpy.hasAddedTilesToGrid).toHaveBeenCalled();
        expect(mouseServiceSpy.updatePositionOnClick).toHaveBeenCalled();
        expect(placeLettersServiceSpy.setGridPositionOfClick).toHaveBeenCalled();
        expect(placeLettersServiceSpy.manageClickOnEmptyGridSquare).toHaveBeenCalled();
    });

    it('onClick should not call cancelPlaceCommand if event.target is canvas', async () => {
        const mouseEvent: MouseEvent = new MouseEvent('click', { view: window });
        Object.defineProperty(mouseEvent, 'target', { value: component['gridCanvas'].nativeElement });
        component.onClick(mouseEvent);
        expect(placeLettersServiceSpy.cancelPlaceCommand).not.toHaveBeenCalled();
    });

    it('onClick should call cancelPlaceCommand if event.target is not canvas', async () => {
        component.onClick(new MouseEvent('click', { relatedTarget: null }));
        expect(placeLettersServiceSpy.cancelPlaceCommand).toHaveBeenCalled();
    });
});
