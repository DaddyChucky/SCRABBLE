/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tile } from '@app/../../../common/model/tile';
import { TileComponent } from '@app/components/tile/tile.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { EaselService } from '@app/services/easel/easel.service';
import { PLAYER } from '@app/services/easel/easel.service.spec.constants';
import { PlayerInformationService } from '@app/services/player-information/player-information.service';
import { EaselComponent } from './easel.component';
import * as specConstants from './easel.component.spec.constants';
import { TILES } from './easel.component.spec.constants';

describe('EaselComponent', () => {
    let component: EaselComponent;
    let fixture: ComponentFixture<EaselComponent>;
    let easelServiceSpy: jasmine.SpyObj<EaselService>;
    let playerInformationServiceSpy: jasmine.SpyObj<PlayerInformationService>;

    beforeEach(() => {
        easelServiceSpy = jasmine.createSpyObj<any>(
            'EaselService',
            [
                'setTilesSizeForEasel',
                'hasLessThanSevenLetters',
                'exchangeLetters',
                'disableLeftClickSelection',
                'disableRightClickSelection',
                'removeLetterToExchange',
                'addLetterToExchange',
                'emptyLettersToExchange',
            ],
            {
                tiles: TILES,
                lettersToExchange: specConstants.LETTER_TO_EXCHANGE,
            },
        );
        playerInformationServiceSpy = jasmine.createSpyObj<any>('PlayerInformationService', [], { currentPlayer: PLAYER });
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [EaselComponent, TileComponent],
            providers: [
                { provide: EaselService, useValue: easelServiceSpy },
                { provide: PlayerInformationService, useValue: playerInformationServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        playerInformationServiceSpy.currentPlayer.tiles = TILES;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EaselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('tiles should return easel.tiles', () => {
        for (let i = 0; i < TILES.length; ++i) expect(component.tiles[i]).toEqual(TILES[i]);
    });

    it('isPlayerTurn should return isTurn from currentPlayer of playerInfo', () => {
        expect(component.isPlayerTurn).toEqual(playerInformationServiceSpy.currentPlayer.isTurn);
    });

    it('lessThanSevenLetters should call hasLessThanSevenLetters from easelService', () => {
        easelServiceSpy.hasLessThanSevenLetters.and.returnValue(false);
        expect(component.lessThanSevenLetters).toEqual(false);
        expect(easelServiceSpy.hasLessThanSevenLetters).toHaveBeenCalled();
    });

    it('hasRightClickedTile should return true if at least one tile has rightClicked true', () => {
        component.tiles.forEach((tile) => (tile.rightClicked = false));
        component.tiles[0].rightClicked = true;
        expect(component.hasRightClickedTile).toEqual(true);
    });

    it('hasRightClickedTile should return false if all tiles have rightClicked false', () => {
        component.tiles.forEach((tile) => (tile.rightClicked = false));
        expect(component.hasRightClickedTile).toEqual(false);
    });

    it('displayLettersToExchange should return letter of lettersToExchange separated by - ', () => {
        Object.defineProperty(easelServiceSpy, 'lettersToExchange', { value: specConstants.LETTER_TO_EXCHANGE });
        expect(component.displayLettersToExchange).toEqual(specConstants.DISPLAY_ONE_LETTER_OUTPUT);
    });

    it('displayLettersToExchange should return empty string if lettersToExchange is empty', () => {
        Object.defineProperty(easelServiceSpy, 'lettersToExchange', { value: '' });
        expect(component.displayLettersToExchange).toEqual('');
    });

    it('displayLettersToExchange should return all letters of lettersToExchange separated by - ', () => {
        Object.defineProperty(easelServiceSpy, 'lettersToExchange', { value: specConstants.LETTERS_TO_EXCHANGE });
        expect(component.displayLettersToExchange).toEqual(specConstants.DISPLAY_LETTERS_OUTPUT);
    });

    it('exchangeSelectedLetters should call exchangeLetters and removeAllLettersToExchange from easelService ', () => {
        const removeAllLettersToExchangeSpy: jasmine.Spy<() => void> = spyOn(component, 'removeAllLettersToExchange').and.callThrough();
        Object.defineProperty(easelServiceSpy, 'lettersToExchange', { value: specConstants.LETTERS_TO_EXCHANGE });
        component.exchangeSelectedLetters();
        expect(easelServiceSpy.exchangeLetters).toHaveBeenCalledWith();
        expect(removeAllLettersToExchangeSpy).toHaveBeenCalled();
    });

    it('removeAllLettersToExchange should call emptyLettersToExchange', () => {
        easelServiceSpy.emptyLettersToExchange.and.callThrough();
        Object.defineProperty(easelServiceSpy, 'lettersToExchange', { value: specConstants.LETTERS_TO_EXCHANGE });
        component.removeAllLettersToExchange();
        expect(easelServiceSpy.emptyLettersToExchange).toHaveBeenCalled();
    });

    it('onTileRightClick should call disableLeftClickSelection and removeLetterToExchange if rightClicked is true', () => {
        easelServiceSpy.disableLeftClickSelection.and.callThrough();
        const tileToSelect: Tile = component.tiles[0];
        tileToSelect.rightClicked = true;
        const mouseEvent: MouseEvent = new MouseEvent('click');
        component.onTileRightClick(mouseEvent, tileToSelect);
        expect(easelServiceSpy.disableLeftClickSelection).toHaveBeenCalled();
        expect(easelServiceSpy.removeLetterToExchange).toHaveBeenCalledWith(tileToSelect);
    });

    it('onTileRightClick should call disableLeftClickSelection and addLetterToExchange if rightClicked is false', () => {
        const tileToSelect: Tile = component.tiles[0];
        tileToSelect.rightClicked = false;
        const mouseEvent: MouseEvent = new MouseEvent('click');
        component.onTileRightClick(mouseEvent, tileToSelect);
        expect(easelServiceSpy.disableLeftClickSelection).toHaveBeenCalled();
        expect(easelServiceSpy.addLetterToExchange).toHaveBeenCalledWith(tileToSelect);
    });

    it('onTileLeftClick should change leftClicked of tile to true', () => {
        easelServiceSpy.disableLeftClickSelection.and.callThrough();
        component.tiles[specConstants.INDEX_E].leftClicked = false;
        component.onTileLeftClick(component.tiles[specConstants.INDEX_E]);
        expect(component.tiles[specConstants.INDEX_E].leftClicked).toEqual(true);
    });

    it('onOutsideEaselClick should not removeAllLettersToExchange and disableLeftClickSelection if click is on easel', async () => {
        const removeAllLettersToExchangeSpy: jasmine.Spy<() => void> = spyOn(component, 'removeAllLettersToExchange');
        component.onOutsideEaselClick(component['easel'].nativeElement);
        expect(removeAllLettersToExchangeSpy).not.toHaveBeenCalled();
        expect(easelServiceSpy.disableLeftClickSelection).not.toHaveBeenCalled();
    });

    it('onOutsideEaselClick should removeAllLettersToExchange and disableLeftClickSelection if click is outside easel', async () => {
        const removeAllLettersToExchangeSpy: jasmine.Spy<() => void> = spyOn(component, 'removeAllLettersToExchange');
        const outsideHTMLElement: HTMLCanvasElement = document.createElement('canvas');
        component.onOutsideEaselClick(outsideHTMLElement);
        expect(removeAllLettersToExchangeSpy).toHaveBeenCalled();
        expect(easelServiceSpy.disableLeftClickSelection).toHaveBeenCalled();
    });
});
