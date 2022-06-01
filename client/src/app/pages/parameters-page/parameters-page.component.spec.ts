import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Dictionary } from '@app/../../../common/model/dictionary';
import { AppMaterialModule } from '@app/modules/material.module';
import { ParametersComponent } from '@app/pages/parameters-page/parameters-page.component';
import { DataPassingService } from '@app/services/data-passing/data-passing.service';
import { DictionariesManagerService } from '@app/services/dictionaries-manager/dictionaries-manager.service';
import { UsernameValidationService } from '@app/services/username-validation/username-validation.service';
import { BehaviorSubject } from 'rxjs';
import * as componentConstants from './parameters-page.component.constants';
import * as specConstants from './parameters-page.component.spec.constants';

describe('ParametersComponent', () => {
    let component: ParametersComponent;
    let fixture: ComponentFixture<ParametersComponent>;
    let usernameServiceSpy: jasmine.SpyObj<UsernameValidationService>;
    let dataPassingSpy: jasmine.SpyObj<DataPassingService>;
    let dictsSpy: jasmine.SpyObj<DictionariesManagerService>;

    beforeEach(async () => {
        usernameServiceSpy = jasmine.createSpyObj('UsernameService', ['isValidUsername']);
        dataPassingSpy = jasmine.createSpyObj('DataPassingService', ['setInfo']);
        dictsSpy = jasmine.createSpyObj('DictionariesManagerService', ['readDictionary', 'loadDictionaryData', 'dictVerification'], {
            dictionaries: new BehaviorSubject<Dictionary[]>([]),
            isValid: false,
        });
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule, AppMaterialModule],
            declarations: [ParametersComponent],
            providers: [
                { provide: UsernameValidationService, useValue: usernameServiceSpy },
                { provide: DataPassingService, useValue: dataPassingSpy },
                { provide: DictionariesManagerService, useValue: dictsSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ParametersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('timer should not go over 300 seconds', () => {
        component.timerValueInSeconds = 300;
        component.incrementTimer();
        expect(component.timerValueInSeconds).toEqual(componentConstants.HIGHER_TIMER_VALUE);
    });

    it('timer should not go under 30 seconds', () => {
        component.timerValueInSeconds = 30;
        component.decrementTimer();
        expect(component.timerValueInSeconds).toEqual(componentConstants.LOW_TIMER_VALUE);
    });

    it('increment adds 30 seconds to the timer', () => {
        component.incrementTimer();
        expect(component.timerValueInSeconds).toEqual(specConstants.HIGH_TIMER_VALUE);
    });

    it('decrement subs 30 seconds to the timer', () => {
        component.decrementTimer();
        expect(component.timerValueInSeconds).toEqual(componentConstants.LOW_TIMER_VALUE);
    });

    it('should call the router navigate function if the username is valid', () => {
        const usernameValidSpy: jasmine.Spy<jasmine.Func> = spyOnProperty(component, 'isUsernameValid', 'get').and.returnValue(true);
        // eslint-disable-next-line dot-notation -- necessary to see if send is called on private attribute
        const navigateSpy: jasmine.Spy<jasmine.Func> = spyOn(component['router'], 'navigate').and.stub();
        component.linkChoice();
        expect(navigateSpy).toHaveBeenCalled();
        expect(usernameValidSpy).toHaveBeenCalled();
    });

    it("shouldn't call the router navigate function if the username is invalid", () => {
        spyOnProperty(component, 'isUsernameValid', 'get').and.returnValue(false);
        // eslint-disable-next-line dot-notation -- necessary to see if send is called on private attribute
        const navigateSpy: jasmine.Spy<jasmine.Func> = spyOn(component['router'], 'navigate').and.stub();
        component.linkChoice();
        expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should call dicts gestion service functions', () => {
        const event = { target: { files: [{}] } };
        component.validateDict(event);
        expect(dictsSpy.readDictionary).toHaveBeenCalled();
    });
});
