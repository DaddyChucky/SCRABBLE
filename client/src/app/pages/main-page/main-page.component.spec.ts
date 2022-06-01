/* eslint-disable dot-notation */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppMaterialModule } from '@app/modules/material.module';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { DataPassingService } from '@app/services/data-passing/data-passing.service';
import * as specConstants from './main-page.component.spec.constants';

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let dataPassingServiceSpy: jasmine.SpyObj<DataPassingService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        dataPassingServiceSpy = jasmine.createSpyObj('dataPassingService', ['setGameMode', 'setMode']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [MainPageComponent],
            providers: [
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: DataPassingService, useValue: dataPassingServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('button "mode classique" should call saveMode()', () => {
        const classicButton = fixture.debugElement.query(By.css(specConstants.ID_CLASSIC_BUTTON));
        spyOn(component, 'saveMode');
        classicButton.triggerEventHandler('click', null);
        expect(component.saveMode).toHaveBeenCalled();
    });

    it('button "mode Log2990" should call saveMode()', () => {
        const log2990Button = fixture.debugElement.query(By.css(specConstants.ID_LOG2990_BUTTON));
        spyOn(component, 'saveMode');
        log2990Button.triggerEventHandler('click', null);
        expect(component.saveMode).toHaveBeenCalled();
    });

    it('saveMode(true) should call setGameMode with true', () => {
        component.saveMode(true);
        expect(dataPassingServiceSpy.setGameMode).toHaveBeenCalledWith(true);
    });

    it('saveMode(false) should call setGameMode with false', () => {
        component.saveMode(false);
        expect(dataPassingServiceSpy.setGameMode).toHaveBeenCalledWith(false);
    });

    it('saveMode() should call navigate', () => {
        routerSpy.navigate.and.stub();
        component.saveMode(true);
        expect(routerSpy.navigate).toHaveBeenCalled();
    });

    it('openScores should call open from MatDialog', () => {
        component.openScores();
        expect(matDialogSpy.open).toHaveBeenCalled();
    });
});
