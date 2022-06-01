import { HttpException } from '@app/classes/http.exception';
import { DatabaseService } from '@app/services/database/database.service';
import { DATABASE_COLLECTION_VP } from '@app/services/database/database.service.constants';
import Types from '@app/types';
import { VirtualPlayerDifficulty } from '@common/model/virtual-player-difficulty';
import { VirtualPlayerInfo } from '@common/model/virtual-player-info';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Collection } from 'mongodb';
import 'reflect-metadata';

@injectable()
export class VPManagementService {
    constructor(@inject(Types.DatabaseService) private databaseService: DatabaseService) {}

    get collectionVPlayers(): Collection<VirtualPlayerInfo> {
        return this.databaseService.database.collection(DATABASE_COLLECTION_VP);
    }

    async randomName(playerName: string): Promise<string> {
        const allNames: VirtualPlayerInfo[] = await this.getAllVPlayers(true);
        let name;
        do {
            name = allNames[Math.floor(Math.random() * allNames.length)].name;
        } while (name === playerName);
        return name;
    }

    async getAllVPlayers(isBeginner: boolean): Promise<VirtualPlayerInfo[]> {
        const difficultyFilter: VirtualPlayerDifficulty = isBeginner ? VirtualPlayerDifficulty.BEGINNER : VirtualPlayerDifficulty.EXPERT;
        return this.collectionVPlayers
            .find({ difficulty: difficultyFilter }, { projection: { _id: 0 } })
            .toArray()
            .then((vPlayers: VirtualPlayerInfo[]) => {
                return vPlayers;
            });
    }

    async addVPlayer(player: VirtualPlayerInfo): Promise<void> {
        await this.collectionVPlayers.insertOne(player).catch(() => {
            throw new HttpException('Failed to insert virtual player ', StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }

    async modifyVPlayer(playerName: string, player: VirtualPlayerInfo): Promise<void> {
        const filterQuery = { name: playerName };
        const updateQuery = {
            $set: { name: player.name, difficulty: player.difficulty, default: player.default },
        };

        return (
            this.collectionVPlayers
                .updateOne(filterQuery, updateQuery)
                // eslint-disable-next-line @typescript-eslint/no-empty-function -- obligatory arrow fct
                .then(() => {})
                .catch(() => {
                    throw new Error('Failed to update virtual player');
                })
        );
    }

    async deleteVPlayer(playerName: string): Promise<void> {
        const filterQuery = { name: playerName };
        return (
            this.collectionVPlayers
                .deleteOne(filterQuery)
                // eslint-disable-next-line @typescript-eslint/no-empty-function -- obligatory arrow fct
                .then(() => {})
                .catch(() => {
                    throw new Error('Failed to delete virtual player');
                })
        );
    }

    async resetAllVPlayers(): Promise<void> {
        await this.collectionVPlayers.deleteMany({});
        await this.databaseService.setDefaultVirtualPlayers();
    }
}
