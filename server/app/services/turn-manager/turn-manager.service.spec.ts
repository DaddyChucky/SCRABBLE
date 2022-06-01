/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
/* eslint-disable max-lines */
import { TestHelper } from '@app/classes/test-helper';
import { EndGameManagementService } from '@app/services/end-game-management/end-game-management.service';
import { GamesLogsService } from '@app/services/games-logs/games-logs.service';
import { LetterBagService } from '@app/services/letter-bag/letter-bag.service';
import { PointCalculatorService } from '@app/services/point-calculator/point-calculator.service';
import { QuestVerifyService } from '@app/services/quest-verify/quest-verify.service';
import { Q_FIVE_SECONDS_MOVE } from '@app/services/quest-verify/quest-verify.service.spec.constants';
import { ScrabbleGridService } from '@app/services/scrabble-grid/scrabble-grid.service';
import { VPManagementService } from '@app/services/vp-management/vp-management.service';
import { WordValidatorService } from '@app/services/word-validator/word-validator.service';
import { GridTiles } from '@common/model/grid-tiles';
import { LetterBag } from '@common/model/letter-bag/letter-bag';
import { LobbyMock } from '@common/model/lobby-mock';
import { LobbyStatus } from '@common/model/lobby-status';
import { LobbyType } from '@common/model/lobby-type';
import { Player } from '@common/model/player';
import { Quest } from '@common/model/quest';
import { ScrabbleGrid } from '@common/model/scrabble-grid';
import { Tile } from '@common/model/tile';
import { WordValidation } from '@common/model/word-validation';
import { expect } from 'chai';
import { TurnManagerService } from './turn-manager.service';
import * as serviceConstants from './turn-manager.service.constants';
import * as specConstants from './turn-manager.service.spec.constants';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Sinon = require('sinon');

describe('TurnManagerService', () => {
    let service: Sinon.SinonStubbedInstance<TurnManagerService>;
    let lobbyMock: LobbyMock;
    let grid: ScrabbleGrid = { elements: [] } as ScrabbleGrid;
    const testHelper: TestHelper = new TestHelper(grid);
    let gridTiles: GridTiles;
    const letterBagService: LetterBagService = new LetterBagService();
    const wordValidatorService: WordValidatorService = new WordValidatorService(serviceConstants.DICT_NAME);
    const scrabbleGridService: ScrabbleGridService = new ScrabbleGridService();
    const real: TurnManagerService = new TurnManagerService(
        letterBagService,
        new EndGameManagementService(letterBagService),
        new PointCalculatorService(grid, [], wordValidatorService, scrabbleGridService),
    );
    let endGameManagerStub: Sinon.SinonStubbedInstance<EndGameManagementService>;
    let letterBagStub: Sinon.SinonStubbedInstance<LetterBagService>;
    let pointCalcStub: Sinon.SinonStubbedInstance<PointCalculatorService>;
    let questVerifyStub: Sinon.SinonStubbedInstance<QuestVerifyService>;
    let gameLogsStub: Sinon.SinonStubbedInstance<GamesLogsService>;
    let vpManagementStub: Sinon.SinonStubbedInstance<VPManagementService>;

    beforeEach(async () => {
        service = Sinon.createStubInstance<TurnManagerService>(TurnManagerService);
        grid = testHelper.initializeGrid();
        gridTiles = specConstants.GRID_TILES;
        gridTiles.grid = grid;
        real['pointCalculatorService']['grid'] = grid;
        endGameManagerStub = Sinon.createStubInstance(EndGameManagementService);
        endGameManagerStub['turnPassedNb'] = 0;
        endGameManagerStub['isEndGame'].callsFake(() => {
            return false;
        });
        endGameManagerStub['messageToSend'].callsFake(() => {
            return '';
        });
        endGameManagerStub['letterBagSizeMessage'].callsFake(() => {
            return '';
        });
        endGameManagerStub['endGameVerification'].callsFake(() => {
            return;
        });
        letterBagStub = Sinon.createStubInstance(LetterBagService);
        letterBagStub['removeLetters'].callsFake(() => {
            return '';
        });
        letterBagStub['giveBackLetters'].callsFake(() => {
            return '';
        });
        letterBagStub['refillLetters'].callsFake(() => {
            return true;
        });
        pointCalcStub = Sinon.createStubInstance(PointCalculatorService);
        pointCalcStub['update'].callsFake(() => {
            return '';
        });
        pointCalcStub['checkAllWordsFormed'].callsFake(() => {
            return '';
        });
        questVerifyStub = Sinon.createStubInstance(QuestVerifyService);
        questVerifyStub['setTimer'].callsFake(() => {
            return;
        });
        questVerifyStub['updateQuest'].callsFake(() => {
            return;
        });
        questVerifyStub['checkQuestsAndReturnPoints'].callsFake(() => {
            return 0;
        });
        gameLogsStub = Sinon.createStubInstance(GamesLogsService);
        gameLogsStub['addStartingDate'].callsFake(() => {
            return;
        });
        vpManagementStub = Sinon.createStubInstance(VPManagementService);
        vpManagementStub['randomName'].callsFake(async () => {
            return '';
        });
        service['endGameManagement'] = endGameManagerStub;
        service['letterBagService'] = letterBagStub;
        service['pointCalculatorService'] = pointCalcStub;
        service['questVerifyService'] = questVerifyStub;
        service['gameLogsService'] = gameLogsStub;
        service['vpManagementService'] = vpManagementStub;
        service['createGame'].callsFake(real['createGame']);
        service['switchTurn'].callsFake(real['switchTurn']);
        service['passTurn'].callsFake(real['passTurn']);
        service['removeTilesFromPlayerTemporary'].callsFake(real['removeTilesFromPlayerTemporary']);
        service['giveBackTilesOfPlayer'].callsFake(real['giveBackTilesOfPlayer']);
        service['removeAndRefillTiles'].callsFake(real['removeAndRefillTiles']);
        service['checkWordValidationAndPoints'].callsFake(real['checkWordValidationAndPoints']);
        service['addPointsToActivePlayer'].callsFake(real['addPointsToActivePlayer']);
        service['getActivePlayer'].callsFake(real['getActivePlayer']);
        service['isGameEnd'].callsFake(real['isGameEnd']);
        service['messageEndGame'].callsFake(real['messageEndGame']);
        service['messageletterBagEndGame'].callsFake(real['messageletterBagEndGame']);
        service['endGame'].callsFake(real['endGame']);
        service['verifyQuestCompletion'].callsFake(real['verifyQuestCompletion']);
        service['resignation'].callsFake(real['resignation']);
        service['verifyPrivateQuests'].callsFake(real['verifyPrivateQuests']);
        service['verifyPublicQuests'].callsFake(real['verifyPublicQuests']);
        service['changeWeightOfBlankTile'].callsFake(real['changeWeightOfBlankTile']);
        service['changeTurn'].callsFake(real['changeTurn']);
        lobbyMock = {
            playerList: [specConstants.PLAYER_1, specConstants.PLAYER_2],
            lobbyType: LobbyType.CLASSIC,
            dictionary: serviceConstants.DICT_NAME,
            baseTimerValue: 60,
            timeLeft: 0,
            lobbyId: 'thisismylobby',
            lobbyStatus: LobbyStatus.CREATED,
            letterBag: new LetterBag(),
        };
    });

    it('createGame should create a game', () => {
        service.createGame(specConstants.EXPECTED_LOBBY.lobbyId);
        Sinon.assert.calledOnce(gameLogsStub['addStartingDate']);
        expect(service['endGameManagement'].turnPassedNb).to.be.equal(specConstants.TURN_NB_RESET);
    });

    it('switchTurn should call changeTurn and reset the turnPassedNb', () => {
        service['endGameManagement'].turnPassedNb = specConstants.TURN_PASSED_BASE;
        service.switchTurn(lobbyMock);
        expect(service['endGameManagement'].turnPassedNb).to.be.equal(specConstants.TURN_NB_RESET);
        Sinon.assert.calledOnce(service['changeTurn']);
    });

    it('passTurn should increment the value of turnPassedNb', () => {
        service['endGameManagement'].turnPassedNb = specConstants.TURN_PASSED_BASE;
        service.passTurn(lobbyMock);
        expect(service['endGameManagement'].turnPassedNb).to.be.equal(specConstants.TURN_PASSED_INC);
    });

    it('passTurn should call changeTurn if turnPassedNb < 5 and toggle he turn of players', () => {
        service['endGameManagement'].turnPassedNb = specConstants.TURN_PASSED_BASE;
        service.passTurn(lobbyMock);
        Sinon.assert.calledOnce(service['changeTurn']);
    });

    it('passTurn should toggle the turn value of players i lobby if turnPassedNb < 5', () => {
        lobbyMock.playerList[0].isTurn = true;
        lobbyMock.playerList[1].isTurn = false;
        service.passTurn(lobbyMock);
        expect(lobbyMock.playerList[0].isTurn).to.be.equal(false);
        expect(lobbyMock.playerList[1].isTurn).to.be.equal(true);
    });

    it('messageEndGame should call messageTosend from endGameManagement', () => {
        service.messageEndGame(lobbyMock);
        Sinon.assert.calledOnce(service['endGameManagement']['messageToSend']);
    });

    it('messageletterBagEndGame should call letterBagSizeMessage from endGameManagement', () => {
        service.messageletterBagEndGame(lobbyMock);
        Sinon.assert.calledOnce(service['endGameManagement']['letterBagSizeMessage']);
    });

    it('isGameEnd should call isEndGame from endGameManagement', () => {
        service.isGameEnd(lobbyMock);
        Sinon.assert.calledOnce(service['endGameManagement']['isEndGame']);
    });

    it('passTurn should call endGame if turnPassedNb >= 5', () => {
        service['endGameManagement']['isEndGame'].callsFake(() => {
            return true;
        });
        service['endGameManagement'].turnPassedNb = specConstants.TURN_PASSED_LIMIT;
        service.passTurn(lobbyMock);
        Sinon.assert.calledOnce(service['endGame']);
    });

    it('endGame should set to false the turn of players in lobby', () => {
        lobbyMock.playerList[0].isTurn = true;
        lobbyMock.playerList[1].isTurn = true;
        service.endGame(lobbyMock);
        expect(specConstants.PLAYER_1.isTurn).to.be.equal(false);
        expect(specConstants.PLAYER_2.isTurn).to.be.equal(false);
    });

    it('removeAndRefillTiles should call removeLetters and refillLetters of letterBagService if active player is defined', () => {
        lobbyMock.playerList[0].isTurn = true;
        service.removeAndRefillTiles(lobbyMock, specConstants.WORD);
        Sinon.assert.calledOnce(service['letterBagService']['refillLetters']);
        Sinon.assert.calledOnce(service['letterBagService']['removeLetters']);
    });

    it('removeAndRefillTiles should not call removeLetters and refillLetters of letterBagService if active player is not defined', () => {
        lobbyMock.playerList[0].isTurn = false;
        lobbyMock.playerList[1].isTurn = false;
        service.removeAndRefillTiles(lobbyMock, specConstants.WORD);
        Sinon.assert.notCalled(service['letterBagService']['refillLetters']);
        Sinon.assert.notCalled(service['letterBagService']['removeLetters']);
    });

    it('removeTilesFromPlayerTemporary should not call removeLetters from letterBagService if active player is not defined', () => {
        lobbyMock.playerList[0].isTurn = false;
        lobbyMock.playerList[1].isTurn = false;
        service.removeTilesFromPlayerTemporary(lobbyMock, specConstants.WORD);
        Sinon.assert.notCalled(service['letterBagService']['removeLetters']);
    });

    it('removeTilesFromPlayerTemporary should call removeLetters from letterBagService if active player is defined', () => {
        lobbyMock.playerList[1].isTurn = false;
        lobbyMock.playerList[0].isTurn = true;
        lobbyMock.playerList[0].tiles = specConstants.TILES;
        service.removeTilesFromPlayerTemporary(lobbyMock, serviceConstants.WORD_TO_REMOVE);
        Sinon.assert.calledOnce(service['letterBagService']['removeLetters']);
    });

    it('giveBackTilesOfPlayer should not call giveBackLetters from letterBagService if active player is not defined', () => {
        lobbyMock.playerList[0].isTurn = false;
        lobbyMock.playerList[1].isTurn = false;
        service.giveBackTilesOfPlayer(lobbyMock, specConstants.WORD);
        Sinon.assert.notCalled(service['letterBagService']['giveBackLetters']);
    });

    it('giveBackTilesOfPlayer should call giveBackLetters from letterBagService if active player is defined', () => {
        lobbyMock.playerList[0].isTurn = false;
        lobbyMock.playerList[1].isTurn = true;
        service.giveBackTilesOfPlayer(lobbyMock, specConstants.WORD);
        Sinon.assert.calledOnce(service['letterBagService']['giveBackLetters']);
    });

    it('checkWordValidationAndPoints should return true if new points are greater than 0', () => {
        const wordValidation: WordValidation = specConstants.VALID_WORD_VALIDATION;
        wordValidation.parsedInfo.scrabbleGrid = grid;
        Sinon.stub(service['pointCalculatorService'], 'newPoints').value(specConstants.NEW_POINTS);
        expect(service.checkWordValidationAndPoints(wordValidation)).to.be.equal(true);
    });

    it('checkWordValidationAndPoints should call update, checkAllWordsFormed from PointCalculatorService and changeWeightOfBlankTile', () => {
        const wordValidation: WordValidation = specConstants.VALID_WORD_VALIDATION;
        wordValidation.parsedInfo.scrabbleGrid = grid;
        Sinon.stub(service['pointCalculatorService'], 'newPoints').value(0);
        expect(service.checkWordValidationAndPoints(wordValidation)).to.be.equal(false);
        Sinon.assert.calledOnce(service['changeWeightOfBlankTile']);
        Sinon.assert.calledOnce(service['pointCalculatorService']['update']);
        Sinon.assert.calledOnce(service['pointCalculatorService']['checkAllWordsFormed']);
    });

    it('checkWordValidationAndPoints should return false if newPoints === 0', () => {
        const wordValidation: WordValidation = specConstants.INVALID_WORD_VALIDATION;
        wordValidation.parsedInfo.scrabbleGrid = grid;
        lobbyMock.playerList[0] = specConstants.PLAYER_1;
        lobbyMock.playerList[1] = specConstants.PLAYER_2;
        Sinon.stub(service['pointCalculatorService'], 'newPoints').value(0);
        lobbyMock.playerList[0].score = 0;
        expect(service.checkWordValidationAndPoints(wordValidation)).to.be.equal(false);
        expect(lobbyMock.playerList[0].score).to.be.equal(0);
    });

    it('checkWordValidationAndPoints should return false if active player is not defined', () => {
        const wordValidation: WordValidation = specConstants.INVALID_WORD_VALIDATION;
        wordValidation.parsedInfo.scrabbleGrid = grid;
        lobbyMock.playerList[0].isTurn = false;
        Sinon.stub(service['pointCalculatorService'], 'newPoints').value(0);
        lobbyMock.playerList[1].isTurn = false;
        expect(service.checkWordValidationAndPoints(wordValidation)).to.be.equal(false);
    });

    it('addPointsToActivePlayer not change any score if active player is undefined', () => {
        for (const player of lobbyMock.playerList) {
            player.isTurn = false;
            player.score = specConstants.INITAL_SCORE;
        }
        lobbyMock.playerList[0].isTurn = false;
        lobbyMock.playerList[1].isTurn = false;
        service.addPointsToActivePlayer(lobbyMock);
        for (const player of lobbyMock.playerList) {
            expect(player.score).to.be.equal(specConstants.INITAL_SCORE);
        }
    });

    it("addPointsToActivePlayer should add points to active player's score", () => {
        lobbyMock.playerList[0].isTurn = true;
        lobbyMock.playerList[1].isTurn = false;
        lobbyMock.playerList[0].score = specConstants.INITAL_SCORE;
        lobbyMock.playerList[1].score = specConstants.INITAL_SCORE;
        Sinon.stub(service['pointCalculatorService'], 'newPoints').value(specConstants.NEW_POINTS);
        service.addPointsToActivePlayer(lobbyMock);
        expect(lobbyMock.playerList[0].score).to.equal(specConstants.INITAL_SCORE + specConstants.NEW_POINTS);
        expect(lobbyMock.playerList[1].score).to.equal(specConstants.INITAL_SCORE);
    });

    it('getActivePlayer should return undefined if no players are active', () => {
        lobbyMock.playerList[0].isTurn = false;
        lobbyMock.playerList[1].isTurn = false;
        const activePlayer: Player | undefined = service['getActivePlayer'](lobbyMock.playerList);
        expect(activePlayer).to.be.equal(undefined);
    });

    it('getActivePlayer should return active player', () => {
        lobbyMock.playerList[0].isTurn = false;
        lobbyMock.playerList[1].isTurn = true;
        const activePlayer: Player | undefined = service['getActivePlayer'](lobbyMock.playerList);
        expect(activePlayer).to.be.equal(lobbyMock.playerList[1]);
    });

    it('resignation should replace the player who give-up with a virtual player', async () => {
        await service.resignation(lobbyMock, specConstants.PLAYER_1.playerId);
        expect(lobbyMock.playerList[0].playerId).to.be.equal(serviceConstants.VIRTUAL_PLAYER_ID);
    });

    it('resignation should give the player info to virtual player', async () => {
        const expectedTiles: Tile[] = specConstants.PLAYER_2.tiles;
        const expectedScore: number = specConstants.PLAYER_2.score;
        const expectedQuest: Quest = specConstants.PLAYER_2.sideQuest;
        await service.resignation(lobbyMock, specConstants.PLAYER_2.playerId);
        const virtualPlayer: Player | undefined = lobbyMock.playerList.find((player) => player.playerId === serviceConstants.VIRTUAL_PLAYER_ID);
        expect(virtualPlayer?.tiles).to.be.equal(expectedTiles);
        expect(virtualPlayer?.isTurn).to.equal(false);
        expect(virtualPlayer?.score).to.be.equal(expectedScore);
        expect(virtualPlayer?.sideQuest).to.be.equal(expectedQuest);
    });

    it("resignation shouln't change the lobby state if player not found", () => {
        const expectedLobby: LobbyMock = lobbyMock;
        service.resignation(lobbyMock, serviceConstants.VIRTUAL_PLAYER_ID);
        expect(lobbyMock).to.be.equal(expectedLobby);
    });

    it('changeWeightOfBlankTile should change all blank tile weights to zero', () => {
        const wordValidation: WordValidation = specConstants.WORD_VALIDATION_WITH_ONLY_BLANK_TILES;
        wordValidation.parsedInfo.completeWord = specConstants.WORD_ALL_BLANK_TILES;
        service['changeWeightOfBlankTile'](wordValidation);
        for (const tile of wordValidation.tiles.newTilesToAdd) {
            expect(tile.weight).to.be.equal(0);
        }
    });

    it('changeWeightOfBlankTile should not change weight if complete word is undefined', () => {
        const wordValidation: WordValidation = specConstants.WORD_VALIDATION_WITH_ONLY_BLANK_TILES;
        wordValidation.tiles.newTilesToAdd = specConstants.TILES;
        wordValidation.parsedInfo.completeWord = undefined;
        service['changeWeightOfBlankTile'](wordValidation);
        for (let i = 0; i < wordValidation.tiles.newTilesToAdd.length; ++i) {
            expect(wordValidation.tiles.newTilesToAdd[i].weight).to.be.equal(specConstants.TILES[i].weight);
        }
    });

    it("changeWeightOfBlankTile should not change tile's weight if it not a blank tile", () => {
        const wordValidation: WordValidation = specConstants.WORD_VALIDATION_BLANK_TILE;
        wordValidation.tiles.newTilesToAdd = specConstants.TILES;
        wordValidation.parsedInfo.completeWord = specConstants.WORD_WITH_NO_BLANK_TILE;
        service['changeWeightOfBlankTile'](wordValidation);
        for (let i = 0; i < wordValidation.tiles.newTilesToAdd.length; ++i) {
            expect(wordValidation.tiles.newTilesToAdd[i].weight).to.be.equal(specConstants.TILES[i].weight);
        }
    });

    it('changeWeightOfBlankTile should not only change specific blank tile weight and not change other tiles', () => {
        const wordValidation: WordValidation = specConstants.WORD_VALIDATION_BLANK_TILE;
        wordValidation.tiles.newTilesToAdd = specConstants.TILES_RU;
        wordValidation.parsedInfo.completeWord = specConstants.WORD_WITH_BLANK_TILE;
        service['changeWeightOfBlankTile'](wordValidation);
        expect(wordValidation.tiles.newTilesToAdd[0].weight).to.be.equal(0);
        for (let i = 1; i < wordValidation.tiles.newTilesToAdd.length; ++i) {
            expect(wordValidation.tiles.newTilesToAdd[i].weight).to.be.equal(specConstants.TILES_RU[i].weight);
        }
    });

    it('verify quest completion should not call getActivePlayer if timer is equal to 0', () => {
        service.verifyQuestCompletion(specConstants.EXPECTED_LOBBY, specConstants.VALID_WORD_VALIDATION, specConstants.NULL_TIMER);
        Sinon.assert.notCalled(service['getActivePlayer']);
    });

    it('verify quest completion should call getActivePlayer if timer is not equal to 0', () => {
        service.verifyQuestCompletion(specConstants.EXPECTED_LOBBY, specConstants.VALID_WORD_VALIDATION, specConstants.POSITIVE_TIMER);
        Sinon.assert.calledOnce(service['getActivePlayer']);
    });

    it('verify public quest should not call questVerifyService.updateQuest if public quests is undefined', () => {
        service['verifyPublicQuests'](specConstants.PLAYER1, specConstants.VALID_WORD_VALIDATION, undefined, specConstants.POSITIVE_TIMER);
        Sinon.assert.notCalled(service['questVerifyService']['updateQuest']);
    });

    it('verify public quest should not call questVerifyService.updateQuest if public quests are accomplished', () => {
        specConstants.ACCOMPLISHED_QUEST[0].isAccomplished = true;
        specConstants.ACCOMPLISHED_QUEST[1].isAccomplished = true;
        service['verifyPublicQuests'](
            specConstants.PLAYER1,
            specConstants.VALID_WORD_VALIDATION,
            specConstants.ACCOMPLISHED_QUEST,
            specConstants.POSITIVE_TIMER,
        );
        Sinon.assert.notCalled(service['questVerifyService']['updateQuest']);
    });

    it('verify public quest should call questVerifyService.updateQuest if public quests are not accomplished', () => {
        specConstants.ACCOMPLISHED_QUEST[0].isAccomplished = false;
        specConstants.ACCOMPLISHED_QUEST[1].isAccomplished = false;
        service['verifyPublicQuests'](
            specConstants.PLAYER1,
            specConstants.VALID_WORD_VALIDATION,
            specConstants.ACCOMPLISHED_QUEST,
            specConstants.POSITIVE_TIMER,
        );
        Sinon.assert.called(service['questVerifyService']['updateQuest']);
    });

    it('verify privates quest should not call questVerifyService.setTimer if quest if five seconds quest', () => {
        specConstants.PLAYER1.sideQuest = Q_FIVE_SECONDS_MOVE;
        specConstants.PLAYER1.sideQuest.isAccomplished = false;
        service['verifyPrivateQuests'](specConstants.PLAYER1, specConstants.VALID_WORD_VALIDATION, specConstants.POSITIVE_TIMER);
        Sinon.assert.calledOnce(service['questVerifyService']['setTimer']);
    });
});
