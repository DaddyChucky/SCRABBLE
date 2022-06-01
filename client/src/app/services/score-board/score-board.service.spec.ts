import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ScorePack } from '@app/../../../common/model/score-pack';
import { ScoreBoardService } from './score-board.service';
import { CLASSIC, LOG2990, TABLE_SCORE_PACK, URL_STRING } from './score-board.service.spec.constants';

describe('ScoreBoardService', () => {
    let httpMock: HttpTestingController;
    let service: ScoreBoardService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(ScoreBoardService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call fetch if getClassic is called ', async () => {
        service.getClassic().subscribe((response: ScorePack[]) => {
            expect(response.length).toEqual(1);
            expect(response[0].score).toEqual(TABLE_SCORE_PACK[0].score);
            expect(response[0].names).toEqual(TABLE_SCORE_PACK[0].names);
        }, fail);

        const req = httpMock.expectOne(`${URL_STRING}${CLASSIC}`);
        expect(req.request.method).toBe('GET');
        req.flush(TABLE_SCORE_PACK);
    });

    it('should call fetch if getLog is called ', async () => {
        service.getLog().subscribe((response: ScorePack[]) => {
            expect(response.length).toEqual(1);
            expect(response[0].score).toEqual(TABLE_SCORE_PACK[0].score);
            expect(response[0].names).toEqual(TABLE_SCORE_PACK[0].names);
        }, fail);

        const req = httpMock.expectOne(`${URL_STRING}${LOG2990}`);
        expect(req.request.method).toBe('GET');
        req.flush(TABLE_SCORE_PACK);
    });

    it('should handle http error safely for getClassic', () => {
        service.getClassic().subscribe((response: ScorePack[]) => {
            expect(response).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(`${URL_STRING}${CLASSIC}`);
        expect(req.request.method).toBe('GET');
        req.error(new ErrorEvent('fetchClassic'));
    });

    it('should handle http error safely for getLog', () => {
        service.getLog().subscribe((response: ScorePack[]) => {
            expect(response).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(`${URL_STRING}${LOG2990}`);
        expect(req.request.method).toBe('GET');
        req.error(new ErrorEvent('Random error occurred'));
    });
});
