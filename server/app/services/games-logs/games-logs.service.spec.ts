/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { DatabaseServiceMock } from '@app/classes/database.service.mock';
import { HttpException } from '@app/classes/http.exception';
import { GameLog } from '@common/model/game-log';
import { MultiplayerLobby } from '@common/model/lobby';
import { PlayerInfoLog } from '@common/model/player-info-log';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import { GamesLogsService } from './games-logs.service';
import * as specConstants from './games-logs.service.spec.constants';
import { NUMBER_ERROR_VALUE } from './games-logs.services.constants';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Sinon = require('sinon');

chai.use(chaiAsPromised);

describe('GameLog service', () => {
    let gamesLogService: GamesLogsService;
    let databaseService: DatabaseServiceMock;
    let client: MongoClient;

    before(() => {
        databaseService = new DatabaseServiceMock();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- db usage
        gamesLogService = new GamesLogsService(databaseService as any);
    });

    afterEach(() => {
        Sinon.restore();
    });

    after(async () => {
        databaseService.closeConnection();
        client.close();
    });

    it('addStartingDate should add a starting date in the map', () => {
        const expectedLength: number = gamesLogService['startingGameDate'].size + 1;
        gamesLogService.addStartingDate(specConstants.LOBBY_ID);
        expect(gamesLogService['startingGameDate'].size).to.equal(expectedLength);
        expect(gamesLogService['startingGameDate'].get(specConstants.LOBBY_ID)).to.be.an.instanceof(Date);
    });

    it('getTimeSinceStart should return the time since the start time of a lobby and delete the tuple in startingGameDate', () => {
        gamesLogService['startingGameDate'].set(specConstants.LOBBY_ID, specConstants.START_DATE);
        expect(gamesLogService.getTimeSinceStart(specConstants.LOBBY_ID)).to.be.greaterThan(0);
        expect(gamesLogService['startingGameDate'].size).to.equal(0);
    });

    it('getTimeSinceStart should return -1 if any value was found', () => {
        expect(gamesLogService.getTimeSinceStart(specConstants.LOBBY_ID)).to.equal(NUMBER_ERROR_VALUE);
    });

    it('createGameLog should create a GameLog based on a MultiplayerLobby', () => {
        Sinon.stub(gamesLogService['startingGameDate'], 'get').returns(specConstants.START_DATE);
        Sinon.stub(gamesLogService, 'getTimeSinceStart').returns(specConstants.GAME_DURATION);
        Sinon.stub(gamesLogService, 'createPlayerLog' as never).returns(specConstants.PLAYER_LOGS);
        const gameLogReceived: GameLog | undefined = gamesLogService['createGameLog'](specConstants.LOBBY, false);
        if (!gameLogReceived) expect(true).to.equal(false);
        else {
            expect(gameLogReceived.date).to.equal(specConstants.START_DATE.toString());
            expect(gameLogReceived.minutes).to.equal(specConstants.GAME_DURATION_MINUTES);
            expect(gameLogReceived.seconds).to.equal(specConstants.GAME_DURATION_SECONDS);
            expect(gameLogReceived.isAbandoned).to.equal(false);
            expect(gameLogReceived.mode).to.equal(specConstants.CLASSIC_TYPE);
            expect(gameLogReceived.playerInfos).to.equal(specConstants.PLAYER_LOGS);
        }
    });

    it('createGameLog should call Map.get, getTimeSinceStart, createPlayerLog', () => {
        const mapGetStub: Sinon.SinonStub<[key: string], Date | undefined> = Sinon.stub(gamesLogService['startingGameDate'], 'get').returns(
            specConstants.START_DATE,
        );
        const getTimeStub: Sinon.SinonStub<[lobbyId: string], number> = Sinon.stub(gamesLogService, 'getTimeSinceStart').returns(
            specConstants.GAME_DURATION,
        );
        const createPlayerLogStub: Sinon.SinonStub<unknown[], unknown> = Sinon.stub(gamesLogService, 'createPlayerLog' as never).returns(
            specConstants.PLAYER_LOGS,
        );
        gamesLogService['createGameLog'](specConstants.LOBBY, false);
        expect(mapGetStub.called);
        expect(getTimeStub.called);
        expect(createPlayerLogStub.called);
    });

    it('createPlayerLog should create a PlayerLog[] based on a Player[]', () => {
        const playerLogReturned: PlayerInfoLog[] = gamesLogService['createPlayerLog'](specConstants.PLAYERS);
        expect(playerLogReturned.length).to.equal(specConstants.PLAYERS.length);
        for (let index = 0; index < playerLogReturned.length; index++) {
            expect(playerLogReturned[index].name).to.equal(specConstants.PLAYERS[index].name);
            expect(playerLogReturned[index].score).to.equal(specConstants.PLAYERS[index].score);
        }
    });

    describe('async function', () => {
        databaseService = new DatabaseServiceMock();
        beforeEach(async () => {
            client = (await databaseService.start()) as MongoClient;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- db usage
            gamesLogService = new GamesLogsService(databaseService as any);
            specConstants.INITIAL_LOG.date = specConstants.START_DATE.toString();
        });

        afterEach(async () => {
            await databaseService.closeConnection();
        });

        it('should get all classic scores from DB', async () => {
            await gamesLogService.collectionGamesLogs.insertOne(specConstants.INITIAL_LOG);
            const gameLogs: GameLog[] = await gamesLogService.getAllLogs();
            expect(gameLogs.length).to.be.greaterThan(0);
            expect(specConstants.INITIAL_LOG).to.deep.equal(gameLogs[0]);
        });

        it('addLog should insert a new GameLog in collection', async () => {
            const createGameLogStub: Sinon.SinonStub<unknown[], unknown> = Sinon.stub(gamesLogService, 'createGameLog' as never).returns(
                specConstants.GAME_LOG_ABANDONED,
            );
            await gamesLogService.addLog(specConstants.LOBBY);
            expect(createGameLogStub.called);
            expect((await gamesLogService.collectionGamesLogs.find({}).toArray()).length).to.equal(specConstants.SIZE_AFTER_INSERT_2);
        });

        it('resetLogs should delete all logs in the collection and let one element', async () => {
            expect((await gamesLogService.collectionGamesLogs.find({}).toArray()).length).to.be.greaterThan(0);
            await gamesLogService.resetLogs();
            expect((await gamesLogService.collectionGamesLogs.find({}).toArray()).length).to.equal(specConstants.ONE_ELEMENT_ARRAY_LENGTH);
        });

        it('should throw an error if we try to get all gameLog on a closed connection', async () => {
            await client.close();
            await client.connect();
            expect(gamesLogService.getAllLogs()).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to add a gameLog on a closed connection', async () => {
            Sinon.stub(gamesLogService, 'createGameLog' as any).callsFake(() => {
                return specConstants.GAME_LOG_ABANDONED;
            });
            await client.close();
            await client.connect();
            expect(gamesLogService.addLog({} as MultiplayerLobby)).to.eventually.be.rejectedWith(HttpException);
        });

        it('should throw an error if we try to reset logs on a closed connection', async () => {
            await client.close();
            await client.connect();
            expect(gamesLogService.resetLogs()).to.eventually.be.rejectedWith(HttpException);
        });
    });
});
