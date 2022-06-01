/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ButtonsAreaComponent } from '@app/components/buttons-area/buttons-area.component';
import { DialogBoxComponent } from '@app/components/dialog-box/dialog-box.component';
import { EaselComponent } from '@app/components/easel/easel.component';
import { GiveUpPopupComponent } from '@app/components/give-up-popup/give-up-popup.component';
import { InformationAreaComponent } from '@app/components/information-area/information-area.component';
import { LeftSidebarComponent } from '@app/components/left-sidebar/left-sidebar.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { RightSidebarComponent } from '@app/components/right-sidebar/right-sidebar.component';
import { SliderFontSizeComponent } from '@app/components/slider-font-size/slider-font-size.component';
import { TileComponent } from '@app/components/tile/tile.component';
import { TimerComponent } from '@app/components/timer/timer.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameManagerService } from '@app/services/game-manager/game-manager.service';
import { PlayerInformationService } from '@app/services/player-information/player-information.service';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import { GamePageComponent } from './game-page.component';
import * as specConstants from './game-page.component.spec.constants';

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let routerSpy: jasmine.SpyObj<Router>;
    let gameManagerServiceSpy: jasmine.SpyObj<GameManagerService>;
    let playerInformationServiceSpy: jasmine.SpyObj<PlayerInformationService>;
    let playerManagementServiceSpy: jasmine.SpyObj<PlayerManagementService>;

    beforeEach(async () => {
        gameManagerServiceSpy = jasmine.createSpyObj<any>('GameManagerService', ['connect', 'isCurrentPlayer'], {
            multiplayerLobby: specConstants.LOBBY_MOCK,
        });
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        playerInformationServiceSpy = jasmine.createSpyObj<any>('PlayerInformationService', ['getSortedPlayersByHighestScore'], {
            currentPlayer: specConstants.PLAYER1,
        });
        playerManagementServiceSpy = jasmine.createSpyObj<any>('PlayerManagementService', [], {
            lobbyInfo: specConstants.LOBBY_MOCK,
            currentPlayer: specConstants.PLAYER1,
            opponentPlayer: specConstants.PLAYER2,
        });
        await TestBed.configureTestingModule({
            declarations: [
                GamePageComponent,
                LeftSidebarComponent,
                PlayAreaComponent,
                RightSidebarComponent,
                InformationAreaComponent,
                ButtonsAreaComponent,
                TimerComponent,
                EaselComponent,
                TileComponent,
                DialogBoxComponent,
                GiveUpPopupComponent,
                SliderFontSizeComponent,
            ],
            imports: [AppMaterialModule],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: GameManagerService, useValue: gameManagerServiceSpy },
                { provide: PlayerInformationService, useValue: playerInformationServiceSpy },
                { provide: PlayerManagementService, useValue: playerManagementServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        routerSpy.navigate.and.stub();
        gameManagerServiceSpy.connect.and.stub();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('constructor should call gameManager.connect', () => {
        expect(gameManagerServiceSpy.connect).toHaveBeenCalled();
    });
});
