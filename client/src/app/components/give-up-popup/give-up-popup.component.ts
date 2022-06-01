import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import * as componentConstants from './give-up-popup.component.constants';

@Component({
    selector: 'app-give-up-popup',
    templateUrl: './give-up-popup.component.html',
    styleUrls: ['./give-up-popup.component.scss'],
})
export class GiveUpPopupComponent {
    constructor(
        private readonly dialogRef: MatDialogRef<GiveUpPopupComponent>,
        private readonly router: Router,
        private readonly playerManagement: PlayerManagementService,
    ) {}

    giveUp(isGivingUp: boolean): void {
        if (isGivingUp) {
            this.router.navigate([componentConstants.HOME_PATH]);
            this.playerManagement.sendResignation();
        }
        this.dialogRef.close();
    }
}
