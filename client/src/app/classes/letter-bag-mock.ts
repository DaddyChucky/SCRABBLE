import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';

export class LetterBagServiceMock extends LetterBagService {
    moveCounter: number = 0;
}
