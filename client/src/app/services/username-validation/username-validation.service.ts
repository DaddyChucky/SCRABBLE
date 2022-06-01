import { Injectable } from '@angular/core';
import { PlayerManagementService } from '@app/services/player-management/player-management.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import * as serviceConstants from './username-validation.service.constants';

@Injectable({
    providedIn: 'root',
})
export class UsernameValidationService {
    isSameUsername: boolean;
    isEjectedFromLobby: boolean;

    constructor(private readonly socketClient: SocketClientService, private readonly playerManagement: PlayerManagementService) {
        this.configureBaseSocketFeatures();
    }

    isValidUsername(username: string): boolean {
        return username ? this.isRegexDefined(username, serviceConstants.USERNAME_REGEX_RULE) : false;
    }

    configureBaseSocketFeatures(): void {
        this.socketClient.on('sameUsername', () => {
            this.isSameUsername = true;
        });
        this.socketClient.on('ejectedFromLobby', () => {
            if (!this.playerManagement.currentPlayer.host) {
                this.isEjectedFromLobby = true;
                this.socketClient.send('leaveRoom', this.playerManagement.lobbyInfo.lobbyId);
            }
        });
    }

    private isRegexDefined(username: string, regex: RegExp): boolean {
        // https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
        const regexedCommand: RegExpMatchArray | null = username.match(regex);
        if (!regexedCommand) return false;
        const firstRegexedCommand: string = regexedCommand[0];
        return firstRegexedCommand.length === username.length;
    }
}
