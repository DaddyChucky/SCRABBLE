/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VirtualPlayerInfo } from '@app/../../../common/model/virtual-player-info';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminDatabaseLinkService } from '@app/services/admin-db-link/admin-db-link.service';
import { Observable } from 'rxjs';
import { AddVirtualPlayerDialogComponent } from './add-virtual-player-dialog.component';
import * as specConstants from './add-virtual-player-dialog.component.spec.constants';

describe('AddVirtualPlayerDialogComponent', () => {
    let component: AddVirtualPlayerDialogComponent;
    let fixture: ComponentFixture<AddVirtualPlayerDialogComponent>;
    let adminDatabaseLinkServiceSpy: jasmine.SpyObj<AdminDatabaseLinkService>;

    beforeEach(async () => {
        adminDatabaseLinkServiceSpy = jasmine.createSpyObj<any>('AdminDatabaseLinkService', ['isValidPlayerName', 'postVirtualPlayer'], {});
        await TestBed.configureTestingModule({
            declarations: [AddVirtualPlayerDialogComponent],
            imports: [AppMaterialModule],
            providers: [{ provide: AdminDatabaseLinkService, useValue: adminDatabaseLinkServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AddVirtualPlayerDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('addNewPlayer should call postVirtualPlayer from adminDatabaseLinkService', () => {
        component.newPlayerName = specConstants.NEW_PLAYER_NAME;
        adminDatabaseLinkServiceSpy.postVirtualPlayer.and.stub().and.returnValue(new Observable<VirtualPlayerInfo>());
        component.addNewPlayer();
        expect(adminDatabaseLinkServiceSpy.postVirtualPlayer).toHaveBeenCalled();
    });

    it('isValidSubmission should call isValidPlayerName from adminDatabaseLinkService', () => {
        adminDatabaseLinkServiceSpy.isValidPlayerName.and.stub().and.returnValue(true);
        expect(adminDatabaseLinkServiceSpy.isValidPlayerName).toHaveBeenCalled();
        expect(component.isValidSubmission).toBeTruthy();
    });
});
