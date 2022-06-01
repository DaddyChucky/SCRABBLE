/* eslint-disable dot-notation */ // usage of private attribute
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GameLog } from '@app/../../../common/model/game-log';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminDatabaseLinkService } from '@app/services/admin-db-link/admin-db-link.service';
import { Observable } from 'rxjs';
import { GameHistoryComponent } from './game-history.component';
import * as componentConstants from './game-history.component.constants';

describe('GameHistoryComponent', () => {
    let component: GameHistoryComponent;
    let routerSpy: jasmine.SpyObj<Router>;
    let adminDbLinkSpy: jasmine.SpyObj<AdminDatabaseLinkService>;
    let fixture: ComponentFixture<GameHistoryComponent>;

    beforeEach(async () => {
        adminDbLinkSpy = jasmine.createSpyObj('AdminDatabaseLinkService', ['getGameLogs']);
        adminDbLinkSpy.getGameLogs.and.stub().and.returnValue(new Observable<GameLog>());
        await TestBed.configureTestingModule({
            declarations: [GameHistoryComponent],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: AdminDatabaseLinkService, useValue: adminDbLinkSpy },
            ],
            imports: [AppMaterialModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('polling should call getGameLogs', () => {
        component.polling();
        expect(adminDbLinkSpy.getGameLogs).toHaveBeenCalled();
    });

    it('polling should not call getGameLogs if isNeedingToContinuePolling false', () => {
        component['isPollingNeeded'] = false;
        component.polling();
        expect(adminDbLinkSpy.getGameLogs).toHaveBeenCalled();
    });

    it('getGameModeDisplay should return Classique if lobby type is CLASSIC', () => {
        expect(component.getGameModeDisplay(LobbyType.CLASSIC)).toEqual(componentConstants.GAME_MODE_CLASSIC);
    });

    it('getGameModeDisplay should return LOG2990 if lobby type is LOG2990', () => {
        expect(component.getGameModeDisplay(LobbyType.LOG2990)).toEqual(componentConstants.GAME_MODE_LOG2990);
    });
});
