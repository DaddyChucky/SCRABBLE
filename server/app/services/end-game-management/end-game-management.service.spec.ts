/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
// -- needed because private attributes
import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import { LetterBag } from '@common/model/letter-bag/letter-bag';
import { MultiplayerLobby } from '@common/model/lobby';
import { LobbyMock } from '@common/model/lobby-mock';
import { LobbyStatus } from '@common/model/lobby-status';
import { LobbyType } from '@common/model/lobby-type';
import { Player } from '@common/model/player';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { EndGameManagementService } from './end-game-management.service';
import * as serviceConstants from './end-game-management.service.constants';
import * as specConstants from './end-game-management.service.spec.constants';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Sinon = require('sinon');

describe('EndGameManagement', () => {
    let service: EndGameManagementService;
    let lobbyMock: LobbyMock;
    let fetchStub: Sinon.SinonStub;

    beforeEach(() => {
        service = new EndGameManagementService(new LetterBagService());
        specConstants.PLAYER_1.score = 1000;
        specConstants.PLAYER_2.score = 500;
        lobbyMock = {
            playerList: [specConstants.PLAYER_1, specConstants.PLAYER_2],
            lobbyType: LobbyType.CLASSIC,
            dictionary: 'ENGLISH',
            baseTimerValue: 60,
            timeLeft: 60,
            lobbyId: 'thisismylobby',
            lobbyStatus: LobbyStatus.CREATED,
            letterBag: new LetterBag(),
        };
        lobbyMock.playerList[serviceConstants.PLAYER_2_INDEX].isTurn = false;
        lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX].isTurn = false;
        fetchStub = Sinon.stub(service['fetch'], 'sendScores').callsFake(async () => {
            return;
        });
    });

    it('endGameVerification should call endGamePointsCalculus and sendLogToDatabase', () => {
        const endGameSpy: sinon.SinonSpy<any[], any> | sinon.SinonSpy<unknown[], unknown> = sinon.spy(service, 'endGamePointsCalculus' as any);
        const logSpy: sinon.SinonStub<[lobby: MultiplayerLobby], Promise<void>> = sinon.stub(service, 'sendLogToDatabase').callsFake(async () => {
            return;
        });
        service.endGameVerification(lobbyMock);
        expect(endGameSpy.calledWith());
        expect(logSpy.called);
    });

    it('endGameVerification should call landslideWin', () => {
        sinon.stub(service, 'sendLogToDatabase').callsFake(async () => {
            return;
        });
        Sinon.stub(service['letterBag'], 'letterBagIsEmpty').returns(true);
        const endGameSpy: sinon.SinonSpy<any[], any> | sinon.SinonSpy<unknown[], unknown> = sinon.spy(service, 'endGamePointsCalculus' as any);
        service.endGameVerification(lobbyMock);
        expect(endGameSpy.calledWith());
    });

    it('endGameVerification should call winningMessage for the winner', () => {
        sinon.stub(service, 'sendLogToDatabase').callsFake(async () => {
            return;
        });
        const spy: sinon.SinonSpy<any[], any> | sinon.SinonSpy<unknown[], unknown> = Sinon.spy(service, 'winningMessage' as any);
        service.endGameVerification(lobbyMock);
        expect(spy.calledWith(lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX].name));
    });

    it('landslideWin should return winning player', () => {
        lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX].tiles = [];
        Sinon.stub(service['letterBag'], 'letterBagIsEmpty').returns(true);
        const receivedPlayer: Player | null = service['landSlideWin'](lobbyMock);
        expect(receivedPlayer).to.equal(lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX]);
    });

    it('landslideWin should return null if no winner', () => {
        lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX].isTurn = true;
        Sinon.stub(service['letterBag'], 'letterBagIsEmpty').returns(false);
        const receivedPlayer: Player | null = service['landSlideWin'](lobbyMock);
        expect(receivedPlayer).to.equal(null);
    });

    it('landslideWin should call letterBagIsEmpty', () => {
        lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX].tiles = [];
        const spy: sinon.SinonSpy<[letterBag: LetterBag], boolean> = Sinon.spy(service['letterBag'], 'letterBagIsEmpty');
        service['landSlideWin'](lobbyMock);
        expect(spy.calledWith(lobbyMock.letterBag));
    });

    it('should add to the score of the winner by land slide 1', () => {
        const expectedScore: number = lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX].score + specConstants.EXPECTED_SCORE_MARGIN_2;
        lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX].tiles = [];
        Sinon.stub(service['letterBag'], 'letterBagIsEmpty').returns(true);
        service['endGamePointsCalculus'](lobbyMock);
        expect(lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX].score).to.equal(expectedScore);
    });

    it('should add to the score of the winner by land slide 2', () => {
        const expectedScore: number = lobbyMock.playerList[serviceConstants.PLAYER_2_INDEX].score + specConstants.EXPECTED_SCORE_MARGIN_1;
        lobbyMock.playerList[serviceConstants.PLAYER_2_INDEX].tiles = [];
        lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX].tiles = specConstants.TILES_1;
        Sinon.stub(service['letterBag'], 'letterBagIsEmpty').returns(true);
        service['endGamePointsCalculus'](lobbyMock);
        expect(lobbyMock.playerList[serviceConstants.PLAYER_2_INDEX].score).to.equal(expectedScore);
    });

    it('equality should call equalityMessage', () => {
        sinon.stub(service, 'sendLogToDatabase').callsFake(async () => {
            return;
        });
        const spy: sinon.SinonSpy<any[], any> | sinon.SinonSpy<unknown[], unknown> = Sinon.spy(service, 'equalityMessage' as any);
        lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX].tiles = [];
        Sinon.stub(service['letterBag'], 'letterBagIsEmpty').returns(false);
        lobbyMock.playerList[serviceConstants.PLAYER_2_INDEX].tiles = [];
        lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX].score = specConstants.TEST_SCORE;
        lobbyMock.playerList[serviceConstants.PLAYER_2_INDEX].score = specConstants.TEST_SCORE;
        service.endGameVerification(lobbyMock);
        expect(spy.called);
    });

    it('endGameVerification should not do anything if it is not anyones turn and if landSlineWins return null', () => {
        lobbyMock.playerList[serviceConstants.PLAYER_2_INDEX].isTurn = true;
        sinon.stub(service, 'sendLogToDatabase').callsFake(async () => {
            return;
        });
        lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX].isTurn = true;
        Sinon.stub(service['letterBag'], 'letterBagIsEmpty').returns(false);
        service['endGamePointsCalculus'](lobbyMock);
        expect(service.endGameVerification(lobbyMock)).to.equal(undefined);
    });

    it('sendScores should call sendScores', () => {
        service.sendScoresToDatabase(lobbyMock);
        expect(fetchStub.calledWith(lobbyMock));
    });

    it('sendLogToDatabase should call addLog', () => {
        const spy: sinon.SinonStub<[lobby: MultiplayerLobby, isAbandonedAndSolo?: boolean | undefined], Promise<void>> = Sinon.stub(
            service['gameLogsService'],
            'addLog',
        ).callsFake(async () => {
            return new Promise<void>(() => {
                return;
            });
        });
        service.sendLogToDatabase(lobbyMock);
        expect(spy.calledWith(lobbyMock));
    });

    it('isEndgame should return true if endgame by empty bag and tiles', () => {
        lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX].tiles = [];
        Sinon.stub(service['letterBag'], 'letterBagIsEmpty').returns(true);
        expect(service.isEndGame(lobbyMock)).to.eql(true);
    });

    it('isEndgame should return true if endgame by number of turns = 6', () => {
        service.turnPassedNb = 6;
        Sinon.stub(service['letterBag'], 'letterBagIsEmpty').returns(false);
        expect(service.isEndGame(lobbyMock)).to.eql(true);
    });

    it('isEndgame should return true if palyer2 quit', () => {
        lobbyMock.playerList = [specConstants.PLAYER_1];
        expect(service.isEndGame(lobbyMock)).to.eql(true);
    });

    it('messageToSend should call return winner message if abandon', () => {
        lobbyMock.playerList = [specConstants.PLAYER_1];
        expect(service.messageToSend(lobbyMock)).to.eql(specConstants.PLAYER_1.name + serviceConstants.WINNING_MESSAGE);
    });

    it('messageToSend should call return winner message if player 1 better score', () => {
        expect(service.messageToSend(lobbyMock)).to.eql(specConstants.PLAYER_1.name + serviceConstants.WINNING_MESSAGE);
    });

    it('should return letter bag size message', () => {
        expect(service.letterBagSizeMessage(lobbyMock.letterBag)).to.eql(
            specConstants.LETTER_BAG_SIZE_MESSAGE[0] + specConstants.LETTER_BAG_SIZE_MESSAGE[1] + specConstants.LETTER_BAG_SIZE_MESSAGE[2],
        );
    });

    it('messageToSend should call return winner message if  player 2 better score', () => {
        lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX].score = specConstants.TEST_SCORE_2;
        lobbyMock.playerList[serviceConstants.PLAYER_2_INDEX].score = specConstants.TEST_SCORE_3;
        expect(service.messageToSend(lobbyMock)).to.eql(specConstants.PLAYER_2.name + serviceConstants.WINNING_MESSAGE);
    });

    it('messageToSend should call return equality if equal score', () => {
        lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX].score = specConstants.TEST_SCORE;
        lobbyMock.playerList[serviceConstants.PLAYER_2_INDEX].score = specConstants.TEST_SCORE;
        expect(service.messageToSend(lobbyMock)).to.eql(
            serviceConstants.EQUALITY_MESSAGE[0] +
                lobbyMock.playerList[serviceConstants.PLAYER_1_INDEX].name +
                serviceConstants.EQUALITY_MESSAGE[1] +
                lobbyMock.playerList[serviceConstants.PLAYER_2_INDEX].name,
        );
    });

    it('isPlayersTurn should return false if no player.isTurn is true', () => {
        expect(service['isPlayersTurn'](lobbyMock.playerList)).to.equal(false);
    });

    it('isPlayersTurn should return true if one player.isTurn is true', () => {
        lobbyMock.playerList[serviceConstants.PLAYER_2_INDEX].isTurn = true;
        expect(service['isPlayersTurn'](lobbyMock.playerList)).to.equal(true);
    });
});
