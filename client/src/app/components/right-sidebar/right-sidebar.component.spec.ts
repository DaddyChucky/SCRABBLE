/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogBoxComponent } from '@app/components/dialog-box/dialog-box.component';
import { TimerComponent } from '@app/components/timer/timer.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import { RightSidebarComponent } from './right-sidebar.component';
import * as specConstants from './right-sidebar.component.spec.constants';

describe('RightSidebarComponent', () => {
    let component: RightSidebarComponent;
    let fixture: ComponentFixture<RightSidebarComponent>;
    let playerManagementServiceSpy: jasmine.SpyObj<PlayerManagementService>;

    beforeEach(async () => {
        playerManagementServiceSpy = jasmine.createSpyObj<any>('PlayerManagementService', [], {
            lobbyInfo: specConstants.LOBBY_MOCK,
            currentPlayer: specConstants.CURRENT_PLAYER,
            opponentPlayer: specConstants.OPPONENT_PLAYER,
        });
        await TestBed.configureTestingModule({
            declarations: [RightSidebarComponent],
            imports: [AppMaterialModule],
            providers: [TimerComponent, DialogBoxComponent, { provide: PlayerManagementService, useValue: playerManagementServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RightSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
