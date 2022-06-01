import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Dictionary } from '@app/../../../common/model/dictionary';
import { GameLog } from '@app/../../../common/model/game-log';
import { ScorePack } from '@app/../../../common/model/score-pack';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';
import { UsernameValidationService } from '@app/services/username-validation/username-validation.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdminDatabaseLinkService } from './admin-db-link.service';
import * as specConstants from './admin-db-link.service.spec.constants';

describe('AdminDatabaseLinkService', () => {
    let httpMock: HttpTestingController;
    let service: AdminDatabaseLinkService;
    let usernameServiceSpy: jasmine.SpyObj<UsernameValidationService>;

    beforeEach(() => {
        usernameServiceSpy = jasmine.createSpyObj('UsernameService', ['isValidUsername']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: UsernameValidationService, useValue: usernameServiceSpy }],
        });
        service = TestBed.inject(AdminDatabaseLinkService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call get methods', () => {
        service.loadVirtualPlayerData();
        const reqEx = httpMock.expectOne(`${specConstants.URL_STRING}false`);
        const reqBeg = httpMock.expectOne(`${specConstants.URL_STRING}true`);
        expect(reqEx.request.method).toBe('GET');
        expect(reqBeg.request.method).toBe('GET');
        reqBeg.flush([specConstants.BEGINNER_VP_TEST]);
        reqEx.flush([specConstants.EXPERT_VP_TEST]);
    });

    it('should call fetch if getExpertPlayers is called ', async () => {
        service.getExpertPlayers().subscribe((response: VirtualPlayerInfo[]) => {
            expect(response.length).toEqual(1);
            expect(response[0].name).toEqual(specConstants.EXPERT_VP_TEST.name);
            expect(response[0].difficulty).toEqual(specConstants.EXPERT_VP_TEST.difficulty);
        }, fail);

        const req = httpMock.expectOne(`${specConstants.URL_STRING}false`);
        expect(req.request.method).toBe('GET');
        req.flush([specConstants.EXPERT_VP_TEST]);
    });

    it('should handle http error safely for getExpertPlayers', () => {
        service.getExpertPlayers().subscribe((response: VirtualPlayerInfo[]) => {
            expect(response).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(`${specConstants.URL_STRING}false`);
        expect(req.request.method).toBe('GET');
        req.error(new ErrorEvent('getExpertPlayers'));
    });

    it('should call fetch if getBeginnerPlayers is called ', async () => {
        service.getBeginnerPlayers().subscribe((response: VirtualPlayerInfo[]) => {
            expect(response.length).toEqual(1);
            expect(response[0].name).toEqual(specConstants.BEGINNER_VP_TEST.name);
            expect(response[0].difficulty).toEqual(specConstants.BEGINNER_VP_TEST.difficulty);
        }, fail);

        const req = httpMock.expectOne(`${specConstants.URL_STRING}true`);
        expect(req.request.method).toBe('GET');
        req.flush([specConstants.BEGINNER_VP_TEST]);
    });

    it('should handle http error safely for getBeginnerPlayers', () => {
        service.getBeginnerPlayers().subscribe((response: VirtualPlayerInfo[]) => {
            expect(response).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(`${specConstants.URL_STRING}true`);
        expect(req.request.method).toBe('GET');
        req.error(new ErrorEvent('getBeginnerPlayers'));
    });

    it('should call fetch if postVirtualPlayer is called ', async () => {
        service.postVirtualPlayer(specConstants.BEGINNER_VP_TEST).subscribe((response: VirtualPlayerInfo) => {
            expect(response.name).toEqual(specConstants.BEGINNER_VP_TEST.name);
            expect(response.difficulty).toEqual(specConstants.BEGINNER_VP_TEST.difficulty);
        }, fail);

        const req = httpMock.expectOne(`${specConstants.URL_STRING}`);
        expect(req.request.method).toBe('POST');
        req.flush(specConstants.BEGINNER_VP_TEST);
    });

    it('should handle http error safely for postVirtualPlayer', () => {
        service.postVirtualPlayer(specConstants.BEGINNER_VP_TEST).subscribe((response: VirtualPlayerInfo) => {
            expect(response).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(`${specConstants.URL_STRING}`);
        expect(req.request.method).toBe('POST');
        req.error(new ErrorEvent('postVirtualPlayer'));
    });

    it('should call fetch if modifyVirtualPlayer is called ', async () => {
        service.modifyVirtualPlayer(specConstants.BEGINNER_VP_TEST.name, specConstants.BEGINNER_VP_TEST).subscribe((response: VirtualPlayerInfo) => {
            expect(response.name).toEqual(specConstants.BEGINNER_VP_TEST.name);
            expect(response.difficulty).toEqual(specConstants.BEGINNER_VP_TEST.difficulty);
        }, fail);

        const req = httpMock.expectOne(`${specConstants.URL_STRING}${specConstants.BEGINNER_VP_TEST.name}`);
        expect(req.request.method).toBe('PATCH');
        req.flush(specConstants.BEGINNER_VP_TEST);
    });

    it('should handle http error safely for modifyVirtualPlayer', () => {
        service.modifyVirtualPlayer(specConstants.BEGINNER_VP_TEST.name, specConstants.BEGINNER_VP_TEST).subscribe((response: VirtualPlayerInfo) => {
            expect(response).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(`${specConstants.URL_STRING}${specConstants.BEGINNER_VP_TEST.name}`);
        expect(req.request.method).toBe('PATCH');
        req.error(new ErrorEvent('modifyVirtualPlayer'));
    });

    it('should call fetch if deleteVirtualPlayer is called ', async () => {
        service.deleteVirtualPlayer(specConstants.BEGINNER_VP_TEST.name).subscribe((response: VirtualPlayerInfo) => {
            expect(response.name).toEqual(specConstants.BEGINNER_VP_TEST.name);
            expect(response.difficulty).toEqual(specConstants.BEGINNER_VP_TEST.difficulty);
        }, fail);

        const req = httpMock.expectOne(`${specConstants.URL_STRING}${specConstants.BEGINNER_VP_TEST.name}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(specConstants.BEGINNER_VP_TEST);
    });

    it('should handle http error safely for deleteVirtualPlayer', () => {
        service.deleteVirtualPlayer(specConstants.BEGINNER_VP_TEST.name).subscribe((response: VirtualPlayerInfo) => {
            expect(response).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(`${specConstants.URL_STRING}${specConstants.BEGINNER_VP_TEST.name}`);
        expect(req.request.method).toBe('DELETE');
        req.error(new ErrorEvent('deleteVirtualPlayer'));
    });

    it('should call get if getGameLogs called', () => {
        service.getGameLogs().subscribe((response: GameLog[]) => {
            expect(response).toBeDefined();
        }, fail);

        const req = httpMock.expectOne(`${specConstants.URL_STRING_LOGS}`);
        expect(req.request.method).toBe('GET');
        req.flush([{} as GameLog]);
    });

    it('should call delete if deleteGameLogs called', () => {
        service.deleteGameLogs().subscribe((response: GameLog[]) => {
            expect(response).toBeDefined();
        }, fail);

        const req = httpMock.expectOne(`${specConstants.URL_STRING_LOGS}`);
        expect(req.request.method).toBe('DELETE');
        req.flush([{} as GameLog]);
    });

    it('should call fetch if resetDatabase is called ', async () => {
        service.resetScores().subscribe((response: VirtualPlayerInfo | Dictionary | ScorePack) => {
            expect(response).toBeDefined();
        }, fail);

        const req = httpMock.expectOne(`${specConstants.URL_STRING_ADMIN}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(specConstants.BEGINNER_VP_TEST);
    });

    it('should handle http error safely for resetDatabase', async () => {
        service.resetScores().subscribe((response: VirtualPlayerInfo | Dictionary | ScorePack) => {
            expect(response).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(`${specConstants.URL_STRING_ADMIN}`);
        expect(req.request.method).toBe('DELETE');
        req.error(new ErrorEvent('resetDatabase'));
    });

    it('loadVirtualPlayerData should call getExpertPlayers and getBeginnerPlayers', () => {
        const getExpertPlayersSpy = spyOn(service, 'getExpertPlayers').and.stub().and.returnValue(new Observable<VirtualPlayerInfo[]>());
        const getBeginnerPlayersSpy = spyOn(service, 'getBeginnerPlayers').and.stub().and.returnValue(new Observable<VirtualPlayerInfo[]>());
        service.loadVirtualPlayerData();
        expect(getBeginnerPlayersSpy).toHaveBeenCalled();
        expect(getExpertPlayersSpy).toHaveBeenCalled();
    });

    it('isValidPlayerName should return false if name is empty', () => {
        expect(service.isValidPlayerName('')).toBeFalsy();
    });

    it('isValidPlayerName should return false if isValidUsername is false', () => {
        usernameServiceSpy.isValidUsername.and.stub().and.returnValue(false);
        expect(service.isValidPlayerName(specConstants.INVALID_PLAYER_NAME)).toBeFalsy();
    });

    it('isValidPlayerName should return true if isValidUsername is true and name is not already present', () => {
        service.beginnerPlayers.getValue().push(specConstants.BEGINNER_VP_TEST);
        service.expertPlayers.getValue().push(specConstants.EXPERT_VP_TEST);
        usernameServiceSpy.isValidUsername.and.stub().and.returnValue(true);
        expect(service.isValidPlayerName(specConstants.VALID_PLAYER_NAME)).toBeTruthy();
    });

    it('isServerForPlayersNotReady should return true expertPlayers or beginnerPlayers is not defined', () => {
        service.beginnerPlayers = new BehaviorSubject<VirtualPlayerInfo[]>([]);
        service.expertPlayers = new BehaviorSubject<VirtualPlayerInfo[]>([]);
        expect(service.isServerForPlayersNotReady()).toBeTruthy();
    });

    it('isServerForPlayersNotReady should return false expertPlayers and beginnerPlayers are defined', () => {
        service.beginnerPlayers.getValue().push(specConstants.BEGINNER_VP_TEST);
        service.expertPlayers.getValue().push(specConstants.EXPERT_VP_TEST);
        expect(service.isServerForPlayersNotReady()).toBeFalsy();
    });

    it('resetVirtualPlayers should return false expertPlayers and beginnerPlayers are defined', async () => {
        service.resetVirtualPlayers().subscribe();
        const req = httpMock.expectOne(`${specConstants.URL_STRING}`);
        expect(req.request.method).toBe('DELETE');
    });
});
