/* eslint-disable dot-notation */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dictionary } from '@app/../../../common/model/dictionary';
import { VirtualPlayerSettingComponent } from '@app/components/virtual-player-setting/virtual-player-setting.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { MultiplayerComponent } from '@app/pages/multiplayer-page/multiplayer-page.component';
import { DataPassingService } from '@app/services/data-passing/data-passing.service';
import { DictionariesManagerService } from '@app/services/dictionaries-manager/dictionaries-manager.service';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as specConstants from './multiplayer-page.component.spec.constants';

describe('MultiplayerComponent', () => {
    let component: MultiplayerComponent;
    let fixture: ComponentFixture<MultiplayerComponent>;
    let playerManagementServiceSpy: jasmine.SpyObj<PlayerManagementService>;
    let dataPassingServiceSpy: jasmine.SpyObj<DataPassingService>;
    let socketServiceSpy: jasmine.SpyObj<SocketClientService>;
    let dictManagerSpy: jasmine.SpyObj<DictionariesManagerService>;

    beforeEach(() => {
        playerManagementServiceSpy = jasmine.createSpyObj(
            'PlayerManagementService',
            ['initializePlayerData', 'createLobby', 'lobbyInfo', 'redirectGame', 'cancelGame'],
            { lobbyInfo: specConstants.MULTIPLAYERLOBBY_STUB },
        );
        dataPassingServiceSpy = jasmine.createSpyObj(DataPassingService, ['getUsername', 'getDict', 'getTimer', 'setMode']);

        socketServiceSpy = jasmine.createSpyObj(SocketClientService, ['socket', 'send']);
        dictManagerSpy = jasmine.createSpyObj(
            'DictionariesManagerService',
            ['loadDictionaryData', 'deleteDictionary', 'isValidDictionaryTitle', 'modifyDictionary', 'getDictionary'],
            {
                dictionaries: new BehaviorSubject<Dictionary[]>([]),
            },
        );
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [MultiplayerComponent, VirtualPlayerSettingComponent],
            providers: [
                { provide: PlayerManagementService, useValue: playerManagementServiceSpy },
                { provide: DataPassingService, useValue: dataPassingServiceSpy },
                { provide: SocketClientService, useValue: socketServiceSpy },
                { provide: DictionariesManagerService, useValue: dictManagerSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiplayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('player2.id should be equal to socketId', () => {
        component['socketClient'].socket.id = 'socketId';
        component.ngOnInit();
        expect(component['gameHost'].playerId).toEqual('socketId');
    });

    it('onInit should call initializePlayerData and createLobby from playerManagementService', () => {
        component.ngOnInit();
        expect(playerManagementServiceSpy.initializePlayerData).toHaveBeenCalled();
        expect(playerManagementServiceSpy.createLobby).toHaveBeenCalled();
    });

    it('rejetPlayer should call send from socketClientService', () => {
        component.rejectPlayer();
        expect(socketServiceSpy.send).toHaveBeenCalled();
    });

    it('cancelGame should call cancelGame of playerManagement', () => {
        component.cancelGame();
        expect(playerManagementServiceSpy.cancelGame).toHaveBeenCalled();
    });

    it('redirectPlayer should call redirectGame', (done) => {
        dictManagerSpy.getDictionary.and.stub().and.returnValue(of(new Observable<Dictionary>()));
        dictManagerSpy.loadDictionaryData.and.stub();
        component['dict'] = specConstants.DICT;
        component.redirectPlayer();
        setTimeout(() => {
            expect(playerManagementServiceSpy.redirectGame).toHaveBeenCalled();
            done();
        }, specConstants.WAITING_TIME);
    });

    it('redirectPlayer should not call redirectGame', (done) => {
        dictManagerSpy.getDictionary.and.stub().and.returnValue(new Observable<Dictionary>());
        dictManagerSpy.loadDictionaryData.and.stub();
        component.redirectPlayer();
        setTimeout(() => {
            expect(playerManagementServiceSpy.redirectGame).not.toHaveBeenCalled();
            done();
        }, specConstants.WAITING_TIME);
    });

    it('should return dictionaries', () => {
        expect(component.subjectDictionaries.getValue()).toEqual([]);
    });

    it('lobbyIsFull should return true if playerList is inferior to 2', () => {
        spyOnProperty(component, 'lobbyInfo', 'get').and.returnValue(specConstants.STATIC_MULTIPLAYER_LOBBY_ONE_PLAYER);
        expect(component.lobbyIsFull()).toBeFalsy();
    });

    it('lobbyIsFull should return false if playerList is undefined', () => {
        spyOnProperty(component, 'lobbyInfo', 'get').and.returnValue(specConstants.MULTIPLAYERLOBBY_WITH_UNDEFINED_PLAYERS_STUB);
        expect(component.lobbyIsFull()).toBeFalsy();
    });

    it('lobbyIsFull should return false if playerList is superior than 2', () => {
        spyOnProperty(component, 'lobbyInfo', 'get').and.returnValue(specConstants.STATIC_MULTIPLAYER_LOBBY_THREE_PLAYERS);
        expect(component.lobbyIsFull()).toBeFalsy();
    });

    it('getHostInfo should return gameHost', () => {
        component['gameHost'] = specConstants.GAME_HOST_STUB;
        expect(component.hostInfo).toEqual(specConstants.GAME_HOST_STUB);
    });

    it('get lobbyInfo should return playerManagement lobbyInfo if playerManagement is not undefined', () => {
        expect(component.lobbyInfo).toEqual(specConstants.MULTIPLAYERLOBBY_STUB);
    });

    it('convertSolo should call setSolo from dataPassing', () => {
        component.convertSolo();
        expect(dataPassingServiceSpy.setMode).toHaveBeenCalled();
    });
});
