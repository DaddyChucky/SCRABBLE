import { Injectable } from '@angular/core';
import { Vec2 } from '@app/../../../common/model/vec2';
import { Mouse } from '@app/classes/mouse';
import { MouseButton } from '@app/classes/mouse-button';
import * as serviceConstants from './mouse.service.constants';

@Injectable({
    providedIn: 'root',
})
export class MouseService {
    private mouse;

    constructor() {
        this.mouse = new Mouse(serviceConstants.DEFAULT_POSITION);
    }

    updatePositionOnClick(event: MouseEvent): void {
        if (event.button === MouseButton.LEFT) this.mouse.position = { x: event.offsetX, y: event.offsetY };
    }

    get mousePosition(): Vec2 {
        return this.mouse.position;
    }
}
