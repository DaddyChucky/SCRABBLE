/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable dot-notation */
// needed to test connexion to db
import { fail } from 'assert';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from './database.service';
import * as serviceConstants from './database.service.constants';
import * as specConstants from './database.service.spec.constants';
chai.use(chaiAsPromised);

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;

    before(async () => {
        databaseService = new DatabaseService();
        mongoServer = await MongoMemoryServer.create();
    });

    after(async () => {
        if (databaseService['client']) {
            await databaseService['client'].close();
        }
        await mongoServer.stop();
    });

    it('should connect to the database when start is called', async () => {
        const mongoUri: string = mongoServer.getUri();
        await databaseService.start(mongoUri);
        expect(databaseService['client']).to.not.be.undefined;
        expect(databaseService['db'].databaseName).to.equal(serviceConstants.DATABASE_NAME);
    });

    it('should populate the classic scores database with a helper function', async () => {
        const mongoUri: string = mongoServer.getUri();
        const client: MongoClient = await MongoClient.connect(mongoUri, {});
        databaseService['db'] = client.db(serviceConstants.DATABASE_NAME);
        await databaseService.populateDB();
        const courses = await databaseService.database.collection(serviceConstants.DATABASE_COLLECTION_CLASSIC).find({}).toArray();
        expect(courses.length).to.equal(specConstants.MAX_NUMBER_PLAYERS);
    });

    it('should populate the log2990 scores database with a helper function', async () => {
        const mongoUri: string = mongoServer.getUri();
        const client: MongoClient = await MongoClient.connect(mongoUri, {});
        databaseService['db'] = client.db(serviceConstants.DATABASE_NAME);
        await databaseService.populateDB();
        const courses = await databaseService.database.collection('log2990Scores').find({}).toArray();
        expect(courses.length).to.equal(specConstants.MAX_NUMBER_PLAYERS);
    });

    it('should not populate the classic database with start function if it is already populated', async () => {
        const mongoUri = mongoServer.getUri();
        await databaseService.start(mongoUri);
        let courses = await databaseService.database.collection(serviceConstants.DATABASE_COLLECTION_CLASSIC).find({}).toArray();
        expect(courses.length).to.equal(specConstants.MAX_NUMBER_PLAYERS);
        await databaseService.closeConnection();
        await databaseService.start(mongoUri);
        courses = await databaseService.database.collection(serviceConstants.DATABASE_COLLECTION_CLASSIC).find({}).toArray();
        expect(courses.length).to.equal(specConstants.MAX_NUMBER_PLAYERS);
    });

    it('should not populate the log2290 database with start function if it is already populated', async () => {
        const mongoUri: string = mongoServer.getUri();
        await databaseService.start(mongoUri);
        let courses = await databaseService.database.collection(serviceConstants.DATABASE_COLLECTION_2990).find({}).toArray();
        expect(courses.length).to.equal(specConstants.MAX_NUMBER_PLAYERS);
        await databaseService.closeConnection();
        await databaseService.start(mongoUri);
        courses = await databaseService.database.collection(serviceConstants.DATABASE_COLLECTION_2990).find({}).toArray();
        expect(courses.length).to.equal(specConstants.MAX_NUMBER_PLAYERS);
    });

    it('resetDatabaseScores should set database with only default values', async () => {
        const mongoUri: string = mongoServer.getUri();
        await databaseService.start(mongoUri);
        await databaseService.resetDatabaseScores();
        const scores2990 = await databaseService.database.collection(serviceConstants.DATABASE_COLLECTION_2990).find({}).toArray();
        const scoresClassic = await databaseService.database.collection(serviceConstants.DATABASE_COLLECTION_CLASSIC).find({}).toArray();
        expect(scores2990.length).to.equal(scores2990.length);
        expect(scoresClassic.length).to.equal(scoresClassic.length);
    });

    it('should not connect to the database when start is called with wrong URL', async () => {
        databaseService = new DatabaseService();
        mongoServer = await MongoMemoryServer.create();
        try {
            await databaseService.start(specConstants.WRONG_URL);
            fail();
        } catch {
            expect(databaseService['client']).to.be.undefined;
        }
    });
});
