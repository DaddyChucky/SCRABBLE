/* eslint-disable dot-notation */
import { ChatMessage } from '@common/model/chat-message';
import { Tile } from '@common/model/tile';
import { TypeOfUser } from '@common/model/type-of-user';
import { expect } from 'chai';
import { CommandMessageCreatorService } from './command-message-creator.service';
import * as serviceConstants from './command-message-creator.service.constants';
import * as specConstants from './command-message-creator.service.spec.constants';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import sinon = require('sinon');

describe('CommandMessageCreatorService', () => {
    let service: CommandMessageCreatorService;

    beforeEach(() => {
        service = new CommandMessageCreatorService();
    });

    it("createExchangeText should '!échanger abc' if isPlayerTurn is true ", () => {
        expect(
            service['createExchangeText'](specConstants.LETTERS_TO_EXCHANGE, specConstants.ACTIVE_PLAYER.name, specConstants.ACTIVE_PLAYER.isTurn),
        ).to.equal(specConstants.EXCHANGE_MESSAGE_IS_TURN_TRUE);
    });

    it("createEndGameEaselMessage should '!échanger abc' if isPlayerTurn is true ", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- for stub private method
        sinon.stub(service, 'easelStateMessage' as any).returns('');
        const easelMessage: ChatMessage = service['createEndGameEaselMessage'](specConstants.ACTIVE_PLAYER, serviceConstants.LOBBY_ID);
        expect(easelMessage.author).to.eql(specConstants.CHAT_MESSAGE_EXCHANGE.author);
        expect(easelMessage.lobbyId).to.eql(specConstants.CHAT_MESSAGE_EXCHANGE.lobbyId);
        expect(easelMessage.socketId).to.eql(specConstants.CHAT_MESSAGE_EXCHANGE.socketId);
        expect(easelMessage.text).to.eql(specConstants.CHAT_MESSAGE_EXCHANGE.text);
    });

    it("createExchangeText should return 'Bobby Louba : !échanger 1 lettre' if isPlayerTurn is false and only one letter is exchange ", () => {
        expect(
            service['createExchangeText'](
                specConstants.ONE_LETTER_TO_EXCHANGE,
                specConstants.ACTIVE_PLAYER.name,
                specConstants.INACTIVE_PLAYER.isTurn,
            ),
        ).to.equal(specConstants.EXCHANGE_MESSAGE_IS_TURN_FALSE_SINGULAR);
    });

    it("createExchangeText should return 'Bobby Louba : !échanger 3 lettres' if isPlayerTurn is false and multiples letters to exchange ", () => {
        expect(
            service['createExchangeText'](specConstants.LETTERS_TO_EXCHANGE, specConstants.ACTIVE_PLAYER.name, specConstants.INACTIVE_PLAYER.isTurn),
        ).to.equal(specConstants.EXCHANGE_MESSAGE_IS_TURN_FALSE_PLURAL);
    });

    it('easelStateMessage should return a string with player tiles', () => {
        expect(service['easelStateMessage'](specConstants.ACTIVE_PLAYER)).to.equal(specConstants.EASEL_MESSAGE);
    });

    it('easelStateMessage should return a string with player tiles', () => {
        specConstants.ACTIVE_PLAYER.tiles = [new Tile(undefined, 'a')];
        expect(service['easelStateMessage'](specConstants.ACTIVE_PLAYER)).to.equal(specConstants.EASEL_MESSAGE_TEST);
    });

    it('createExchangeMessage should return chatMessage with correct informations for current player', () => {
        const resultExchangeMessage: ChatMessage = service.createExchangeMessage(
            specConstants.LETTERS_TO_EXCHANGE,
            specConstants.ACTIVE_PLAYER,
            serviceConstants.LOBBY_ID,
            specConstants.ACTIVE_PLAYER.isTurn,
        );
        expect(resultExchangeMessage.author).to.equal(TypeOfUser.CURRENT_PLAYER);
        expect(resultExchangeMessage.text).to.equal(specConstants.EXCHANGE_MESSAGE_IS_TURN_TRUE);
        expect(resultExchangeMessage.lobbyId).to.equal(specConstants.CHAT_MESSAGE_EXCHANGE.lobbyId);
        expect(resultExchangeMessage.socketId).to.equal(specConstants.CHAT_MESSAGE_EXCHANGE.socketId);
    });

    it('createExchangeMessage should return chatMessage with correct informations for inactive player', () => {
        const resultExchangeMessage: ChatMessage = service.createExchangeMessage(
            specConstants.LETTERS_TO_EXCHANGE,
            specConstants.ACTIVE_PLAYER,
            serviceConstants.LOBBY_ID,
            specConstants.INACTIVE_PLAYER.isTurn,
        );
        expect(resultExchangeMessage.author).to.equal(TypeOfUser.OPPONENT_PLAYER);
        expect(resultExchangeMessage.text).to.equal(specConstants.EXCHANGE_MESSAGE_IS_TURN_FALSE_PLURAL);
        expect(resultExchangeMessage.lobbyId).to.equal(specConstants.CHAT_MESSAGE_EXCHANGE.lobbyId);
        expect(resultExchangeMessage.socketId).to.equal(specConstants.CHAT_MESSAGE_EXCHANGE.socketId);
    });

    it('createGetLetterBagMessage should return chatMessage with correct informations for a !réserve command', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sinon.stub(service, 'createLetterBagContentText' as any).returns(specConstants.LETTERBAG_CONTENT);
        const resultGetLetterBagMessage: ChatMessage[] = service.createGetLetterBagMessage(
            specConstants.ACTIVE_PLAYER.playerId,
            specConstants.LETTER_BAG_STUB,
            serviceConstants.LOBBY_ID,
        );
        let index = 0;
        for (const line of resultGetLetterBagMessage) {
            expect(line.author).to.equal(TypeOfUser.SYSTEM);
            expect(line.text).to.equal(specConstants.LETTERBAG_CONTENT[index]);
            expect(line.lobbyId).to.equal(serviceConstants.LOBBY_ID);
            expect(line.socketId).to.equal(specConstants.ACTIVE_PLAYER.playerId);
            index++;
        }
    });

    it('createGetIndiceBeginMessage shoud return a chat Message with correct information', () => {
        const result = service.createGetIndiceBeginMessage(specConstants.ACTIVE_PLAYER.playerId, serviceConstants.LOBBY_ID);
        expect(result.author).to.equal(TypeOfUser.SYSTEM);
        expect(result.text).to.equal('INDICES:');
        expect(result.lobbyId).to.equal(serviceConstants.LOBBY_ID);
        expect(result.socketId).to.equal(specConstants.ACTIVE_PLAYER.playerId);
    });

    it('createGetIndiceFullMessage shoud return a chat Message with correct information', () => {
        const result = service.createGetIndiceFullMessage(
            specConstants.ACTIVE_PLAYER.playerId,
            serviceConstants.LOBBY_ID,
            specConstants.WORD_POSSIBILITY1,
        );
        expect(result.author).to.equal(TypeOfUser.SYSTEM);

        expect(result.lobbyId).to.equal(serviceConstants.LOBBY_ID);
        expect(result.socketId).to.equal(specConstants.ACTIVE_PLAYER.playerId);
    });

    it('createLetterBagContentText should create a string with the letters quantity with format LETTER: QUANTITY', () => {
        expect(service['createLetterBagContentText'](specConstants.LETTER_BAG_STUB).length).to.equal(
            specConstants.NUMBER_OF_LINE_TO_PRINT_LETTER_BAG,
        );
    });
});
