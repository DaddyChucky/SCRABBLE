/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '@app/../../../common/model/chat-message';
import { DirectionType } from '@app/../../../common/model/direction-type';
import { Player } from '@app/../../../common/model/player';
import { TypeOfUser } from '@app/../../../common/model/type-of-user';
import { ParserErrorType } from '@app/classes/parser-error-types';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { CommandParserService } from '@app/services/command-parser/command-parser.service';
import { GridService } from '@app/services/grid/grid.service';
import { PlayerInformationService } from '@app/services/player-information/player-information.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Socket } from 'socket.io-client';
import { DialogBoxService } from './dialog-box.service';
import * as serviceConstants from './dialog-box.service.constants';
import * as specConstants from './dialog-box.service.spec.constants';

class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect(): void {
        return;
    }
}

describe('DialogBoxService', () => {
    let service: DialogBoxService;
    let socketServiceStub: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;
    let commandParserServiceSpy: jasmine.SpyObj<CommandParserService>;
    let playersInfoSpy: jasmine.SpyObj<PlayerInformationService>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceStub = new SocketClientServiceMock();
        socketServiceStub.socket = socketHelper as unknown as Socket;
        socketServiceStub.socket.id = specConstants.SOCKET_ID_CURRENT_PLAYER;
        specConstants.PLAYER.playerId = specConstants.PLAYER_ID;
        commandParserServiceSpy = jasmine.createSpyObj(CommandParserService, [
            'isCommand',
            'validateCommand',
            'splitPositionAndPlacingLetters',
            'convertCommandToPositionAndDirectionType',
        ]);
        playersInfoSpy = jasmine.createSpyObj('PlayerInformationService', [], {
            currentPlayer: specConstants.PLAYER,
            activePlayer: specConstants.PLAYER,
            lobbyId: specConstants.LOBBY_ID,
        });
        gridServiceSpy = jasmine.createSpyObj('GridService', ['initializeGrid', 'convertPositionToSquareName'], {});
        await TestBed.configureTestingModule({
            imports: [FormsModule],
            providers: [
                { provide: SocketClientService, useValue: socketServiceStub },
                { provide: CommandParserService, useValue: commandParserServiceSpy },
                { provide: PlayerInformationService, useValue: playersInfoSpy },
                { provide: GridService, useValue: gridServiceSpy },
            ],
        }).compileComponents();
        service = TestBed.inject(DialogBoxService);
        gridServiceSpy.initializeGrid();
        gridServiceSpy.convertPositionToSquareName.and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('determineUserType should not change author if message is from system', () => {
        service.determineUserType(specConstants.MESSAGE_FROM_SYSTEM);
        expect(specConstants.MESSAGE_FROM_SYSTEM.author).toEqual(TypeOfUser.SYSTEM);
    });

    it('determineUserType should change not author if message is from current player', () => {
        specConstants.MESSAGE_FROM_PLAYER.socketId = specConstants.SOCKET_ID_CURRENT_PLAYER;
        service.determineUserType(specConstants.MESSAGE_FROM_PLAYER);
        expect(specConstants.MESSAGE_FROM_PLAYER.author).toEqual(TypeOfUser.CURRENT_PLAYER);
    });

    it('determineUserType should change author if message is from opponent player', () => {
        specConstants.MESSAGE_FROM_PLAYER.socketId = specConstants.SOCKET_ID_OPPONENT_PLAYER;
        service.determineUserType(specConstants.MESSAGE_FROM_PLAYER);
        expect(specConstants.MESSAGE_FROM_PLAYER.author).toEqual(TypeOfUser.OPPONENT_PLAYER);
    });

    it('resetMessages should change this.chatMessages to his initial value', () => {
        const intialValue: ChatMessage[] = service.chatMessages;
        service.chatMessages.push(specConstants.EXCHANGE_MESSAGE);
        expect(service.chatMessages).toEqual(intialValue);
    });

    it('displayTimeFormat() should return hh:mm with [hh:mm] format date', () => {
        const expectedDateFormat = '11:13';
        const resultDateFormat: string = service.displayTimeFormat(specConstants.DATE_WITH_DOUBLE_DIGITS);
        expect(resultDateFormat).toEqual(expectedDateFormat);
    });

    it('displayTimeFormat() should return hh:0m with [hh:0m] format date', () => {
        const expectedDateFormat = '11:07';
        const resultDateFormat: string = service.displayTimeFormat(specConstants.DATE_WITH_ONE_DIGIT_MINUTES);
        expect(resultDateFormat).toEqual(expectedDateFormat);
    });

    it('displayTimeFormat() should return 0h:mm with [0h:mm] format date', () => {
        const expectedDateFormat = '04:13';
        const resultDateFormat: string = service.displayTimeFormat(specConstants.DATE_WITH_ONE_DIGIT_HOURS);
        expect(resultDateFormat).toEqual(expectedDateFormat);
    });

    it('displayTimeFormat() should return 0h:0m with [0h:0m] format date', () => {
        const expectedDateFormat = '04:01';
        const resultDateFormat: string = service.displayTimeFormat(specConstants.DATE_WITH_ONE_DIGIT);
        expect(resultDateFormat).toEqual(expectedDateFormat);
    });

    it('getMessageColorClass() should return current-player class with message from current user', () => {
        const expectedCSSClass = 'current-player';
        specConstants.MESSAGE_CURRENT_PLAYER.author = TypeOfUser.CURRENT_PLAYER;
        const currentPlayerClass: string = service.getMessageColorClass(specConstants.MESSAGE_CURRENT_PLAYER);
        expect(expectedCSSClass).toEqual(currentPlayerClass);
    });

    it('getMessageColorClass() should return opponent-player class with message from opponent player', () => {
        const expectedCSSClass = 'opponent-player';
        const opponentPlayerClass: string = service.getMessageColorClass(specConstants.MESSAGE_OPPONENT_PLAYER);
        expect(expectedCSSClass).toEqual(opponentPlayerClass);
    });

    it('getMessageColorClass() should return current-player class with message from system', () => {
        const expectedCSSClass = 'system';
        const systemClass: string = service.getMessageColorClass(specConstants.MESSAGE_FROM_SYSTEM);
        expect(expectedCSSClass).toEqual(systemClass);
    });

    it('getMessageColorClass() should return error class with error message', () => {
        const expectedCSSClass = 'error';
        const errorClass: string = service.getMessageColorClass(specConstants.MESSAGE_ERROR);
        expect(expectedCSSClass).toEqual(errorClass);
    });

    it('submitUserInput() should not call send with empty this.userMessage', () => {
        const chatMessageLengthBefore: number = service.chatMessages.length;
        service.submitUserInput(specConstants.EMPTY_MESSAGE);
        expect(service.chatMessages.length).toEqual(chatMessageLengthBefore);
    });

    it('submitUserInput() should send signal with correct this.userMessage', () => {
        const sendSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(socketServiceStub, 'send').and.callThrough();
        service.submitUserInput(specConstants.MESSAGE);
        expect(sendSpy).toHaveBeenCalled();
    });

    it('addMessageToDialogBox() should add message to chatMessages', () => {
        service.chatMessages = [];
        const chatMessageLengthBefore: number = service.chatMessages.length;
        service.addMessageToDialogBox(specConstants.MESSAGE_FROM_SYSTEM);
        expect(service.chatMessages.length).toEqual(chatMessageLengthBefore + 1);
        expect(service.chatMessages).toContain(specConstants.MESSAGE_FROM_SYSTEM);
    });

    it('sendErrorMessage should add MESSAGE_COMMAND_ERROR and call addMessageToDialogBox if ParserErrorType.COMMAND', () => {
        service.chatMessages = [];
        const addMessageToDialogBoxSpy: jasmine.Spy<(message: ChatMessage) => void> = spyOn(service, 'addMessageToDialogBox').and.callThrough();
        service['sendErrorMessage'](ParserErrorType.COMMAND);
        expect(addMessageToDialogBoxSpy).toHaveBeenCalled();
        expect(service.chatMessages[0].text).toEqual(serviceConstants.MESSAGE_COMMAND_ERROR);
    });

    it('sendErrorMessage should add MESSAGE_ENTRY_ERROR and call addMessageToDialogBox if ParserErrorType.ENTRY', () => {
        service.chatMessages = [];
        const addMessageToDialogBoxSpy: jasmine.Spy<(message: ChatMessage) => void> = spyOn(service, 'addMessageToDialogBox').and.callThrough();
        service['sendErrorMessage'](ParserErrorType.ENTRY);
        expect(addMessageToDialogBoxSpy).toHaveBeenCalled();
        expect(service.chatMessages[0].text).toEqual(serviceConstants.MESSAGE_ENTRY_ERROR);
    });

    it('sendErrorMessage should add MESSAGE_SYNTAX_ERROR and call addMessageToDialogBox if ParserErrorType.SYNTAX', () => {
        service.chatMessages = [];
        const addMessageToDialogBoxSpy: jasmine.Spy<(message: ChatMessage) => void> = spyOn(service, 'addMessageToDialogBox').and.callThrough();
        service['sendErrorMessage'](ParserErrorType.SYNTAX);
        expect(addMessageToDialogBoxSpy).toHaveBeenCalled();
        expect(service.chatMessages[0].text).toEqual(serviceConstants.MESSAGE_SYNTAX_ERROR);
    });

    it('sendErrorMessage should not add any message and should not call addMessageToDialogBox if ParserErrorType.NONE', () => {
        service.chatMessages = [];
        const addMessageToDialogBoxSpy: jasmine.Spy<(message: ChatMessage) => void> = spyOn(service, 'addMessageToDialogBox').and.callThrough();
        service['sendErrorMessage'](ParserErrorType.NONE);
        expect(addMessageToDialogBoxSpy).not.toHaveBeenCalled();
        expect(service.chatMessages.length).toEqual(0);
    });

    it('parseErrorType should call validateCommand when message is a valid command and currentPlayer exist', () => {
        commandParserServiceSpy.validateCommand.and.stub();
        const validCommand = '!placer h8h bonjour';
        commandParserServiceSpy.isCommand.and.returnValue(true);
        const parserErrorType: ParserErrorType = service['parseErrorType'](validCommand);
        expect(commandParserServiceSpy.validateCommand).toHaveBeenCalled();
        expect(parserErrorType).not.toEqual(ParserErrorType.NONE);
    });

    it('parseErrorType should return type of error None if activePlayer is a vp ', () => {
        commandParserServiceSpy.validateCommand.and.stub();
        const validCommand = '!placer h8h bonjour';
        commandParserServiceSpy.isCommand.and.returnValue(true);
        if (playersInfoSpy.activePlayer) {
            playersInfoSpy.activePlayer.playerId = specConstants.VIRTUAL_PLAYER.playerId;
        }
        const parserErrorType: ParserErrorType = service['parseErrorType'](validCommand);
        expect(parserErrorType).toEqual(ParserErrorType.NONE);
    });

    it('parseErrorType should not call validateCommand when message is not a valid command', () => {
        commandParserServiceSpy.validateCommand.and.stub();
        const chatMessage = 'message';
        commandParserServiceSpy.isCommand.and.returnValue(false);
        const parserErrorType: ParserErrorType = service['parseErrorType'](chatMessage);
        expect(commandParserServiceSpy.validateCommand).not.toHaveBeenCalled();
        expect(parserErrorType).toEqual(ParserErrorType.NONE);
    });

    it('verificationTypeMessage should call sendPlaceCommand with valid command', () => {
        spyOn<any>(service, 'parseErrorType').and.stub().and.returnValue(ParserErrorType.NONE);
        commandParserServiceSpy.isCommand.and.returnValue(true);
        const sendPlaceCommandSpy: jasmine.Spy<jasmine.Func> = spyOn<any>(service, 'sendPlaceCommand').and.stub();
        const commandMessage: ChatMessage = specConstants.MESSAGE_FROM_PLAYER;
        commandMessage.text = '!placer h8h bonjour';
        service['verificationTypeMessage'](commandMessage);
        expect(sendPlaceCommandSpy).toHaveBeenCalled();
    });

    it('verificationTypeMessage should not call sendPlaceCommand and call socketService.send with valid command', () => {
        const sendSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(service['socketService'], 'send').and.callThrough();
        spyOn<any>(service, 'parseErrorType').and.stub().and.returnValue(ParserErrorType.NONE);
        commandParserServiceSpy.isCommand.and.returnValue(false);
        const sendPlaceCommandSpy: jasmine.Spy<jasmine.Func> = spyOn<any>(service, 'sendPlaceCommand').and.stub();

        const commandMessage: ChatMessage = specConstants.MESSAGE_FROM_PLAYER;
        commandMessage.text = '!placer h8 bonjour';
        commandMessage.author = TypeOfUser.CURRENT_PLAYER;
        service['verificationTypeMessage'](commandMessage);
        expect(sendSpy).toHaveBeenCalled();
        expect(sendPlaceCommandSpy).not.toHaveBeenCalled();
    });

    it('verificationTypeMessage should call sendLetterBagCommand with valid !réserve command', () => {
        spyOn<any>(service, 'parseErrorType').and.stub().and.returnValue(ParserErrorType.NONE);
        commandParserServiceSpy.isCommand.and.returnValue(true);
        const sendLetterBagCommandSpy: jasmine.Spy<jasmine.Func> = spyOn<any>(service, 'sendLetterBagCommand').and.stub();
        const commandMessage: ChatMessage = specConstants.MESSAGE_FROM_PLAYER;
        commandMessage.text = '!réserve';
        service['verificationTypeMessage'](commandMessage);
        expect(sendLetterBagCommandSpy).toHaveBeenCalled();
    });

    it('verificationTypeMessage should call sendSkipCommand with CommandType.SKIP', () => {
        spyOn<any>(service, 'parseErrorType').and.stub().and.returnValue(ParserErrorType.NONE);
        commandParserServiceSpy.isCommand.and.returnValue(true);
        const sendSkipCommandSpy: jasmine.Spy<jasmine.Func> = spyOn<any>(service, 'sendSkipCommand').and.stub();
        service['verificationTypeMessage'](specConstants.SKIP_MESSAGE);
        expect(sendSkipCommandSpy).toHaveBeenCalled();
    });

    it('verificationTypeMessage should not call sendExchangeCommand, sendPlaceCommand or sendErrorMessage if CommandType.SKIP', () => {
        spyOn<any>(service, 'parseErrorType').and.stub().and.callThrough();
        commandParserServiceSpy.isCommand.and.callThrough();
        const sendExchangeCommandSpy: jasmine.Spy<jasmine.Func> = spyOn<any>(service, 'sendExchangeCommand').and.stub();
        const sendPlaceCommandSpy: jasmine.Spy<jasmine.Func> = spyOn<any>(service, 'sendPlaceCommand').and.stub();
        const sendErrorMessageSpy: jasmine.Spy<jasmine.Func> = spyOn<any>(service, 'sendErrorMessage').and.stub();
        service['verificationTypeMessage'](specConstants.SKIP_MESSAGE);
        expect(sendExchangeCommandSpy).not.toHaveBeenCalled();
        expect(sendPlaceCommandSpy).not.toHaveBeenCalled();
        expect(sendErrorMessageSpy).not.toHaveBeenCalled();
    });

    it('verificationTypeMessage should call sendExchangeCommand with CommandType.EXCHANGE', () => {
        spyOn<any>(service, 'parseErrorType').and.stub().and.returnValue(ParserErrorType.NONE);
        commandParserServiceSpy.isCommand.and.returnValue(true);
        const sendExchangeCommandSpy: jasmine.Spy<jasmine.Func> = spyOn<any>(service, 'sendExchangeCommand').and.stub();
        service['verificationTypeMessage'](specConstants.EXCHANGE_MESSAGE);
        expect(sendExchangeCommandSpy).toHaveBeenCalled();
    });

    it('verificationTypeMessage should call sendHintCommand with CommandType.HINT', () => {
        spyOn<any>(service, 'parseErrorType').and.stub().and.returnValue(ParserErrorType.NONE);
        commandParserServiceSpy.isCommand.and.returnValue(true);
        const sendHelpStub: jasmine.Spy<jasmine.Func> = spyOn<any>(service, 'sendHintCommand').and.stub();
        service['verificationTypeMessage'](specConstants.HINT_MESSAGE);
        expect(sendHelpStub).toHaveBeenCalled();
    });

    it('verificationTypeMessage should call sendHelpMessage', () => {
        spyOn<any>(service, 'parseErrorType').and.stub().and.returnValue(ParserErrorType.NONE);
        commandParserServiceSpy.isCommand.and.returnValue(true);
        const sendHelpStub: jasmine.Spy<jasmine.Func> = spyOn<any>(service, 'sendHelpMessage').and.stub();
        service['verificationTypeMessage'](specConstants.HELP_MESSAGE);
        expect(sendHelpStub).toHaveBeenCalled();
    });

    it('verificationTypeMessage should call sendErrorMessage with parserError (invalid command)', () => {
        spyOn<any>(service, 'parseErrorType').and.stub().and.returnValue(ParserErrorType.SYNTAX);
        commandParserServiceSpy.isCommand.and.returnValue(true);
        const sendErrorMessageSpy: jasmine.Spy<jasmine.Func> = spyOn<any>(service, 'sendErrorMessage').and.stub();
        service['verificationTypeMessage'](specConstants.INVALID_COMMAND_MESSAGE);
        expect(sendErrorMessageSpy).toHaveBeenCalled();
    });

    it('createValidCommandMessage should return commandMessage with TypeOfUser.CURRENTPLAYER if player is current player', () => {
        gridServiceSpy.convertPositionToSquareName.and.stub().and.returnValue(specConstants.POSITION_A1);
        const messageCommand: ChatMessage = service.createValidCommandMessage(specConstants.PARSED_INFO, specConstants.PLAYER);
        expect(messageCommand.author).toEqual(TypeOfUser.CURRENT_PLAYER);
        expect(messageCommand.text).toEqual(specConstants.RESULT_MESSAGE_COMMAND);
        expect(messageCommand.lobbyId).toEqual(specConstants.LOBBY_ID);
        expect(messageCommand.socketId).toEqual(specConstants.PLAYER_ID);
    });

    it('createValidCommandMessage should return commandMessage with TypeOfUser.OPPONENTPLAYER if player is not current player', () => {
        gridServiceSpy.convertPositionToSquareName.and.stub().and.returnValue(specConstants.POSITION_A1);
        const messageCommand: ChatMessage = service.createValidCommandMessage(specConstants.PARSED_INFO, specConstants.NOT_CURRENT_PLAYER);
        expect(messageCommand.author).toEqual(TypeOfUser.OPPONENT_PLAYER);
        expect(messageCommand.text).toEqual(specConstants.RESULT_MESSAGE_COMMAND);
        expect(messageCommand.lobbyId).toEqual(specConstants.LOBBY_ID);
        expect(messageCommand.socketId).toEqual(specConstants.PLAYER2_ID);
    });

    it('sendPlaceCommand should not call send from socketService if variables are undefined', () => {
        const sendSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(service['socketService'], 'send').and.callThrough();
        commandParserServiceSpy.convertCommandToPositionAndDirectionType.and.stub().and.returnValue(undefined);
        commandParserServiceSpy.splitPositionAndPlacingLetters.and.stub().and.returnValue(undefined);
        service['sendPlaceCommand'](specConstants.RESULT_MESSAGE_COMMAND, specConstants.LOBBY_ID);
        expect(sendSpy).not.toHaveBeenCalled();
    });

    it('sendPlaceCommand should call send from socketService', () => {
        const sendSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(service['socketService'], 'send').and.callThrough();
        commandParserServiceSpy.convertCommandToPositionAndDirectionType.and.stub().and.returnValue(specConstants.POSITION_DIRECTION);
        commandParserServiceSpy.splitPositionAndPlacingLetters.and.stub().and.returnValue(specConstants.WORD);
        service['sendPlaceCommand'](specConstants.RESULT_MESSAGE_COMMAND, specConstants.LOBBY_ID);
        expect(sendSpy).toHaveBeenCalled();
    });

    it('sendTurnMessage should call send of socketService', () => {
        const sendSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(socketServiceStub, 'send');
        service.sendTurnMessage();
        expect(sendSpy).toHaveBeenCalled();
    });

    it('sendPlaceCommand should call commandParserService', () => {
        commandParserServiceSpy.splitPositionAndPlacingLetters.and.returnValue(['', specConstants.USER_MESSAGE]);
        commandParserServiceSpy.convertCommandToPositionAndDirectionType.and.returnValue([specConstants.POSITION, DirectionType.HORIZONTAL]);
        service['sendPlaceCommand']('', specConstants.LOBBY_ID);
        expect(commandParserServiceSpy.splitPositionAndPlacingLetters).toHaveBeenCalled();
        expect(commandParserServiceSpy.convertCommandToPositionAndDirectionType).toHaveBeenCalled();
    });

    it("sendSkipCommand should call send of socketService with 'switchTurn' and 'dialogBoxMessage'", () => {
        const sendSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(service['socketService'], 'send').and.callThrough();
        service['sendSkipCommand'](specConstants.SKIP_MESSAGE);
        expect(sendSpy).toHaveBeenCalledTimes(serviceConstants.NUMBER_OF_CALLS_TO_SEND);
        expect(sendSpy).toHaveBeenCalledWith('passTurn', specConstants.SKIP_MESSAGE.lobbyId);
        expect(sendSpy).toHaveBeenCalledWith('dialogBoxMessage', specConstants.SKIP_MESSAGE);
    });

    it("sendLetterBagCommand should call send of socketService with 'getLetterBag'", () => {
        const sendSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(service['socketService'], 'send').and.callThrough();
        service['sendLetterBagCommand'](specConstants.LOBBY_ID, specConstants.PLAYER_ID);
        expect(sendSpy).toHaveBeenCalledWith('getLetterBag', [specConstants.LOBBY_ID, specConstants.PLAYER_ID]);
    });

    it("sendHint should call send of socketService with 'getIndice'", () => {
        const sendSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(service['socketService'], 'send').and.callThrough();
        service['sendHintCommand'](specConstants.LOBBY_ID, specConstants.PLAYER_ID);
        expect(sendSpy).toHaveBeenCalledWith('getIndice', [specConstants.LOBBY_ID, specConstants.PLAYER_ID, gridServiceSpy.scrabbleGrid]);
    });

    it("sendExchangeCommand should not call send of socketService with 'switchTurn' and ''exchangeLetter' if letter undefined'", () => {
        commandParserServiceSpy.splitPositionAndPlacingLetters.and.returnValue(undefined);
        const sendSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(service['socketService'], 'send').and.callThrough();
        service['sendExchangeCommand'](specConstants.EXCHANGE_MESSAGE.text, specConstants.EXCHANGE_MESSAGE.lobbyId);
        expect(sendSpy).not.toHaveBeenCalled();
    });

    it("sendExchangeCommand should call send of socketService with 'switchTurn' and ''exchangeLetter' if letter defined'", () => {
        commandParserServiceSpy.splitPositionAndPlacingLetters.and.returnValue([specConstants.EXCHANGE_COMMAND, specConstants.LETTERS_TO_EXCHANGE]);
        const sendSpy: jasmine.Spy<<T>(event: string, data?: T | undefined) => void> = spyOn(service['socketService'], 'send').and.callThrough();
        service['sendExchangeCommand'](specConstants.EXCHANGE_MESSAGE.text, specConstants.EXCHANGE_MESSAGE.lobbyId);
        expect(sendSpy).toHaveBeenCalledTimes(serviceConstants.NUMBER_OF_CALLS_TO_SEND);
        expect(sendSpy).toHaveBeenCalledWith('exchangeLetter', [specConstants.LETTERS_TO_EXCHANGE, specConstants.EXCHANGE_MESSAGE.lobbyId]);
        expect(sendSpy).toHaveBeenCalledWith('switchTurn', specConstants.EXCHANGE_MESSAGE.lobbyId);
    });

    it('sendHelpMessage should add the help message to chatMessages', () => {
        const lengthBefore: number = service.chatMessages.length;
        service['sendHelpMessage'](specConstants.LOBBY_ID, specConstants.PLAYER_ID);
        expect(service.chatMessages.length).toEqual(lengthBefore + serviceConstants.HELP_MSG.length);
    });

    it('getSelfPlayerName should return current player name', () => {
        const name: string = service.getSelfPlayerName();
        expect(name).toEqual(service['playersInfo'].currentPlayer.name);
    });

    it('getSelfPlayerName should return current player name', () => {
        service['playersInfo'].players = [] as Player[];
        service['playersInfo'].players.push({ name: 'george' } as Player);
        const name: string = service.getOpponentName();
        expect(name).toEqual(service['playersInfo'].players[0].name);
    });
});
