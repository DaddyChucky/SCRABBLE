/* eslint-disable dot-notation */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VirtualPlayerDifficulty } from '@app../../../common/model/virtual-player-difficulty';
import { AppMaterialModule } from '@app/modules/material.module';
import { VirtualPlayerSettingService } from '@app/services/virtual-player-settings/virtual-player-settings.service';
import { VirtualPlayerSettingComponent } from './virtual-player-setting.component';
import * as specConstants from './virtual-player-setting.component.spec.constants';

describe('VirtualPlayerSettingComponent', () => {
    let component: VirtualPlayerSettingComponent;
    let fixture: ComponentFixture<VirtualPlayerSettingComponent>;
    let vpSettingSpy: jasmine.SpyObj<VirtualPlayerSettingService>;

    beforeEach(async () => {
        vpSettingSpy = jasmine.createSpyObj('VirtualPlayerSettingService', ['createVirtualPlayer'], {
            randomName: specConstants.VIRTUAL_PLAYER_NAME,
        });
        await TestBed.configureTestingModule({
            declarations: [VirtualPlayerSettingComponent],
            imports: [AppMaterialModule],
            providers: [{ provide: VirtualPlayerSettingService, useValue: vpSettingSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(VirtualPlayerSettingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onInit should set the chosenName to the empty string', () => {
        expect(component['chosenName']).toEqual('');
    });

    it('sendVirtualPlayer should call createVirtualPlayer of virtualPlayerSetting', async () => {
        await component.sendVirtualPlayer();
        expect(vpSettingSpy.createVirtualPlayer).toHaveBeenCalled();
    });

    it('getter virtualPlayerDifficultyEnum should return the enum', () => {
        expect(component.virtualPlayerDifficultyEnum).toEqual(VirtualPlayerDifficulty);
    });

    it('getter name should return the chosenName', () => {
        expect(component.chosenName).toEqual(component['chosenName']);
    });

    it('setter virtualPlayerDifficulty should call setPlayerDifficulty of virtualPlayerSetting', () => {
        component.setVirtualPlayerDifficulty(VirtualPlayerDifficulty.BEGINNER);
        expect(vpSettingSpy.virtualPlayerDifficulty).toEqual(VirtualPlayerDifficulty.BEGINNER);
    });
});
