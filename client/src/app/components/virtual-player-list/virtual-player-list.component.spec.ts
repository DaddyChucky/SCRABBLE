/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminDatabaseLinkService } from '@app/services/admin-db-link/admin-db-link.service';
import { Observable, of } from 'rxjs';
import { VirtualPlayerListComponent } from './virtual-player-list.component';
import * as specConstants from './virtual-player-list.component.spec.constants';

describe('VirtualPlayerListComponent', () => {
    let component: VirtualPlayerListComponent;
    let fixture: ComponentFixture<VirtualPlayerListComponent>;
    let adminDatabaseLinkServiceSpy: jasmine.SpyObj<AdminDatabaseLinkService>;

    beforeEach(async () => {
        adminDatabaseLinkServiceSpy = jasmine.createSpyObj<any>(
            'AdminDatabaseLinkService',
            ['isValidPlayerName', 'deleteVirtualPlayer', 'modifyVirtualPlayer', 'loadVirtualPlayerData'],
            {},
        );
        await TestBed.configureTestingModule({
            declarations: [VirtualPlayerListComponent],
            imports: [AppMaterialModule],
            providers: [{ provide: AdminDatabaseLinkService, useValue: adminDatabaseLinkServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VirtualPlayerListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.playerNamesList = specConstants.PLAYER_LIST;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('isDefaultPlayer should return default property of virtual player', () => {
        expect(component.isDefaultPlayer(specConstants.DEFAULT_PLAYER)).toBeTruthy();
    });

    it('isValidNewName should call isValidPlayerName from adminDatabaseLinkService and return true', () => {
        adminDatabaseLinkServiceSpy.isValidPlayerName.and.stub().and.returnValue(true);
        expect(component.isValidNewName(0)).toBeTruthy();
        expect(adminDatabaseLinkServiceSpy.isValidPlayerName).toHaveBeenCalled();
    });

    it('canEditName should return true if player name is active player name', () => {
        component.activePlayerEdit = specConstants.PLAYER_LIST[0];
        expect(component.canEditName(component.activePlayerEdit)).toBeTruthy();
    });

    it('activateEdit should return true if player is active player to edit', () => {
        component.activePlayerEdit = {} as VirtualPlayerInfo;
        component.activateEdit(specConstants.DEFAULT_PLAYER);
        expect(component.activePlayerEdit).toEqual(specConstants.DEFAULT_PLAYER);
    });

    it('deleteVirtualPlayer should call deleteVirtualPlayer from adminDatabaseLinkService', fakeAsync(() => {
        adminDatabaseLinkServiceSpy.deleteVirtualPlayer.and.stub().and.returnValue(of(new Observable<VirtualPlayerInfo>()));
        component.deleteVirtualPlayer(specConstants.DEFAULT_PLAYER);
        tick();
        expect(adminDatabaseLinkServiceSpy.deleteVirtualPlayer).toHaveBeenCalled();
        expect(adminDatabaseLinkServiceSpy.loadVirtualPlayerData).toHaveBeenCalled();
    }));

    it('cancelEdit should reset activePlayerEdit and change back virtualPlayerNames at specified index', () => {
        component.activePlayerEdit = specConstants.DEFAULT_PLAYER;
        component.virtualPlayerNames[0] = specConstants.DEFAULT_PLAYER.name;
        component.playerNamesList[0].name = specConstants.PLAYER_SAVED;
        component.cancelEdit(0);
        expect(component.activePlayerEdit).toEqual({} as VirtualPlayerInfo);
        expect(component.virtualPlayerNames[0]).toEqual(specConstants.PLAYER_SAVED);
    });

    it('editVirtualPlayer should call modifyVirtualPlayer from adminDatabaseLinkService', fakeAsync(() => {
        component.virtualPlayerNames[0] = specConstants.DEFAULT_PLAYER.name;
        component.activePlayerEdit = specConstants.DEFAULT_PLAYER;
        adminDatabaseLinkServiceSpy.modifyVirtualPlayer.and.stub().and.returnValue(of(new Observable<VirtualPlayerInfo>()));
        component.editVirtualPlayer(0);
        tick();
        expect(adminDatabaseLinkServiceSpy.modifyVirtualPlayer).toHaveBeenCalled();
        expect(adminDatabaseLinkServiceSpy.loadVirtualPlayerData).toHaveBeenCalled();
        expect(component.activePlayerEdit).toEqual({} as VirtualPlayerInfo);
    }));

    it('updatedVirtualPlayerNames should return virtualPlayerNames', () => {
        component.playerNamesList = specConstants.PLAYER_LIST;
        component.virtualPlayerNames = specConstants.VIRTUAL_PLAYER_NAMES;
        expect(component.updatedVirtualPlayerNames).toEqual(specConstants.VIRTUAL_PLAYER_NAMES);
    });

    it('updatedVirtualPlayerNames should create and virtualPlayerNames', () => {
        component.playerNamesList = specConstants.SECOND_PLAYER_LIST;
        component.virtualPlayerNames = [];
        expect(component.updatedVirtualPlayerNames).toEqual(specConstants.VIRTUAL_PLAYER_NAMES2);
    });
});
