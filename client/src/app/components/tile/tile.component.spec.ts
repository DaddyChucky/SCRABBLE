import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { TileService } from '@app/services/tile/tile.service';
import { TileComponent } from './tile.component';
import * as specConstants from './tile.component.spec.constants';

describe('TileComponent', () => {
    let component: TileComponent;
    let fixture: ComponentFixture<TileComponent>;
    let tileServiceSpy: jasmine.SpyObj<TileService>;

    beforeEach(() => {
        tileServiceSpy = jasmine.createSpyObj(TileService, [
            'tileContext',
            'onOutsideClick',
            'drawTileBackground',
            'drawTileInfo',
            'clearTile',
            'onClick',
        ]);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TileComponent],
            imports: [AppMaterialModule],
            providers: [{ provide: TileService, useValue: tileServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TileComponent);
        component = fixture.componentInstance;
        component.playerTile = specConstants.TILE;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('get width() return attribute width from tile', () => {
        expect(component.width).toEqual(specConstants.TILE.width);
    });

    it('get height() return attribute width from tile', () => {
        expect(component.height).toEqual(specConstants.TILE.height);
    });

    it('get playerTile() return tile', () => {
        expect(component.playerTile).toEqual(specConstants.TILE);
    });
});
