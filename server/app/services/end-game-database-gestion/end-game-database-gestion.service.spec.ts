import { DatabaseService } from '@app/services/database/database.service';
import { ScoresService } from '@app/services/scores/scores.service';
import { expect } from 'chai';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { EndGameDatabaseGestion } from './end-game-database-gestion.service';
import * as serviceConstants from './end-game-database-gestion.service.constants';
import * as specConstants from './end-game-database-gestion.service.spec.constants';

describe('EndGameDatabaseGestion', () => {
    let service: EndGameDatabaseGestion;
    let scoresServiceStub: SinonStubbedInstance<ScoresService>;

    beforeEach(async () => {
        scoresServiceStub = createStubInstance(ScoresService);
        scoresServiceStub.getAllClassicScores.resolves(specConstants.FICTIVE_SCORES);
        scoresServiceStub.getAllLogScores.resolves(specConstants.FICTIVE_SCORES);
        scoresServiceStub.getScore.resolves(specConstants.SCORE1);
        scoresServiceStub.modifyScore.resolves();
        scoresServiceStub.addPlayerScore.resolves();
        scoresServiceStub.getPlayerScore.resolves(specConstants.SCORE1);

        service = new EndGameDatabaseGestion(new ScoresService(new DatabaseService()));
        Object.defineProperty(service, 'scoresService', { value: scoresServiceStub });
    });

    it('should call getPlayerScore if score ', async () => {
        scoresServiceStub.getScore.resolves(specConstants.SCORE1);
        await service.sendScores(specConstants.EXPECTED_LOBBY);
        expect(scoresServiceStub.getPlayerScore.calledOnce);
        expect(
            scoresServiceStub.getPlayerScore.calledWith(
                specConstants.EXPECTED_LOBBY.playerList[0].name,
                specConstants.EXPECTED_LOBBY.playerList[0].score,
                true,
            ),
        );
    });

    it('should not call getPlayerScore if !score', async () => {
        scoresServiceStub.getScore.resolves(null);
        await service.sendScores(specConstants.EXPECTED_LOBBY);
        expect(scoresServiceStub.getScore.called);
        expect(scoresServiceStub.getPlayerScore.notCalled);
    });

    it('should call addPlayerScore if !score ', async () => {
        scoresServiceStub.getScore.resolves(null);
        await service.sendScores(specConstants.EXPECTED_LOBBY);
        expect(scoresServiceStub.getScore.called);
        expect(scoresServiceStub.getPlayerScore.notCalled);
        expect(scoresServiceStub.modifyScore.notCalled);
        expect(scoresServiceStub.addPlayerScore.callCount).to.eql(1);
    });

    it('should call nothing if a virtual player', async () => {
        specConstants.EXPECTED_LOBBY.playerList[0].playerId = serviceConstants.VP_TEST_NAME;
        await service.sendScores(specConstants.EXPECTED_LOBBY);
        expect(scoresServiceStub.getScore.notCalled);
        expect(scoresServiceStub.getPlayerScore.notCalled);
        expect(scoresServiceStub.modifyScore.notCalled);
        expect(scoresServiceStub.addPlayerScore.notCalled);
    });

    it('should not call modify or addPlayer if score && name ', async () => {
        scoresServiceStub.getScore.resolves(specConstants.SCORE1);
        scoresServiceStub.getPlayerScore.resolves(specConstants.SCORE1);
        await service.sendScores(specConstants.EXPECTED_LOBBY);
        expect(scoresServiceStub.getScore.called);
        expect(scoresServiceStub.getPlayerScore.called);
        expect(scoresServiceStub.modifyScore.notCalled);
        expect(scoresServiceStub.addPlayerScore.notCalled);
    });

    it('should call modifyScore if score && !name ', async () => {
        scoresServiceStub.getScore.resolves(specConstants.SCORE1);
        scoresServiceStub.getPlayerScore.resolves(null);
        await service.sendScores(specConstants.EXPECTED_LOBBY);
        expect(scoresServiceStub.getScore.called);
        expect(scoresServiceStub.getPlayerScore.called);
        expect(scoresServiceStub.modifyScore.called);
        expect(scoresServiceStub.addPlayerScore.notCalled);
    });

    it('should call addPlayerScore if !score && !name ', async () => {
        scoresServiceStub.getScore.resolves(specConstants.SCORE1);
        scoresServiceStub.getPlayerScore.resolves(null);
        await service.sendScores(specConstants.EXPECTED_LOBBY);
        expect(scoresServiceStub.getScore.called);
        expect(scoresServiceStub.getPlayerScore.notCalled);
        expect(scoresServiceStub.modifyScore.notCalled);
        expect(scoresServiceStub.addPlayerScore.called);
    });
});
