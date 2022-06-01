import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TILE_FONT_SIZE_GRID } from '@app/classes/constants';
import { AppMaterialModule } from '@app/modules/material.module';
import { SliderFontSizeComponent } from './slider-font-size.component';

describe('SliderFontSizeComponent', () => {
    let component: SliderFontSizeComponent;
    let fixture: ComponentFixture<SliderFontSizeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SliderFontSizeComponent],
            imports: [AppMaterialModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SliderFontSizeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit new fontSize when changeFontSizeOfTiles() is called', () => {
        component.fontSizeValue = TILE_FONT_SIZE_GRID;
        const fontSizeChangeEmitSpy: jasmine.Spy<(value?: number | undefined) => void> = spyOn(component.fontSizeChange, 'emit');
        component.changeFontSizeOfTiles();
        expect(fontSizeChangeEmitSpy).toHaveBeenCalledWith(component.fontSizeValue);
    });
});
