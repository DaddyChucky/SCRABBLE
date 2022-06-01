/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { TIMER_INITIAL_VALUE } from '@app/../../../common/model/constants';
import { ViewService } from '@app/services/view/view.service';

describe('ViewService', () => {
    let service: ViewService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ViewService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setTimerValue should assign timer to attribute timerValueInSeconds', () => {
        service.setTimerValue(TIMER_INITIAL_VALUE);
        expect(TIMER_INITIAL_VALUE).toEqual(service['timer']);
    });
});
