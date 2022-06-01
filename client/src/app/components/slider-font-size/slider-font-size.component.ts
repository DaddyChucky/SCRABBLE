import { Component, EventEmitter, Output } from '@angular/core';
import { SLIDER_FONT_SIZE_STEP, TILE_FONT_SIZE_GRID, TILE_FONT_SIZE_GRID_MAX, TILE_FONT_SIZE_GRID_MIN } from '@app/classes/constants';

@Component({
    selector: 'app-slider-font-size',
    templateUrl: './slider-font-size.component.html',
    styleUrls: ['./slider-font-size.component.scss'],
})
export class SliderFontSizeComponent {
    @Output() fontSizeChange = new EventEmitter<number>();
    fontSizeValue = TILE_FONT_SIZE_GRID;
    maxSizeValue = TILE_FONT_SIZE_GRID_MAX;
    minSizeValue = TILE_FONT_SIZE_GRID_MIN;
    step = SLIDER_FONT_SIZE_STEP;

    changeFontSizeOfTiles(): void {
        this.fontSizeChange.emit(this.fontSizeValue);
    }
}
