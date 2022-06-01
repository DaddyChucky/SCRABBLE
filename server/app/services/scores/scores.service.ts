import { HttpException } from '@app/classes/http.exception';
import { DatabaseService } from '@app/services/database/database.service';
import { DATABASE_COLLECTION_2990, DATABASE_COLLECTION_CLASSIC } from '@app/services/database/database.service.constants';
import { MAX_NUMBER_PLAYERS } from '@app/services/database/database.service.spec.constants';
import Types from '@app/types';
import { Player } from '@common/model/player';
import { ScorePack } from '@common/model/score-pack';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Collection } from 'mongodb';
import 'reflect-metadata';

@injectable()
export class ScoresService {
    constructor(@inject(Types.DatabaseService) private databaseService: DatabaseService) {}

    get collectionLog2990(): Collection<ScorePack> {
        return this.databaseService.database.collection(DATABASE_COLLECTION_2990);
    }

    get collectionClassic(): Collection<ScorePack> {
        return this.databaseService.database.collection(DATABASE_COLLECTION_CLASSIC);
    }

    async getAllClassicScores(): Promise<ScorePack[]> {
        return this.collectionClassic
            .find({}, { projection: { _id: 0 } })
            .sort({ score: -1 })
            .limit(MAX_NUMBER_PLAYERS)
            .toArray()
            .then((scores: ScorePack[]) => {
                return scores;
            });
    }

    async getAllLogScores(): Promise<ScorePack[]> {
        return this.collectionLog2990
            .find({}, { projection: { _id: 0 } })
            .sort({ score: -1 })
            .limit(MAX_NUMBER_PLAYERS)
            .toArray()
            .then((scores: ScorePack[]) => {
                return scores;
            });
    }

    async addPlayerScore(player: Player, isClassic: boolean = true): Promise<void> {
        const collection: Collection<ScorePack> = isClassic ? this.collectionClassic : this.collectionLog2990;
        const scorePack = { names: [player.name], score: player.score } as ScorePack;
        await collection.insertOne(scorePack).catch(() => {
            throw new HttpException('Failed to insert player score', StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }

    async getPlayerScore(playerName: string, playerScore: number, isClassic: boolean = true): Promise<ScorePack | null> {
        const collection: Collection<ScorePack> = isClassic ? this.collectionClassic : this.collectionLog2990;
        const filterQuery = { score: playerScore, names: { $elemMatch: { $eq: playerName } } };
        const projection = { projection: { _id: 0 } };
        return collection
            .findOne(filterQuery, projection)
            .then((scorePack: ScorePack | null) => {
                return scorePack;
            })
            .catch(() => {
                throw new Error('Failed to get player score');
            });
    }

    async getScore(aScore: number, isClassic: boolean = true): Promise<ScorePack | null> {
        const collection: Collection<ScorePack> = isClassic ? this.collectionClassic : this.collectionLog2990;
        const filterQuery = { score: aScore };
        const projection = { projection: { _id: 0 } };
        return collection
            .findOne(filterQuery, projection)
            .then((scorePack: ScorePack | null) => {
                return scorePack;
            })
            .catch(() => {
                throw new Error('Failed to get score');
            });
    }

    async modifyScore(player: Player, isClassic: boolean = true): Promise<void> {
        const collection: Collection<ScorePack> = isClassic ? this.collectionClassic : this.collectionLog2990;
        const filterQuery = { score: player.score };
        const updateQuery = {
            $push: { names: player.name },
        };
        return (
            collection
                .updateOne(filterQuery, updateQuery)
                // eslint-disable-next-line @typescript-eslint/no-empty-function -- obligatory arrow fct
                .then(() => {})
                .catch(() => {
                    throw new Error('Failed to update log player info');
                })
        );
    }

    async resetAllScores(): Promise<void> {
        await this.collectionClassic.deleteMany({});
        await this.collectionLog2990.deleteMany({});
        await this.databaseService.setDefaultScores();
    }
}
