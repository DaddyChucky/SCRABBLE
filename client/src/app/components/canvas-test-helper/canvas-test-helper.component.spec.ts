import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from './canvas-test-helper.component';
import * as specConstants from './canvas-test-helper.component.spec.constants';

describe('CanvasTestHelper', () => {
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
    });

    it('should be created', () => {
        expect(canvasTestHelper).toBeTruthy();
    });

    it('createCanvas should create a HTMLCanvasElement with good dimensions', () => {
        const width: number = specConstants.INITIAL_WIDTH;
        const height: number = specConstants.INITIAL_HEIGHT;
        const canvas: HTMLCanvasElement = CanvasTestHelper.createCanvas(width, height);
        expect(canvas).toBeInstanceOf(HTMLCanvasElement);
        expect(canvas.width).toBe(width);
        expect(canvas.height).toBe(height);
    });
});
