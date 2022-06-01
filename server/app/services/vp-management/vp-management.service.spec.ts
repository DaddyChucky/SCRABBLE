/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable dot-notation */
import { DatabaseServiceMock } from '@app/classes/database.service.mock';
import { VirtualPlayerDifficulty } from '@common/model/virtual-player-difficulty';
import { VirtualPlayerInfo } from '@common/model/virtual-player-info';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import { VPManagementService } from './vp-management.service';
import * as specConstants from './vp-management.service.spec.constants';
import Sinon = require('sinon');
chai.use(chaiAsPromised);

describe('VPManagerService', () => {
    let vpService: VPManagementService;
    let client: MongoClient;
    const databaseService: DatabaseServiceMock = new DatabaseServiceMock();

    const staticBeginnerVPlayer: VirtualPlayerInfo = {
        name: 'ppman',
        difficulty: VirtualPlayerDifficulty.BEGINNER,
        default: false,
    } as VirtualPlayerInfo;
    const staticExpertVPlayer: VirtualPlayerInfo = {
        name: 'ppman2',
        difficulty: VirtualPlayerDifficulty.EXPERT,
        default: false,
    } as VirtualPlayerInfo;

    beforeEach(async () => {
        client = (await databaseService.start()) as MongoClient;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- db usage
        vpService = new VPManagementService(databaseService as any);
        await vpService.collectionVPlayers.deleteMany({});
        await vpService.collectionVPlayers.insertOne(specConstants.TEST_VP_BEGINNER);
        await vpService.collectionVPlayers.insertOne(specConstants.TEST_VP_EXPERT);
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should get all beginner players from DB', async () => {
        const players: VirtualPlayerInfo[] = await vpService.getAllVPlayers(true);
        expect(players.length).to.equal(1);
        expect(players[0]).to.deep.equals(staticBeginnerVPlayer);
    });

    it('should get all expert players from DB', async () => {
        const players: VirtualPlayerInfo[] = await vpService.getAllVPlayers(false);
        expect(players.length).to.equal(1);
        expect(players[0]).to.deep.equals(staticExpertVPlayer);
    });

    it('should return a name in collection different of the name in param', async () => {
        await vpService.addVPlayer(specConstants.TEST_VP_4);
        const name: string = await vpService.randomName(specConstants.TEST_VP_BEGINNER.name);
        expect(name).to.equal(specConstants.TEST_VP_4.name);
    });

    it('should insert a new player', async () => {
        await vpService.addVPlayer(specConstants.TEST_VP_3);
        const players = await vpService.collectionVPlayers.find({}).toArray();
        expect(players.length).to.equal(3);
        expect(players.find((p) => p.name === specConstants.TEST_VP_3.name)?.name).to.deep.equals(specConstants.TEST_VP_3.name);
    });

    it('should modify an existing player', async () => {
        await vpService.modifyVPlayer(specConstants.TEST_VP_EXPERT.name, specConstants.TEST_VP_EXPERT);
        const players = await vpService.collectionVPlayers.find({}).toArray();
        expect(players.length).to.equal(2);
        expect(players.find((p) => p.name === specConstants.TEST_VP_EXPERT.name)?.name).to.deep.equals(specConstants.TEST_VP_EXPERT.name);
    });

    it('should delete an existing player', async () => {
        await vpService.deleteVPlayer(specConstants.TEST_VP_3.name);
        const players = await vpService.collectionVPlayers.find({}).toArray();
        expect(players.length).to.equal(2);
        expect(players.find((p) => p.name === specConstants.TEST_VP_3.name)?.name).to.deep.equals(undefined);
    });

    it('should call db populate', async () => {
        const spy: Sinon.SinonStub<[], Promise<void>> = Sinon.stub(vpService['databaseService'], 'setDefaultVirtualPlayers').callsFake(async () => {
            return;
        });
        await vpService.resetAllVPlayers();
        expect(spy.calledOnce);
    });

    it('should throw an error if we try to get all players on a closed connection', async () => {
        await client.close();
        await client.connect();
        expect(vpService.getAllVPlayers(true)).to.eventually.be.rejectedWith(Error);
    });

    it('should throw an error if we try to add players on a closed connection', async () => {
        await client.close();
        await client.connect();
        expect(vpService.addVPlayer({} as VirtualPlayerInfo)).to.eventually.be.rejectedWith(Error);
    });

    it('should throw an error if we try to modify players on a closed connection', async () => {
        await client.close();
        await client.connect();
        expect(vpService.modifyVPlayer('', {} as VirtualPlayerInfo)).to.eventually.be.rejectedWith(Error);
    });

    it('should throw an error if we try to delete players on a closed connection', async () => {
        await client.close();
        await client.connect();
        expect(vpService.deleteVPlayer('')).to.eventually.be.rejectedWith(Error);
    });
});
