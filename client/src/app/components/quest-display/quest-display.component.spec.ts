/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import { QuestDisplayComponent } from './quest-display.component';
import * as specConstants from './quest-display.component.spec.constants';

describe('QuestDisplayComponent', () => {
    let component: QuestDisplayComponent;
    let fixture: ComponentFixture<QuestDisplayComponent>;
    let playerManagementServiceSpy: jasmine.SpyObj<PlayerManagementService>;

    beforeEach(async () => {
        playerManagementServiceSpy = jasmine.createSpyObj<any>('PlayerManagementService', [], {
            lobbyInfo: specConstants.LOBBY_MOCK,
            currentPlayer: specConstants.CURRENT_PLAYER,
            opponentPlayer: specConstants.OPPONENT_PLAYER,
        });
        await TestBed.configureTestingModule({
            declarations: [QuestDisplayComponent],
            providers: [{ provide: PlayerManagementService, useValue: playerManagementServiceSpy }],
            imports: [AppMaterialModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(QuestDisplayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
