import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonsAreaComponent } from '@app/components/buttons-area/buttons-area.component';
import { InformationAreaComponent } from '@app/components/information-area/information-area.component';
import { LeftSidebarComponent } from '@app/components/left-sidebar/left-sidebar.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameManagerService } from '@app/services/game-manager/game-manager.service';
import { PlayerInformationService } from '@app/services/player-information/player-information.service';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import * as specConstants from './left-sidebar.component.spec.constants';

describe('LeftSidebarComponent', () => {
    let component: LeftSidebarComponent;
    let fixture: ComponentFixture<LeftSidebarComponent>;
    let playerInformationServiceSpy: jasmine.SpyObj<PlayerInformationService>;
    let playerManagementServiceSpy: jasmine.SpyObj<PlayerManagementService>;
    let gameManagerSpy: jasmine.SpyObj<GameManagerService>;

    beforeEach(async () => {
        playerInformationServiceSpy = jasmine.createSpyObj(PlayerInformationService, ['getSortedPlayersByHighestScore']);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        playerManagementServiceSpy = jasmine.createSpyObj<any>('PlayerManagementService', [], {
            lobbyInfo: specConstants.LOBBY_MOCK,
        });
        gameManagerSpy = jasmine.createSpyObj('GameManagerService', ['passTurn', 'isCurrentPlayer'], {
            multiplayerLobby: specConstants.LOBBY_MOCK,
        });
        await TestBed.configureTestingModule({
            declarations: [LeftSidebarComponent, InformationAreaComponent, ButtonsAreaComponent],
            imports: [AppMaterialModule],
            providers: [
                { provide: PlayerInformationService, useValue: playerInformationServiceSpy },
                { provide: PlayerManagementService, useValue: playerManagementServiceSpy },
                { provide: GameManagerService, useValue: gameManagerSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LeftSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
