import { DATABASE_NAME } from '@app/services/database/database.service.constants';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

export class DatabaseServiceMock {
    mongoServer: MongoMemoryServer;
    private db: Db;
    private client: MongoClient;

    async start(): Promise<MongoClient | null> {
        if (!this.client) {
            this.mongoServer = await MongoMemoryServer.create();
            await this.mongoServer.ensureInstance();
            const mongoUri = this.mongoServer.getUri();
            this.client = await MongoClient.connect(mongoUri, {});
            this.db = this.client.db(DATABASE_NAME);
        } else {
            this.client.connect();
        }

        return this.client;
    }

    async setDefaultScores(): Promise<void> {
        return;
    }

    async setDefaultVirtualPlayers(): Promise<void> {
        return;
    }
    async closeConnection(): Promise<void> {
        return this.client ? this.client.close() : Promise.resolve();
    }

    get database(): Db {
        return this.db;
    }
}
