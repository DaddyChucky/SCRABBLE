import { TIMER_INITIAL_VALUE } from '@app/../../../common/model/constants';
import { ViewService } from '@app/services/view/view.service';

export class ViewServiceMock extends ViewService {
    timerValue: number = TIMER_INITIAL_VALUE;

    override get timer(): number {
        return this.timerValue;
    }
    override setTimerValue(tValue: number) {
        this.timerValue = tValue;
    }
}
