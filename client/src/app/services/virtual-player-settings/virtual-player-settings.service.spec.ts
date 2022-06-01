/* eslint-disable dot-notation */ // Utilisation d'attribut privés dans le fichier de test
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { VirtualPlayerDifficulty } from '@app../../../common/model/virtual-player-difficulty';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';
import { AdminDatabaseLinkService } from '@app/services/admin-db-link/admin-db-link.service';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { VirtualPlayerSettingService } from './virtual-player-settings.service';
import * as specConstants from './virtual-player-settings.service.spec.constants';

describe('VirtualPlayerSettingService', () => {
    let service: VirtualPlayerSettingService;
    let bdLinkSpy: jasmine.SpyObj<AdminDatabaseLinkService>;
    let playerManagementServiceSpy: jasmine.SpyObj<PlayerManagementService>;

    beforeEach(async () => {
        playerManagementServiceSpy = jasmine.createSpyObj('PlayerManagementService', ['addVirtualPlayer'], {
            currentPlayer: specConstants.PLAYER_1,
        });
        bdLinkSpy = jasmine.createSpyObj('AdminDatabaseLinkService', ['loadVirtualPlayerData'], {
            expertPlayers: new BehaviorSubject<VirtualPlayerInfo[]>(specConstants.VIRTUAL_INFOS),
            beginnerPlayers: new BehaviorSubject<VirtualPlayerInfo[]>(specConstants.VIRTUAL_INFOS),
        });
        await TestBed.configureTestingModule({
            providers: [
                { provide: AdminDatabaseLinkService, useValue: bdLinkSpy },
                { provide: PlayerManagementService, useValue: playerManagementServiceSpy },
            ],
        }).compileComponents();
        service = TestBed.inject(VirtualPlayerSettingService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('getter virtualPlayerRandomName should return a name in usernames', () => {
        service['usernames'] = specConstants.VIRTUAL_INFOS;
        const name = service['usernames'].find(() => service.virtualPlayerRandomName);
        expect(name).toBeTruthy();
    });

    it('getter virtualPlayerRandomName should empty string if virtualPlayer and current player are not defined', () => {
        (service['virtualPlayer'] as any) = undefined;
        expect(service.virtualPlayerRandomName).toEqual('');
    });

    it('setter virtualPlayerName should set virtual player name', () => {
        service.virtualPlayerName = specConstants.RANDOM_NAME;
        expect(service['virtualPlayer'].name).toEqual(specConstants.RANDOM_NAME);
    });

    it('getRandomName should return a name not equal to playerName', () => {
        service['virtualPlayer'].difficulty = VirtualPlayerDifficulty.EXPERT;
        const randomIndexSpy = spyOn<any>(service, 'randomIndex').and.callThrough();
        service['usernames'] = [specConstants.VIRTUAL_INFO_1, specConstants.VIRTUAL_INFO_2];
        expect(service.virtualPlayerRandomName).not.toEqual(specConstants.PLAYER_1.name);
        expect(randomIndexSpy).toHaveBeenCalled();
    });

    it('getter virtualPlayerDifficulty should return the difficulty of virtualPlayer', () => {
        service['virtualPlayer'].difficulty = VirtualPlayerDifficulty.EXPERT;
        expect(service.virtualPlayerDifficulty).toEqual(VirtualPlayerDifficulty.EXPERT);
    });

    it('setter setPlayerDifficulty should set the difficulty of the virtualPlayer', () => {
        service.virtualPlayerDifficulty = VirtualPlayerDifficulty.EXPERT;
        expect(service['virtualPlayer'].difficulty).toEqual(VirtualPlayerDifficulty.EXPERT);
    });

    it('createVirtualPlayer should call send of socketClient', () => {
        service.createVirtualPlayer();
        expect(playerManagementServiceSpy.addVirtualPlayer).toHaveBeenCalled();
    });

    it('randomIndex should return a random number in length of username', () => {
        service['usernames'] = specConstants.VIRTUAL_INFOS;
        const returnedValue = service['randomIndex']();
        expect(returnedValue >= 0).toBeTruthy();
        expect(returnedValue < service['usernames'].length).toBeTruthy();
    });
});
