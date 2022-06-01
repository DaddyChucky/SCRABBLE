/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable dot-notation */
import { DatabaseServiceMock } from '@app/classes/database.service.mock';
import { HttpException } from '@app/classes/http.exception';
import { Player } from '@common/model/player';
import { ScorePack } from '@common/model/score-pack';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import { ScoresService } from './scores.service';
import * as specConstants from './scores.service.spec.constants';
import Sinon = require('sinon');
chai.use(chaiAsPromised);

describe('Scores service', () => {
    let scoresService: ScoresService;
    let client: MongoClient;
    let staticScore: ScorePack;
    const databaseService: DatabaseServiceMock = new DatabaseServiceMock();

    beforeEach(async () => {
        client = (await databaseService.start()) as MongoClient;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- db usage
        scoresService = new ScoresService(databaseService as any);
        staticScore = { score: 3, names: ['bobs4'] } as ScorePack;
        await scoresService.collectionClassic.deleteMany({});
        await scoresService.collectionLog2990.deleteMany({});
        await scoresService.collectionLog2990.insertOne(specConstants.SCORE4);
        await scoresService.collectionClassic.insertOne(specConstants.SCORE4);
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should get all classic scores from DB', async () => {
        const scores: ScorePack[] = await scoresService.getAllClassicScores();
        expect(scores.length).to.equal(1);
        expect(staticScore).to.deep.equals(scores[0]);
    });

    it('should get all log scores from DB', async () => {
        const scores: ScorePack[] = await scoresService.getAllLogScores();
        expect(scores.length).to.equal(1);
        expect(staticScore).to.deep.equals(scores[0]);
    });

    it('should get a player from classic DB with getPlayerScore', async () => {
        const scorePack: ScorePack | null = await scoresService.getPlayerScore(specConstants.SCORE4.names[0], specConstants.SCORE4.score);
        expect(scorePack?.names.length).to.equal(1);
        expect(scorePack?.score).to.deep.equals(specConstants.SCORE4.score);
        expect(scorePack?.names).to.deep.equals(specConstants.SCORE4.names);
    });

    it('should get a player from log DB with getPlayerScore', async () => {
        const scorePack: ScorePack | null = await scoresService.getPlayerScore(specConstants.SCORE4.names[0], specConstants.SCORE4.score, false);
        expect(scorePack?.names.length).to.equal(1);
        expect(scorePack?.score).to.deep.equals(specConstants.SCORE4.score);
        expect(scorePack?.names).to.deep.equals(specConstants.SCORE4.names);
    });

    it('should get a scorePack from classic DB with getScore finds a score', async () => {
        const scorePack: ScorePack | null = await scoresService.getScore(specConstants.SCORE4.score);
        expect(scorePack?.names.length).to.equal(1);
        expect(scorePack?.score).to.deep.equals(specConstants.SCORE4.score);
        expect(scorePack?.names).to.deep.equals(specConstants.SCORE4.names);
    });

    it('should get a scorePack from log DB with getScore finds a score', async () => {
        const scorePack: ScorePack | null = await scoresService.getScore(specConstants.SCORE4.score, false);
        expect(scorePack?.names.length).to.equal(1);
        expect(scorePack?.score).to.deep.equals(specConstants.SCORE4.score);
        expect(scorePack?.names).to.deep.equals(specConstants.SCORE4.names);
    });

    it('should get null if score doesnt exist from classic DB', async () => {
        const scorePack: ScorePack | null = await scoresService.getPlayerScore(specConstants.SCORE4.names[0], specConstants.FAKE_SCORE);
        expect(scorePack).to.deep.equals(null);
    });

    it('should get null if score doesnt exist from LOG DB', async () => {
        const scorePack: ScorePack | null = await scoresService.getPlayerScore(specConstants.SCORE4.names[0], specConstants.FAKE_SCORE, false);
        expect(scorePack).to.deep.equals(null);
    });

    it('should insert a new score pack to classic scores', async () => {
        await scoresService.addPlayerScore(specConstants.PLAYER_MOD);
        const scores = await scoresService.collectionClassic.find({}).toArray();
        expect(scores.length).to.equal(2);
        expect(scores.find((scorePack) => scorePack.score === specConstants.SCORE4.score)?.names).to.deep.equals(specConstants.SCORE4.names);
        expect(scores.find((scorePack) => scorePack.score === specConstants.PLAYER_MOD.score)?.names[0]).to.deep.equals(
            specConstants.PLAYER_MOD.name,
        );
    });
    it('should insert a new score pack to log scores', async () => {
        await scoresService.addPlayerScore(specConstants.PLAYER_MOD, false);
        const scores = await scoresService.collectionLog2990.find({}).toArray();
        expect(scores.length).to.equal(2);
        expect(scores.find((scorePack) => scorePack.score === specConstants.SCORE4.score)?.names).to.deep.equals(specConstants.SCORE4.names);
        expect(scores.find((scorePack) => scorePack.score === specConstants.PLAYER_MOD.score)?.names[0]).to.deep.equals(
            specConstants.PLAYER_MOD.name,
        );
    });

    it('should modify an existing score data to classic collection', async () => {
        await scoresService.modifyScore(specConstants.PLAYER);
        const scores = await scoresService.collectionClassic.find({}).toArray();
        expect(scores.length).to.equal(1);
        expect(scores.find((scorePack) => scorePack.score === specConstants.SCORE4.score)?.names[0]).to.deep.equals(specConstants.SCORE4.names[0]);
        expect(scores.find((scorePack) => scorePack.score === specConstants.SCORE4.score)?.names[1]).to.deep.equals(specConstants.PLAYER.name);
    });

    it('should modify an existing score data to LOG collection', async () => {
        await scoresService.modifyScore(specConstants.PLAYER, false);
        const scores = await scoresService.collectionLog2990.find({}).toArray();
        expect(scores.length).to.equal(1);
        expect(scores.find((scorePack) => scorePack.score === specConstants.SCORE4.score)?.names[0]).to.deep.equals(specConstants.SCORE4.names[0]);
        expect(scores.find((scorePack) => scorePack.score === specConstants.SCORE4.score)?.names[1]).to.deep.equals(specConstants.PLAYER.name);
    });

    it('should not modify an existing score classic data if no valid score is passed', async () => {
        specConstants.PLAYER.score = 12536;
        await scoresService.modifyScore(specConstants.PLAYER);
        const scores = await scoresService.collectionClassic.find({}).toArray();
        expect(scores.length).to.equal(1);
        expect(scores.find((scorePack) => scorePack.score === specConstants.SCORE4.score)?.score).to.not.deep.equals(specConstants.PLAYER.score);
        expect(scores.find((scorePack) => scorePack.score === specConstants.SCORE4.score)?.names[0]).to.deep.equals(specConstants.SCORE4.names[0]);
    });

    it('should not modify an existing score classic data if no valid score is passed', async () => {
        specConstants.PLAYER.score = 12536;
        await scoresService.modifyScore(specConstants.PLAYER);
        const scores = await scoresService.collectionLog2990.find({}).toArray();
        expect(scores.length).to.equal(1);
        expect(scores.find((scorePack) => scorePack.score === specConstants.SCORE4.score)?.score).to.not.deep.equals(specConstants.PLAYER.score);
        expect(scores.find((scorePack) => scorePack.score === specConstants.SCORE4.score)?.names[0]).to.deep.equals(specConstants.SCORE4.names[0]);
    });

    it('should call db populate', async () => {
        const spy: Sinon.SinonStub<[], Promise<void>> = Sinon.stub(scoresService['databaseService'], 'setDefaultScores').callsFake(async () => {
            return;
        });
        await scoresService.resetAllScores();
        expect(spy.calledOnce);
    });

    describe('Error handling', async () => {
        it('should throw an error if we try to get all classic scores on a closed connection', async () => {
            await client.close();
            await client.connect();
            expect(scoresService.getAllClassicScores()).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to get all log scores on a closed connection', async () => {
            await client.close();
            await client.connect();
            expect(scoresService.getAllLogScores()).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to modify a specific log score on a closed connection', async () => {
            await client.close();
            await client.connect();
            expect(scoresService.modifyScore({} as Player, false)).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to modify a specific classic score on a closed connection', async () => {
            await client.close();
            await client.connect();
            expect(scoresService.modifyScore({} as Player)).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to get a specific classic player on a closed connection', async () => {
            await client.close();
            await client.connect();
            expect(scoresService.getPlayerScore(specConstants.FAKE_NAME, specConstants.FAKE_SCORE)).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to get a specific log player on a closed connection', async () => {
            await client.close();
            await client.connect();
            expect(scoresService.getPlayerScore(specConstants.FAKE_NAME, specConstants.FAKE_SCORE, false)).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to get a specific log score on a closed connection', async () => {
            await client.close();
            await client.connect();
            expect(scoresService.getScore(specConstants.FAKE_SCORE)).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to get a specific log score on a closed connection', async () => {
            await client.close();
            await client.connect();
            expect(scoresService.getScore(specConstants.FAKE_SCORE, false)).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to add palyer to classic on a closed connection', async () => {
            await client.close();
            await client.connect();
            expect(scoresService.addPlayerScore(specConstants.PLAYER)).to.eventually.be.rejectedWith(HttpException);
        });

        it('should throw an error if we try to add palyer to log on a closed connection', async () => {
            await client.close();
            await client.connect();
            expect(scoresService.addPlayerScore(specConstants.PLAYER, false)).to.eventually.be.rejectedWith(HttpException);
        });
    });
});
