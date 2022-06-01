/* eslint-disable dot-notation */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { ScoreBoardService } from '@app/services/score-board/score-board.service';
import { of } from 'rxjs';
import { ScoresComponent } from './scores.component';
import * as specConstants from './scores.component.spec.constants';

describe('ScoresComponent', () => {
    let component: ScoresComponent;
    let fixture: ComponentFixture<ScoresComponent>;
    let scoreServiceSpy: jasmine.SpyObj<ScoreBoardService>;

    beforeEach(async () => {
        scoreServiceSpy = jasmine.createSpyObj('ScoreBoardService', ['getClassic', 'getLog']);
        scoreServiceSpy.getClassic.and.returnValue(of([specConstants.TEST_SCORE_PACK]));
        scoreServiceSpy.getLog.and.returnValue(of([specConstants.TEST_SCORE_PACK]));
        await TestBed.configureTestingModule({
            declarations: [ScoresComponent],
            imports: [HttpClientTestingModule, AppMaterialModule],
            providers: [{ provide: ScoreBoardService, useValue: scoreServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ScoresComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(scoreServiceSpy.getClassic).toHaveBeenCalled();
        expect(scoreServiceSpy.getLog).toHaveBeenCalled();
    });
});
