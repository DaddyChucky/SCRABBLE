/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { Dictionary } from '@app/../../../common/model/dictionary';
import { AppMaterialModule } from '@app/modules/material.module';
import { DictionariesManagerService } from '@app/services/dictionaries-manager/dictionaries-manager.service';
import { BehaviorSubject } from 'rxjs';
import { UploadDictionaryDialogComponent } from './upload-dictionary-dialog.component';
import * as specConstants from './upload-dictionary-dialog.component.spec.constants';

describe('UploadDictionaryDialogComponent', () => {
    let component: UploadDictionaryDialogComponent;
    let fixture: ComponentFixture<UploadDictionaryDialogComponent>;
    let dictionariesManagerServiceSpy: jasmine.SpyObj<DictionariesManagerService>;

    beforeEach(async () => {
        dictionariesManagerServiceSpy = jasmine.createSpyObj<any>(
            'DictionariesManagerService',
            ['addNewDictionary', 'readDictionary', 'dictVerification', 'isValidNewDictionary'],
            {
                dictionaries: new BehaviorSubject<Dictionary[]>(specConstants.DICTIONARIES),
                isValid: true,
            },
        );
        await TestBed.configureTestingModule({
            declarations: [UploadDictionaryDialogComponent],
            imports: [AppMaterialModule],
            providers: [{ provide: DictionariesManagerService, useValue: dictionariesManagerServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadDictionaryDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('isDictionaryValid should return false if file not defined', () => {
        component.file = '';
        expect(component.isDictionaryValid).toBeFalsy();
    });

    it('isDictionaryValid should return true and call isValidNewDictionary', () => {
        dictionariesManagerServiceSpy.isValidNewDictionary.and.stub().and.returnValue(true);
        component.file = specConstants.FILE_NAME_AND_PATH;
        expect(component.isDictionaryValid).toBeTruthy();
    });

    it('isValidSubmission should return isValid from dictionariesManager', () => {
        expect(component.isValidSubmission).toBeTruthy();
    });

    it('fileName should return empty string if file not defined', () => {
        component.file = '';
        expect(component.fileName).toEqual('');
    });

    it('fileName should return file name from file', () => {
        component.file = specConstants.FILE_NAME_AND_PATH;
        expect(component.fileName).toEqual(specConstants.FILE_NAME);
    });

    it('sendNewDictionary should call addNewDictionary from dictionariesManagerService and resetFile', () => {
        const resetFileSpy: jasmine.Spy<() => void> = spyOn(component, 'resetFile');
        dictionariesManagerServiceSpy.addNewDictionary.and.stub();
        component.sendNewDictionary();
        expect(dictionariesManagerServiceSpy.addNewDictionary).toHaveBeenCalled();
        expect(resetFileSpy).toHaveBeenCalled();
    });

    it('resetFile should call dictVerification from dictionariesManagerService and empty file', () => {
        component.file = specConstants.FILE_NAME_AND_PATH;
        dictionariesManagerServiceSpy.dictVerification.and.stub();
        component.resetFile();
        expect(dictionariesManagerServiceSpy.dictVerification).toHaveBeenCalled();
        expect(component.file).toEqual('');
    });

    it('validateDict should call dictVerification and readDictionary from dictionariesManagerService', fakeAsync(() => {
        component.file = specConstants.FILE_NAME_AND_PATH;
        dictionariesManagerServiceSpy.readDictionary.and.stub().and.returnValue(specConstants.FILE_NAME);
        dictionariesManagerServiceSpy.dictVerification.and.stub();
        const componentElement = fixture.nativeElement;
        const uploadFileInput: HTMLInputElement = componentElement.querySelector('#upload');
        uploadFileInput.value = '';
        uploadFileInput.dispatchEvent(new Event('change'));
        tick(0);
        expect(dictionariesManagerServiceSpy.dictVerification).toHaveBeenCalled();
        expect(dictionariesManagerServiceSpy.readDictionary).toHaveBeenCalled();
        flush();
    }));
});
