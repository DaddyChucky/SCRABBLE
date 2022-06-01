/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dictionary } from '@app/../../../common/model/dictionary';
import { UploadDictionaryDialogComponent } from '@app/components/upload-dictionary-dialog/upload-dictionary-dialog.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { DictionariesManagerService } from '@app/services/dictionaries-manager/dictionaries-manager.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DictionaryTableComponent } from './dictionary-table.component';
import * as componentConstants from './dictionary-table.component.constants';
import * as specConstants from './dictionary-table.component.spec.constants';

describe('DictionaryTableComponent', () => {
    let component: DictionaryTableComponent;
    let fixture: ComponentFixture<DictionaryTableComponent>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;
    let dictionariesManagerServiceSpy: jasmine.SpyObj<DictionariesManagerService>;
    let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<UploadDictionaryDialogComponent>>;
    let documentSpy: jasmine.SpyObj<Document>;
    let anchorElementSpy: jasmine.SpyObj<HTMLElement>;

    beforeEach(async () => {
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        dictionariesManagerServiceSpy = jasmine.createSpyObj<any>(
            'DictionariesManagerService',
            ['loadDictionaryData', 'deleteDictionary', 'isValidDictionaryTitle', 'modifyDictionary', 'getDictionary'],
            {
                dictionaries: new BehaviorSubject<Dictionary[]>(specConstants.DICTIONARIES),
            },
        );
        documentSpy = jasmine.createSpyObj('Document', ['getElementById', 'createElement']);
        anchorElementSpy = jasmine.createSpyObj('HTMLElement', ['hasAttribute', 'setAttribute', 'click']);

        await TestBed.configureTestingModule({
            declarations: [DictionaryTableComponent],
            imports: [AppMaterialModule],
            providers: [
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: DictionariesManagerService, useValue: dictionariesManagerServiceSpy },
                { provide: MatDialogRef, useValue: matDialogRefSpy },
                { provide: Document, useValue: documentSpy },
                { provide: HTMLElement, useValue: anchorElementSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DictionaryTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.dictionariesInput = specConstants.DICTIONARIES_INPUT;
        component.dictionaries = specConstants.DICTIONARIES;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('updatedDictionaries should create and return dictionariesInput', () => {
        component.dictionariesInput = [];
        expect(component.updatedDictionaries).toEqual(specConstants.DICTIONARIES);
    });

    it('updatedDictionaries should return dictionariesInput', () => {
        component.dictionariesInput = specConstants.DICTIONARIES;
        component.dictionaries = specConstants.DICTIONARIES;
        expect(component.updatedDictionaries).toEqual(specConstants.DICTIONARIES);
    });

    it('isValidDictionaryInfo should return true if isValidTitle is true and description is not empty', () => {
        dictionariesManagerServiceSpy.isValidDictionaryTitle.and.stub().and.returnValue(true);
        expect(component.isValidDictionaryInfo(specConstants.INDEX_VALID_DICTIONARY)).toBeTruthy();
    });

    it('isValidDictionaryInfo should return false if isValidTitle is true and description is empty', () => {
        dictionariesManagerServiceSpy.isValidDictionaryTitle.and.stub().and.returnValue(true);
        expect(component.isValidDictionaryInfo(specConstants.INDEX_INVALID_DICTIONARY)).toBeFalsy();
    });

    it('isDefaultDictionary should return true if title is default dictionary', () => {
        expect(component.isDefaultDictionary(componentConstants.DEFAULT_DICTIONARY)).toBeTruthy();
    });

    it('isDefaultDictionary should return false if title is not default dictionary', () => {
        for (const dictionary of specConstants.DICTIONARIES) {
            expect(component.isDefaultDictionary(dictionary.title)).toBeFalsy();
        }
    });

    it('openUploadDialog should call open from dialog and afterClosed', fakeAsync(() => {
        matDialogRefSpy.afterClosed.and.stub().and.returnValue(of(new Observable<Dictionary>()));
        matDialogSpy.open.and.stub().and.returnValue(matDialogRefSpy);
        component.openUploadDialog();
        tick();
        expect(matDialogSpy.open).toHaveBeenCalled();
        expect(matDialogRefSpy.afterClosed).toHaveBeenCalled();
        expect(dictionariesManagerServiceSpy.loadDictionaryData).toHaveBeenCalled();
    }));

    it('activateDictionaryEdit should call loadDictionaryData from dictionariesManager and set active dictionary', () => {
        dictionariesManagerServiceSpy.loadDictionaryData.and.stub();
        component.activateDictionaryEdit(specConstants.VALID_NEW_DICTIONARY);
        expect(dictionariesManagerServiceSpy.loadDictionaryData).toHaveBeenCalled();
        expect(component.activeDictionaryEdit).toEqual(specConstants.VALID_NEW_DICTIONARY);
    });

    it('canEditDictionary should return true if dictionary is active dictionary', () => {
        component.activeDictionaryEdit = specConstants.VALID_NEW_DICTIONARY;
        expect(component.canEditDictionary(specConstants.VALID_NEW_DICTIONARY)).toBeTruthy();
    });

    it('canEditDictionary should return false if dictionary is not active dictionary', () => {
        component.activeDictionaryEdit = specConstants.VALID_NEW_DICTIONARY;
        expect(component.canEditDictionary(specConstants.DICTIONARIES[0])).toBeFalsy();
    });

    it('editDictionary should call modifyDictionary from dictionariesManagerService', fakeAsync(() => {
        dictionariesManagerServiceSpy.modifyDictionary.and.stub().and.returnValue(of(new Observable<Dictionary>()));
        component.editDictionary(0);
        tick();
        expect(dictionariesManagerServiceSpy.modifyDictionary).toHaveBeenCalled();
        expect(dictionariesManagerServiceSpy.loadDictionaryData).toHaveBeenCalled();
        expect(component.activeDictionaryEdit).toEqual({} as Dictionary);
    }));

    it('downloadDictionary should not call setAnchorElementForDownload and isAnchorElementReady if anchorElement is null', () => {
        const setAnchorElementForDownloadSpy = spyOn<any>(component, 'setAnchorElementForDownload');
        const isAnchorElementReadySpy = spyOn<any>(component, 'isAnchorElementReady').and.stub().and.returnValue(true);
        const anchorElement: HTMLAnchorElement = document.createElement('a');
        anchorElement.id = specConstants.DICTIONARIES[0].title;
        documentSpy.getElementById.and.stub().and.returnValue(anchorElement);
        component.downloadDictionary(specConstants.DICTIONARIES[0]);
        expect(isAnchorElementReadySpy).not.toHaveBeenCalled();
        expect(setAnchorElementForDownloadSpy).not.toHaveBeenCalled();
    });

    it('downloadDictionary should call only called isAnchorElementReady if true and not setAnchorElementForDownload', () => {
        const setAnchorElementForDownloadSpy = spyOn<any>(component, 'setAnchorElementForDownload');
        const isAnchorElementReadySpy = spyOn<any>(component, 'isAnchorElementReady').and.stub().and.returnValue(true);
        const anchorElement: HTMLAnchorElement = document.createElement('a');
        anchorElement.id = specConstants.DICTIONARIES[0].title;
        spyOn(document, 'getElementById').and.callFake(() => {
            {
                return anchorElement;
            }
        });
        component.downloadDictionary(specConstants.DICTIONARIES[0]);
        expect(isAnchorElementReadySpy).toHaveBeenCalled();
        expect(setAnchorElementForDownloadSpy).not.toHaveBeenCalled();
    });

    it('downloadDictionary should call only called isAnchorElementReady and setAnchorElementForDownload', () => {
        const setAnchorElementForDownloadSpy = spyOn<any>(component, 'setAnchorElementForDownload');
        const isAnchorElementReadySpy = spyOn<any>(component, 'isAnchorElementReady').and.stub().and.returnValue(false);
        const anchorElement: HTMLAnchorElement = document.createElement('a');
        anchorElement.id = specConstants.DICTIONARIES[0].title;
        spyOn(document, 'getElementById').and.callFake(() => {
            {
                return anchorElement;
            }
        });
        component.downloadDictionary(specConstants.DICTIONARIES[0]);
        expect(isAnchorElementReadySpy).toHaveBeenCalled();
        expect(setAnchorElementForDownloadSpy).toHaveBeenCalled();
    });

    it('cancelDictionaryEdit should call loadDictionaryData from dictionariesManagerService and reset activeDictionaryEdit', () => {
        dictionariesManagerServiceSpy.loadDictionaryData.and.stub();
        component.cancelDictionaryEdit(specConstants.INDEX_DICTIONARY_TO_CANCEL);
        expect(dictionariesManagerServiceSpy.loadDictionaryData).toHaveBeenCalled();
        expect(component.activeDictionaryEdit).toEqual({} as Dictionary);
    });

    it('deleteDictionary should call deleteDictionary from dictionariesManagerService', fakeAsync(() => {
        dictionariesManagerServiceSpy.deleteDictionary.and.stub().and.returnValue(of(new Observable<Dictionary>()));
        component.deleteDictionary(specConstants.DICTIONARIES[0]);
        tick();
        expect(dictionariesManagerServiceSpy.deleteDictionary).toHaveBeenCalled();
        expect(dictionariesManagerServiceSpy.loadDictionaryData).toHaveBeenCalled();
    }));

    it('isValidTitle should return true if title is activeDictionaryEdit and isValidDictionaryTitle is false', () => {
        dictionariesManagerServiceSpy.isValidDictionaryTitle.and.stub().and.returnValue(false);
        component.activeDictionaryEdit = specConstants.VALID_NEW_DICTIONARY;
        expect(component['isValidTitle'](specConstants.VALID_NEW_DICTIONARY.title)).toBeTruthy();
        expect(dictionariesManagerServiceSpy.isValidDictionaryTitle).toHaveBeenCalled();
    });

    it('isValidTitle should return true if title is not activeDictionaryEdit and isValidDictionaryTitle is true', () => {
        dictionariesManagerServiceSpy.isValidDictionaryTitle.and.stub().and.returnValue(true);
        component.activeDictionaryEdit = specConstants.VALID_NEW_DICTIONARY;
        expect(component['isValidTitle'](specConstants.INVALID_DICTIONARY.title)).toBeTruthy();
        expect(dictionariesManagerServiceSpy.isValidDictionaryTitle).toHaveBeenCalled();
    });

    it('isValidTitle should return false if title is not activeDictionaryEdit and isValidDictionaryTitle is false', () => {
        dictionariesManagerServiceSpy.isValidDictionaryTitle.and.stub().and.returnValue(false);
        component.activeDictionaryEdit = specConstants.VALID_NEW_DICTIONARY;
        expect(component['isValidTitle'](specConstants.INVALID_DICTIONARY.title)).toBeFalsy();
        expect(dictionariesManagerServiceSpy.isValidDictionaryTitle).toHaveBeenCalled();
    });

    it('isAnchorElementReady should return false if attribute DOWNLOAD et HREF are not set', () => {
        anchorElementSpy.hasAttribute.and.stub().and.returnValue(false);
        expect(component['isAnchorElementReady'](document.createElement('a'))).toBeFalsy();
    });

    it('isAnchorElementReady should return true if attribute DOWNLOAD et HREF are set', () => {
        anchorElementSpy.hasAttribute.and.stub().and.returnValue(true);
        const anchorElement: HTMLAnchorElement = document.createElement('a');
        anchorElement.href = specConstants.HREF_VALUE;
        anchorElement.download = specConstants.DOWNLOAD_VALUE;
        expect(component['isAnchorElementReady'](anchorElement)).toBeTruthy();
    });

    it('setAnchorElementForDownload should call getDictionary', (done) => {
        dictionariesManagerServiceSpy.getDictionary.and.stub().and.returnValue(of(new Observable<Dictionary>()));
        anchorElementSpy.click.and.stub();
        anchorElementSpy.setAttribute.and.stub();
        component.dictionaryToDownload = specConstants.DICTIONARIES[0];
        setTimeout(() => {
            component['setAnchorElementForDownload'](anchorElementSpy, specConstants.DICTIONARIES[0]);
            expect(dictionariesManagerServiceSpy.getDictionary).toHaveBeenCalled();
            done();
        }, componentConstants.WAIT_TIME);
    });
});
