import { TestBed } from '@angular/core/testing';
import { DataPassingService } from '@app/services/data-passing/data-passing.service';
import * as specConstants from './data-passing.service.spec.constants';

describe('DataPassingService', () => {
    let service: DataPassingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DataPassingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setInfo should set username, dict, timer, and isSolo', () => {
        service.setInfo(specConstants.MOCK_INFOS_DEFAULT);
        expect(service.isSolo).toEqual(specConstants.MOCK_INFOS_DEFAULT.isSolo);
        expect(service.dict).toEqual(specConstants.MOCK_INFOS_DEFAULT.dict);
        expect(service.timer).toEqual(specConstants.MOCK_INFOS_DEFAULT.timer);
        expect(service.username).toEqual(specConstants.MOCK_INFOS_DEFAULT.username);
    });

    it('setMode with true input should set isSolo to true', () => {
        service.setMode(true);
        expect(service.isSolo).toBeTruthy();
    });

    it('setMode with false input should set isSolo to false', () => {
        service.setMode(false);
        expect(service.isSolo).toBeFalsy();
    });

    it('setUsername should set username', () => {
        service.setUsername(specConstants.MOCK_INFOS_DEFAULT.username);
        expect(service.username).toEqual(specConstants.MOCK_INFOS_DEFAULT.username);
    });

    it('setGameMode shoud set attribute isClassic to false when given false as parameter', () => {
        service.isClassic = true;
        service.setGameMode(false);
        expect(service.isClassic).toEqual(false);
    });

    it('setGameMode shoud set attribute isClassic to true when given true as parameter', () => {
        service.isClassic = false;
        service.setGameMode(true);
        expect(service.isClassic).toEqual(true);
    });
});
