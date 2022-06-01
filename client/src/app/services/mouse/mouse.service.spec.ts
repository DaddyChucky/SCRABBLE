import { TestBed } from '@angular/core/testing';
import { MouseButton } from '@app/classes/mouse-button';
import { MouseService } from './mouse.service';
import * as serviceConstants from './mouse.service.constants';
import * as specConstants from './mouse.service.spec.constants';

describe('MouseService', () => {
    let service: MouseService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MouseService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('mousePosition should return this.mouse.position', () => {
        expect(service.mousePosition).toEqual(serviceConstants.DEFAULT_POSITION);
    });

    it('updatePositionOnClick should change mouse position if left click', async () => {
        service.updatePositionOnClick(
            new MouseEvent('click', {
                button: MouseButton.LEFT,
                clientX: specConstants.CLICK_POSITION.x,
                clientY: specConstants.CLICK_POSITION.y,
            }),
        );
        expect(service.mousePosition).toEqual(specConstants.CLICK_POSITION);
    });

    it('updatePositionOnClick should not change mouse position if left click', async () => {
        service.updatePositionOnClick(
            new MouseEvent('click', {
                button: MouseButton.RIGHT,
                clientX: specConstants.NEW_CLICK_POSITION.x,
                clientY: specConstants.NEW_CLICK_POSITION.y,
            }),
        );
        expect(service.mousePosition).not.toEqual(specConstants.NEW_CLICK_POSITION);
    });
});
