import { Component } from '@angular/core';
import { VirtualPlayerDifficulty } from '@app../../../common/model/virtual-player-difficulty';
import { VirtualPlayerSettingService } from '@app/services/virtual-player-settings/virtual-player-settings.service';
import { WAITING_VIEW_UPDATE } from './virtual-player-setting.component.spec.constants';

@Component({
    selector: 'app-virtual-player-setting',
    templateUrl: './virtual-player-setting.component.html',
    styleUrls: ['./virtual-player-setting.component.scss'],
})
export class VirtualPlayerSettingComponent {
    chosenName: string = '';
    difficulty: VirtualPlayerDifficulty;

    constructor(private readonly virtualPlayerSetting: VirtualPlayerSettingService) {
        this.virtualPlayerSetting.createVirtualPlayer();
        setTimeout(async () => this.sendVirtualPlayer(), WAITING_VIEW_UPDATE);
    }

    async sendVirtualPlayer(): Promise<void> {
        this.chosenName = this.virtualPlayerSetting.virtualPlayerRandomName;
        this.virtualPlayerSetting.virtualPlayerName = this.chosenName;
        await new Promise((resolve) => setTimeout(resolve, WAITING_VIEW_UPDATE));
        this.virtualPlayerSetting.createVirtualPlayer();
        await new Promise((resolve) => setTimeout(resolve, WAITING_VIEW_UPDATE));
    }

    get virtualPlayerDifficultyEnum(): typeof VirtualPlayerDifficulty {
        return VirtualPlayerDifficulty;
    }

    setVirtualPlayerDifficulty(virtualPlayerDifficulty: VirtualPlayerDifficulty): void {
        this.virtualPlayerSetting.virtualPlayerDifficulty = virtualPlayerDifficulty;
    }
}
