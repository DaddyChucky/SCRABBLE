import { ScorePack } from '@common/model/score-pack';
import { injectable } from 'inversify';
import { Db, MongoClient } from 'mongodb';
import 'reflect-metadata';
import * as serviceConstants from './database.service.constants';

@injectable()
export class DatabaseService {
    private db: Db;
    private client: MongoClient;

    async start(url: string = serviceConstants.DATABASE_URL): Promise<MongoClient | null> {
        try {
            const client: MongoClient = await MongoClient.connect(url, {});
            this.client = client;
            this.db = client.db(serviceConstants.DATABASE_NAME);
        } catch {
            throw new Error('Database connection error');
        }
        await this.populateDB();
        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async populateDB(): Promise<void> {
        await this.setDefaultScores();
        await this.setDefaultVirtualPlayers();
        await this.setDefaultLogs();
    }

    async resetDatabaseScores(): Promise<void> {
        await this.db.collection(serviceConstants.DATABASE_COLLECTION_CLASSIC).deleteMany({});
        await this.db.collection(serviceConstants.DATABASE_COLLECTION_2990).deleteMany({});
        await this.setDefaultScores();
    }

    async setDefaultScores(): Promise<void> {
        this.setDefaultScoresForSpecificMode(serviceConstants.DATABASE_COLLECTION_CLASSIC, serviceConstants.DEFAULT_SCORES_CLASSIC);
        this.setDefaultScoresForSpecificMode(serviceConstants.DATABASE_COLLECTION_2990, serviceConstants.DEFAULT_SCORES_LOG2990);
    }

    async setDefaultScoresForSpecificMode(databaseCollection: string, scores: ScorePack[]): Promise<void> {
        const isEmptyCollection: boolean = (await this.db.collection(databaseCollection).countDocuments()) === 0;
        if (isEmptyCollection) for (const score of scores) await this.db.collection(databaseCollection).insertOne(score);
    }

    async setDefaultLogs(): Promise<void> {
        if (!(await this.db.collection(serviceConstants.DATABASE_COLLECTION_GAMES_LOGS).countDocuments())) {
            await this.db.collection(serviceConstants.DATABASE_COLLECTION_GAMES_LOGS).insertOne(serviceConstants.DEFAULT_GAME_LOG);
        }
    }

    async setDefaultVirtualPlayers(): Promise<void> {
        if ((await this.db.collection(serviceConstants.DATABASE_COLLECTION_VP).countDocuments()) === 0) {
            await this.db.collection(serviceConstants.DATABASE_COLLECTION_VP).insertMany(serviceConstants.DEFAULT_BEGINNER_PLAYERS);
            await this.db.collection(serviceConstants.DATABASE_COLLECTION_VP).insertMany(serviceConstants.DEFAULT_EXPERT_PLAYERS);
        }
    }

    get database(): Db {
        return this.db;
    }
}
