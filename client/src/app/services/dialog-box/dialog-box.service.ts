import { Injectable } from '@angular/core';
import { ChatMessage } from '@app/../../../common/model/chat-message';
import { DirectionType } from '@app/../../../common/model/direction-type';
import { ParsedInfo } from '@app/../../../common/model/parsed-info';
import { Player } from '@app/../../../common/model/player';
import { TypeOfUser } from '@app/../../../common/model/type-of-user';
import { Vec2 } from '@app/../../../common/model/vec2';
import { CommandType } from '@app/classes/command-type';
import { CHAT_MESSAGE_MAX_LENGTH, MESSAGE_PLAYER_TURN } from '@app/classes/constants';
import { ParserErrorType } from '@app/classes/parser-error-types';
import { CommandParserService } from '@app/services/command-parser/command-parser.service';
import { VIRTUAL_PLAYER_ID } from '@app/services/game-manager/game-manager.service.constants';
import { GridService } from '@app/services/grid/grid.service';
import { PlayerInformationService } from '@app/services/player-information/player-information.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import * as serviceConstants from './dialog-box.service.constants';

@Injectable({
    providedIn: 'root',
})
export class DialogBoxService {
    chatMessages: ChatMessage[] = [serviceConstants.FIRST_CHAT_MESSAGE];
    maxLengthOfInput: string = CHAT_MESSAGE_MAX_LENGTH.toString();

    constructor(
        private readonly socketService: SocketClientService,
        private readonly commandParserService: CommandParserService,
        private readonly playersInfo: PlayerInformationService,
        private readonly gridService: GridService,
    ) {}

    resetMessages(): void {
        this.chatMessages = [serviceConstants.FIRST_CHAT_MESSAGE];
    }

    submitUserInput(userMessage: string): void {
        const emptyInputValue = '';
        if (userMessage === emptyInputValue) return;

        const newMessage = {
            author: TypeOfUser.CURRENT_PLAYER,
            text: userMessage,
            date: new Date(),
            lobbyId: this.playersInfo.lobbyId,
            socketId: this.socketService.socket.id,
        } as ChatMessage;
        this.verificationTypeMessage(newMessage);
    }

    getMessageColorClass(message: ChatMessage): string {
        switch (message.author) {
            case TypeOfUser.CURRENT_PLAYER:
                return 'current-player';
            case TypeOfUser.OPPONENT_PLAYER:
                return 'opponent-player';
            case TypeOfUser.SYSTEM:
                return 'system';
            case TypeOfUser.ERROR:
                return 'error';
        }
    }

    addMessageToDialogBox(message: ChatMessage): void {
        this.chatMessages = [...this.chatMessages, message];
    }

    displayTimeFormat(date: Date): string {
        const hours: string =
            date.getHours() < serviceConstants.FIRST_DOUBLE_DIGIT
                ? serviceConstants.ZERO_TO_MAKE_DOUBLE_DIGIT + date.getHours()
                : date.getHours().toString();
        const minutes: string =
            date.getMinutes() < serviceConstants.FIRST_DOUBLE_DIGIT
                ? serviceConstants.ZERO_TO_MAKE_DOUBLE_DIGIT + date.getMinutes()
                : date.getMinutes().toString();
        return hours + ':' + minutes;
    }

    createValidCommandMessage(infos: ParsedInfo, player: Player): ChatMessage {
        return {
            author: player === this.playersInfo.currentPlayer ? TypeOfUser.CURRENT_PLAYER : TypeOfUser.OPPONENT_PLAYER,
            text:
                serviceConstants.PLACE_COMMAND +
                this.gridService.convertPositionToSquareName(infos.position)?.toLowerCase() +
                infos.direction +
                serviceConstants.SPACE +
                infos.lettersCommand,
            date: new Date(),
            lobbyId: this.playersInfo.lobbyId,
            socketId: player.playerId,
        } as ChatMessage;
    }

    sendTurnMessage(): void {
        const messageStartPlayerTurn: ChatMessage = {
            author: TypeOfUser.SYSTEM,
            text: MESSAGE_PLAYER_TURN + this.playersInfo.activePlayer?.name,
            date: new Date(),
            lobbyId: this.playersInfo.lobbyId,
            socketId: '',
        };
        this.socketService.send('dialogBoxMessage', messageStartPlayerTurn);
    }

    determineUserType(message: ChatMessage): void {
        if (message.author === TypeOfUser.SYSTEM) return;
        message.author = message.socketId === this.socketService.socket.id ? TypeOfUser.CURRENT_PLAYER : TypeOfUser.OPPONENT_PLAYER;
    }

    verificationTypeMessage(newMsg: ChatMessage): void {
        const type: ParserErrorType = this.parseErrorType(newMsg.text);
        const isValidCommand: boolean = this.commandParserService.isCommand(newMsg.text);
        if (isValidCommand && type === ParserErrorType.NONE) {
            const command: string = newMsg.text
                .split(' ')
                [serviceConstants.INDEX_COMMAND].substring(serviceConstants.BEGINNING_COMMAND_NAME_INDEX, newMsg.text.length);
            switch (command) {
                case CommandType.EXCHANGE:
                    this.sendExchangeCommand(newMsg.text, newMsg.lobbyId);
                    break;
                case CommandType.PLACE:
                    this.sendPlaceCommand(newMsg.text, newMsg.lobbyId);
                    break;
                case CommandType.RESERVE:
                    this.sendLetterBagCommand(newMsg.lobbyId, newMsg.socketId);
                    break;
                case CommandType.HINT:
                    this.sendHintCommand(newMsg.lobbyId, newMsg.socketId);
                    break;
                case CommandType.HELP:
                    this.sendHelpMessage(newMsg.lobbyId, newMsg.socketId);
                    break;
                case CommandType.SKIP:
                    this.sendSkipCommand(newMsg);
                    break;
            }
        } else if (!isValidCommand) {
            this.socketService.send('dialogBoxMessage', newMsg);
        } else {
            this.sendErrorMessage(type);
        }
    }

    sendSkipCommand(message: ChatMessage): void {
        this.socketService.send('passTurn', message.lobbyId);
        this.socketService.send('dialogBoxMessage', message);
    }

    getSelfPlayerName(): string {
        return this.playersInfo.currentPlayer.name;
    }

    getOpponentName(): string {
        return this.playersInfo.players ? this.playersInfo.players.filter((player) => player !== this.playersInfo.currentPlayer)[0].name : '';
    }

    private sendHelpMessage(lobbyId: string, playerId: string): void {
        for (const message of serviceConstants.HELP_MSG) {
            const newChatMessage: ChatMessage = {
                author: TypeOfUser.SYSTEM,
                text: message,
                date: new Date(),
                lobbyId,
                socketId: playerId,
            } as ChatMessage;
            this.chatMessages.push(newChatMessage);
        }
    }

    private parseErrorType(message: string): ParserErrorType {
        if (this.playersInfo.activePlayer?.playerId === VIRTUAL_PLAYER_ID) {
            return ParserErrorType.NONE;
        } else if (this.commandParserService.isCommand(message) && this.playersInfo.currentPlayer) {
            return this.commandParserService.validateCommand(this.playersInfo.currentPlayer, message);
        }
        return ParserErrorType.NONE;
    }

    private sendPlaceCommand(message: string, lobbyId: string): void {
        const positionAndDirection: [Vec2, DirectionType] | undefined = this.commandParserService.convertCommandToPositionAndDirectionType(message);
        const word: [string, string] | undefined = this.commandParserService.splitPositionAndPlacingLetters(message);
        if (!positionAndDirection || !word) return;
        const parsedInfo: ParsedInfo = {
            lobbyId,
            scrabbleGrid: this.gridService.scrabbleGrid,
            lettersCommand: word[serviceConstants.INDEX_WORD],
            position: positionAndDirection[serviceConstants.INDEX_POSITION],
            direction: positionAndDirection[serviceConstants.INDEX_DIRECTION],
        } as ParsedInfo;
        this.socketService.send('wordValidation', parsedInfo);
    }

    private sendLetterBagCommand(lobbyId: string, playerID: string): void {
        this.socketService.send('getLetterBag', [lobbyId, playerID]);
    }

    private sendHintCommand(lobbyId: string, playerID: string): void {
        this.socketService.send('getIndice', [lobbyId, playerID, this.gridService.scrabbleGrid]);
    }

    private sendExchangeCommand(message: string, lobbyId: string): void {
        const positionAndLetter: [string, string] | undefined = this.commandParserService.splitPositionAndPlacingLetters(message);
        if (!(positionAndLetter && positionAndLetter[serviceConstants.INDEX_LETTER])) return;
        this.socketService.send('exchangeLetter', [positionAndLetter[serviceConstants.INDEX_LETTER], lobbyId]);
        this.socketService.send('switchTurn', lobbyId);
    }

    private sendErrorMessage(parserError: ParserErrorType): void {
        const messageError: ChatMessage = {
            author: TypeOfUser.ERROR,
            text: '',
            date: new Date(),
            lobbyId: this.playersInfo.lobbyId,
            socketId: '',
        };
        switch (parserError) {
            case ParserErrorType.COMMAND:
                messageError.text = serviceConstants.MESSAGE_COMMAND_ERROR;
                break;
            case ParserErrorType.ENTRY:
                messageError.text = serviceConstants.MESSAGE_ENTRY_ERROR;
                break;
            case ParserErrorType.SYNTAX:
                messageError.text = serviceConstants.MESSAGE_SYNTAX_ERROR;
                break;
            case ParserErrorType.NONE:
                return;
        }
        this.addMessageToDialogBox(messageError);
    }
}
