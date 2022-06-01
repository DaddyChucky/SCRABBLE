/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Dictionary } from '@app/../../../common/model/dictionary';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';
import { AdminDatabaseLinkService } from '@app/services/admin-db-link/admin-db-link.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DictionariesManagerService } from './dictionaries-manager.service';
import * as specConstants from './dictionaries-manager.service.spec.constants';

describe('DictionariesManagerService', () => {
    let service: DictionariesManagerService;
    let httpMock: HttpTestingController;
    let adminDatabaseLinkServiceSpy: jasmine.SpyObj<AdminDatabaseLinkService>;

    beforeEach(() => {
        adminDatabaseLinkServiceSpy = jasmine.createSpyObj<any>(
            'AdminDatabaseLinkService',
            ['loadVirtualPlayerData', 'resetDatabase', 'handleError'],
            {
                expertPlayers: new BehaviorSubject<VirtualPlayerInfo[]>([]),
                beginnerPlayers: new BehaviorSubject<VirtualPlayerInfo[]>([]),
            },
        );
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: AdminDatabaseLinkService, useValue: adminDatabaseLinkServiceSpy }],
        });
        service = TestBed.inject(DictionariesManagerService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return same as getDictsResume', () => {
        service.loadDictionaryData();
        const req = httpMock.expectOne(`${specConstants.URL_STRING}`);
        expect(req.request.method).toBe('GET');
        req.flush([specConstants.RESUME_TEST]);
    });

    it(' should return a resume if getAllDictsResume is called', () => {
        service['getAllDictsResume']().subscribe((response: Dictionary[]) => {
            expect(response.length).toEqual(1);
            expect(response[0].title).toEqual('francais');
            expect(response[0].description).toEqual('description de base');
            expect(response[0].words).not.toBeDefined();
        }, fail);
        const req = httpMock.expectOne(`${specConstants.URL_STRING}`);
        expect(req.request.method).toBe('GET');
        req.flush([specConstants.RESUME_TEST]);
    });

    it(' should post a dict if postDictionary is called', () => {
        service.postDictionary().subscribe((response: Dictionary) => {
            expect(response.title).toEqual('franglais');
            expect(response.description).toEqual('description de base');
            expect(response.words).toEqual([]);
        }, fail);
        const req = httpMock.expectOne(`${specConstants.URL_STRING}`);
        expect(req.request.method).toBe('POST');
        req.flush(specConstants.DICT_TEST);
    });

    it('should call a FileReader for valid file param', () => {
        const fileSpy: jasmine.Spy<jasmine.Func> = spyOn(service['reader'], 'readAsText').and.stub();
        service.readDictionary(new File([], 'pppoopoo'));
        expect(fileSpy).not.toHaveBeenCalled();
    });

    it('should not call a FileReader for invalid file param', () => {
        const fileSpy: jasmine.Spy<jasmine.Func> = spyOn(service['reader'], 'readAsText').and.stub();
        service.readDictionary(null as unknown as File);
        expect(fileSpy).not.toHaveBeenCalled();
    });

    it('should return true if json format', () => {
        expect(service['isJson'](specConstants.STRING_DICT_TEST)).toEqual(true);
    });

    it('should return false if not json format', () => {
        expect(service['isJson']('')).toEqual(false);
    });

    it('should return false if null', () => {
        expect(service['isJson']('null')).toEqual(false);
    });

    it('should return true if dict has right attributes', () => {
        service['dictionary'] = specConstants.DICT_TEST;
        expect(service['isDictionary']()).toEqual(true);
    });

    it('should return false if dict has missing attributes', () => {
        service['isJson'](specConstants.STRING_EMPTY_DICT_TEST);
        expect(service['isDictionary']()).toEqual(false);
    });

    it('should return true if dict has same name', () => {
        service['dictionary'] = specConstants.RESUME_TEST;
        service['dictionaries'].getValue().push(specConstants.RESUME_TEST);
        expect(service['isSameName']()).toEqual(true);
    });

    it('should return false if dict not same name', () => {
        service['dictionary'] = specConstants.RESUME_TEST;
        service['dictionaries'].getValue().push(specConstants.DICT_TEST);
        expect(service['isSameName']()).toEqual(false);
    });

    it('should turn valid to true if valid dict', () => {
        service.dictVerification(specConstants.STRING_DICT_TEST);
        expect(service.isValid).toEqual(true);
    });

    it('should turn valid to false if invalid dict', () => {
        service.dictVerification(specConstants.STRING_INVALID_DICT_TEST);
        expect(service.isValid).toEqual(false);
    });

    it('isValidDictionaryTitle should return false if title is undefined', () => {
        expect(service.isValidDictionaryTitle('')).toEqual(false);
    });

    it('isValidDictionaryTitle should return true if title is not already taken by another dictionary', () => {
        expect(service.isValidDictionaryTitle(specConstants.VALID_NEW_TITLE)).toEqual(true);
    });

    it('isValidDictionaryTitle should return false if title is already taken by another dictionary', () => {
        service['dictionaries'].getValue().push(specConstants.ENGLISH_DICTIONARY);
        expect(service.isValidDictionaryTitle(specConstants.INVALID_NEW_TITLE)).toEqual(false);
    });

    it('addNewDictionary should not call postDictionary if isValid is false', () => {
        const postDictionarySpy: jasmine.Spy<() => Observable<Dictionary>> = spyOn(service, 'postDictionary');
        service.isValid = false;
        service.addNewDictionary();
        expect(postDictionarySpy).not.toHaveBeenCalled();
    });

    it('addNewDictionary should call postDictionary and reset isValid if isValid is true', fakeAsync(() => {
        const loadDictionaryDataSpy: jasmine.Spy<() => void> = spyOn(service, 'loadDictionaryData');
        const postDictionarySpy: jasmine.Spy<jasmine.Func> = spyOn(service, 'postDictionary')
            .and.stub()
            .and.returnValue(of(new Observable<Dictionary>()));
        service.isValid = true;
        service.addNewDictionary();
        tick();
        expect(postDictionarySpy).toHaveBeenCalled();
        expect(service.isValid).toBeFalsy();
        expect(loadDictionaryDataSpy).toHaveBeenCalled();
    }));

    it('should call fetch if getDictionary is called ', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        service.getDictionary(specConstants.RESUME_TEST.title).subscribe(() => {}, fail);
        const req = httpMock.expectOne(`${specConstants.URL_GET_FRANCAIS_DICT}`);
        expect(req.request.method).toBe('GET');
        req.flush([specConstants.RESUME_TEST]);
    });

    it('should call fetch if deleteDictionary is called ', async () => {
        service.deleteDictionary(specConstants.RESUME_TEST).subscribe((response: Dictionary) => {
            expect(response.title).toEqual(specConstants.RESUME_TEST.title);
            expect(response.description).toEqual(specConstants.RESUME_TEST.description);
        }, fail);

        const req = httpMock.expectOne(`${specConstants.URL_STRING}${specConstants.RESUME_TEST.title}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(specConstants.RESUME_TEST);
    });

    it('should call fetch if modifyDictionary is called ', async () => {
        service.modifyDictionary(specConstants.RESUME_TEST.title, specConstants.ENGLISH_DICTIONARY).subscribe((response: Dictionary) => {
            expect(response.title).toEqual(specConstants.ENGLISH_DICTIONARY.title);
            expect(response.description).toEqual(specConstants.ENGLISH_DICTIONARY.description);
        }, fail);

        const req = httpMock.expectOne(`${specConstants.URL_STRING}${specConstants.RESUME_TEST.title}`);
        expect(req.request.method).toBe('PATCH');
        req.flush(specConstants.ENGLISH_DICTIONARY);
    });

    it('should call delete if resetAllDictionaries is called ', async () => {
        service.resetAllDictionaries().subscribe();
        const req = httpMock.expectOne(`${specConstants.URL_STRING}`);
        expect(req.request.method).toBe('DELETE');
    });
});
