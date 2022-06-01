/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { LobbyType } from '@app/../../../common/model/lobby-type';
import { AppMaterialModule } from '@app/modules/material.module';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { UsernameValidationService } from '@app/services/username-validation/username-validation.service';
import { JoinMultiplayerComponent } from './join-multiplayer-page.component';
import * as componentConstants from './join-multiplayer-page.component.constants';

describe('JoinMultiplayerComponent', () => {
    let component: JoinMultiplayerComponent;
    let fixture: ComponentFixture<JoinMultiplayerComponent>;
    let socketClientSpy: jasmine.SpyObj<SocketClientService>;
    let usernameServiceSpy: jasmine.SpyObj<UsernameValidationService>;
    let playerManagementServiceSpy: jasmine.SpyObj<PlayerManagementService>;

    beforeEach(async () => {
        socketClientSpy = jasmine.createSpyObj('SocketClientService', [], {
            socket: { id: componentConstants.FAKE_SOCKET_ID },
        });
        playerManagementServiceSpy = jasmine.createSpyObj('PlayerManagementService', ['initializePlayerData', 'joinLobby', 'cancelJoin'], {
            lobbyInfo: componentConstants.LOBBY_MOCK,
            optionLobbies: [componentConstants.LOBBY_MOCK],
        });
        usernameServiceSpy = jasmine.createSpyObj('UsernameService', ['isValidUsername']);

        await TestBed.configureTestingModule({
            declarations: [JoinMultiplayerComponent],
            imports: [RouterTestingModule, HttpClientModule, AppMaterialModule],
            providers: [
                { provide: UsernameValidationService, useValue: usernameServiceSpy },
                { provide: SocketClientService, useValue: socketClientSpy },
                { provide: PlayerManagementService, useValue: playerManagementServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(JoinMultiplayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('player2.id should be equal to socketId', () => {
        component.ngOnInit();
        expect(component['player2'].playerId).toEqual(componentConstants.FAKE_SOCKET_ID);
    });

    it('ngOnInit should call initializePlayerData', () => {
        component.ngOnInit();
        expect(playerManagementServiceSpy.initializePlayerData).toHaveBeenCalled();
    });

    it('ngOnInit should switch lobby types to classic mode if data passing service is set to classic', () => {
        component['dataPassingService']['isClassic'] = true;
        component.ngOnInit();
        expect(component.isClassic).toBeTruthy();
    });

    it('update should switch lobbyJoined and isSameUsername to false', () => {
        component['lobbyJoined'] = true;
        component['usernameService']['isSameUsername'] = true;
        component.update();
        expect(component['lobbyJoined']).toBeFalsy();
        expect(component['usernameService']['isSameUsername']).toBeFalsy();
    });

    it('liveLobbies should return empty array if no option lobbies are to be seen', () => {
        playerManagementServiceSpy.optionLobbies.length = 0;
        expect(component.liveLobbies).toEqual([]);
    });

    it('player2UsernameGet should return the player2 name', () => {
        component['player2'].name = componentConstants.PLAYER.name;
        const nameReceived: string = component.player2Username;
        expect(nameReceived).toEqual(componentConstants.PLAYER.name);
    });

    it('player2UsernameGet should return the player2 name', () => {
        component.player2Username = componentConstants.PLAYER.name;
        expect(component['player2'].name).toEqual(componentConstants.PLAYER.name);
    });

    it('join lobby should call joinLobby of playerManagementService', () => {
        component['playerManagement'].myLobby = componentConstants.LOBBY_MOCK;
        component.joinLobby('123');
        expect(playerManagementServiceSpy.joinLobby).toHaveBeenCalled();
    });

    it('join lobby should reset isEjectedFromLobby and isSameUsername of usernameService to false', () => {
        component['usernameService'].isEjectedFromLobby = true;
        component['usernameService'].isSameUsername = true;
        component.joinLobby('123');
        expect(component.isEjectedFromLobby).toBeFalsy();
        expect(component.isSameUsername).toBeFalsy();
    });

    it('joinRandomLobby should call liveLobbies and joinLobby', () => {
        const joinLobbySpy: jasmine.Spy<(lobbyId: string) => void> = spyOn(component, 'joinLobby');
        component['lobbyType'] = LobbyType.CLASSIC;
        component.joinRandomLobby();
        expect(joinLobbySpy).toHaveBeenCalledWith(componentConstants.LOBBY_MOCK.lobbyId);
    });

    it('joinRandomLobby should call liveLobbies and joinLobby', () => {
        const liveLobbiesSpy: jasmine.Spy<jasmine.Func> = spyOnProperty(component, 'liveLobbies', 'get').and.returnValue([]);
        const joinLobbySpy: jasmine.Spy<(lobbyId: string) => void> = spyOn(component, 'joinLobby');
        component.joinRandomLobby();
        expect(joinLobbySpy).not.toHaveBeenCalled();
        expect(liveLobbiesSpy).toHaveBeenCalled();
    });

    it('button "Placement aléatoire" should be undefined if liveLobbies.lenght <= 0', () => {
        const randomJoinButton = fixture.debugElement.query(By.css(componentConstants.ID_RANDOM_JOIN));
        expect(randomJoinButton).toBeFalsy();
    });

    it('get isLobbyExist should return true if lobby exist playerManagement lobbyInfo', () => {
        expect(component.isLobbyExist).toBeTruthy();
    });

    it('liveLobbies should return lobby if playerManagementService.optionLobbies is defined', () => {
        component['lobbyType'] = LobbyType.CLASSIC;
        expect(component.liveLobbies).toEqual([componentConstants.LOBBY_MOCK]);
    });

    it('cancelJoin should call cancelJoin of playerManagement', () => {
        component.cancelJoin();
        expect(playerManagementServiceSpy.cancelJoin).toHaveBeenCalled();
    });
});
