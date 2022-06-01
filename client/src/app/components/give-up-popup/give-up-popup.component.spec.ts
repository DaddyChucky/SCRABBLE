import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppMaterialModule } from '@app/modules/material.module';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { GiveUpPopupComponent } from './give-up-popup.component';
import * as componentConstants from './give-up-popup.component.constants';

describe('ButtonsAreaComponent', () => {
    let component: GiveUpPopupComponent;
    let fixture: ComponentFixture<GiveUpPopupComponent>;
    let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<GiveUpPopupComponent>>;
    let socketClientServiceSpy: jasmine.SpyObj<SocketClientService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let playerSpy: jasmine.SpyObj<PlayerManagementService>;
    beforeEach(async () => {
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<GiveUpPopupComponent>', ['close']);
        socketClientServiceSpy = jasmine.createSpyObj('SocketClientService', ['connect', 'send']);
        playerSpy = jasmine.createSpyObj('PlayerManagementService', ['sendResignation'], {
            myLobby: componentConstants.LOBBY_MOCK,
        });

        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        await TestBed.configureTestingModule({
            declarations: [GiveUpPopupComponent],
            imports: [AppMaterialModule],
            providers: [
                { provide: MatDialogRef, useValue: matDialogRefSpy },
                { provide: SocketClientService, useValue: socketClientServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: PlayerManagementService, useValue: playerSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        routerSpy.navigate.and.stub();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GiveUpPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('button "non" should call giveUp(false)', () => {
        const rejectButton: DebugElement = fixture.debugElement.query(By.css(componentConstants.REJECT_BUTTON_ID));
        spyOn(component, 'giveUp');
        rejectButton.triggerEventHandler('click', null);
        expect(component.giveUp).toHaveBeenCalledWith(false);
    });

    it('button "oui" should call giveUp(true)', () => {
        const rejectButton: DebugElement = fixture.debugElement.query(By.css(componentConstants.ACCEPT_BUTTON_ID));
        spyOn(component, 'giveUp');
        rejectButton.triggerEventHandler('click', null);
        expect(component.giveUp).toHaveBeenCalledWith(true);
    });

    it('giveUp(false) should call close of dialogRef', () => {
        component.giveUp(false);
        expect(matDialogRefSpy.close).toHaveBeenCalled();
    });

    it('giveUp(true) should call connect and send to socketClientService', () => {
        component.giveUp(true);
        playerSpy.sendResignation.and.stub();
        expect(routerSpy.navigate).toHaveBeenCalled();
        expect(playerSpy.sendResignation).toHaveBeenCalled();
        expect(matDialogRefSpy.close).toHaveBeenCalled();
    });
});
