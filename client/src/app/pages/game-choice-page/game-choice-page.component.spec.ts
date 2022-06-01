import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameChoiceComponent } from '@app/pages/game-choice-page/game-choice-page.component';
import { DataPassingService } from '@app/services/data-passing/data-passing.service';

import SpyObj = jasmine.SpyObj;

describe('GameChoiceComponent', () => {
    let component: GameChoiceComponent;
    let fixture: ComponentFixture<GameChoiceComponent>;
    let dataPassingServiceSpy: SpyObj<DataPassingService>;

    beforeEach(async () => {
        dataPassingServiceSpy = jasmine.createSpyObj('dataPassingService', ['setInfo', 'setMode']);
        await TestBed.configureTestingModule({
            declarations: [GameChoiceComponent],
            providers: [{ provide: DataPassingService, useValue: dataPassingServiceSpy }],
            imports: [AppMaterialModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameChoiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('button "Partie Solo" should call gameModeChoice', () => {
        const soloButton = fixture.debugElement.query(By.css('#solo'));
        spyOn(component, 'gameModeChoice');
        soloButton.triggerEventHandler('click', null);
        expect(component.gameModeChoice).toHaveBeenCalled();
    });

    it('button "Partie multijoueur" should call gameModeChoice', () => {
        const multiButton = fixture.debugElement.query(By.css('#creermulti'));
        spyOn(component, 'gameModeChoice');
        multiButton.triggerEventHandler('click', null);
        expect(component.gameModeChoice).toHaveBeenCalled();
    });

    it('gameModeChoice should call setInfo from dataPassingService', () => {
        component.gameModeChoice(true);
        expect(dataPassingServiceSpy.setMode).toHaveBeenCalled();
    });
});
