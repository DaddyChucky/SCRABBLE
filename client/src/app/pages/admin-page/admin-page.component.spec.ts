/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dictionary } from '@app/../../../common/model/dictionary';
import { GameLog } from '@app/../../../common/model/game-log';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';
import { AddVirtualPlayerDialogComponent } from '@app/components/add-virtual-player-dialog/add-virtual-player-dialog.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminDatabaseLinkService } from '@app/services/admin-db-link/admin-db-link.service';
import { DictionariesManagerService } from '@app/services/dictionaries-manager/dictionaries-manager.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AdminPageComponent } from './admin-page.component';
import * as specConstants from './admin-page.component.spec.constants';

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;
    let adminDatabaseLinkServiceSpy: jasmine.SpyObj<AdminDatabaseLinkService>;
    let dictionariesManagerServiceSpy: jasmine.SpyObj<DictionariesManagerService>;
    let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<AddVirtualPlayerDialogComponent>>;

    beforeEach(async () => {
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        adminDatabaseLinkServiceSpy = jasmine.createSpyObj<any>(
            'AdminDatabaseLinkService',
            ['loadVirtualPlayerData', 'resetScores', 'isServerForPlayersNotReady', 'deleteGameLogs', 'resetVirtualPlayers'],
            {
                expertPlayers: new BehaviorSubject<VirtualPlayerInfo[]>(specConstants.EXPERT_PLAYERS),
                beginnerPlayers: new BehaviorSubject<VirtualPlayerInfo[]>(specConstants.BEGINNER_PLAYERS),
            },
        );
        dictionariesManagerServiceSpy = jasmine.createSpyObj<any>('DictionariesManagerService', ['loadDictionaryData', 'resetAllDictionaries'], {
            dictionaries: new BehaviorSubject<Dictionary[]>(specConstants.DICTIONARIES),
        });
        await TestBed.configureTestingModule({
            declarations: [AdminPageComponent],
            imports: [AppMaterialModule],
            providers: [
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: AdminDatabaseLinkService, useValue: adminDatabaseLinkServiceSpy },
                { provide: DictionariesManagerService, useValue: dictionariesManagerServiceSpy },
                { provide: MatDialogRef, useValue: matDialogRefSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('openAddVirtualPlayerDialog should call open from dialog and afterClosed', fakeAsync(() => {
        matDialogRefSpy.afterClosed.and.stub().and.returnValue(of(new Observable<VirtualPlayerInfo>()));
        matDialogSpy.open.and.stub().and.returnValue(matDialogRefSpy);
        component.openAddVirtualPlayerDialog();
        tick();
        expect(matDialogSpy.open).toHaveBeenCalled();
        expect(matDialogRefSpy.afterClosed).toHaveBeenCalled();
        expect(adminDatabaseLinkServiceSpy.loadVirtualPlayerData).toHaveBeenCalled();
    }));

    it('resetDatabaseToDefault should call resetDatabase from adminDatabaseLinkService', fakeAsync(() => {
        adminDatabaseLinkServiceSpy.resetScores.and.stub().and.returnValue(of(new Observable<Dictionary>()));
        component.resetScores();
        tick();
        expect(adminDatabaseLinkServiceSpy.resetScores).toHaveBeenCalled();
        expect(adminDatabaseLinkServiceSpy.loadVirtualPlayerData).toHaveBeenCalled();
        expect(dictionariesManagerServiceSpy.loadDictionaryData).toHaveBeenCalled();
    }));

    it('resetGameLogs should call deleteGameLogs from adminDatabaseLinkService', fakeAsync(() => {
        adminDatabaseLinkServiceSpy.deleteGameLogs.and.stub().and.returnValue(of(new Observable<GameLog>()));
        component.resetGameLogs();
        tick();
        expect(adminDatabaseLinkServiceSpy.deleteGameLogs).toHaveBeenCalled();
    }));

    it('resetVirtualPlayer should call resetVirtualPlayers from adminDatabaseLinkService', fakeAsync(() => {
        adminDatabaseLinkServiceSpy.resetVirtualPlayers.and.stub().and.returnValue(of(new Observable<VirtualPlayerInfo>()));
        component.resetVirtualPlayer();
        tick();
        expect(adminDatabaseLinkServiceSpy.resetVirtualPlayers).toHaveBeenCalled();
    }));

    it('resetDictionaries should call resetAllDictionaries from adminDatabaseLinkService', fakeAsync(() => {
        dictionariesManagerServiceSpy.resetAllDictionaries.and.stub().and.returnValue(of(new Observable<VirtualPlayerInfo>()));
        component.resetDictionaries();
        tick();
        expect(dictionariesManagerServiceSpy.resetAllDictionaries).toHaveBeenCalled();
    }));
});
