/* eslint-disable dot-notation */
import { Application } from '@app/app';
import { container } from '@app/inversify.config';
import { DEFAULT_SCORES_CLASSIC, SCORE1 } from '@app/services/database/database.service.constants';
import { ScoresService } from '@app/services/scores/scores.service';
import { PLAYER_1 } from '@app/services/turn-manager/turn-manager.service.spec.constants';
import Types from '@app/types';
import * as chai from 'chai';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import * as specConstants from './scores.controller.spec.constants';

describe('ScoresController', () => {
    let scoresService: SinonStubbedInstance<ScoresService>;
    let expressApp: Express.Application;

    before(async () => {
        scoresService = createStubInstance(ScoresService);
        scoresService.getAllClassicScores.resolves(DEFAULT_SCORES_CLASSIC);
        scoresService.getAllLogScores.resolves(DEFAULT_SCORES_CLASSIC);
        scoresService.modifyScore.resolves();
        scoresService.getScore.resolves(SCORE1);
        scoresService.addPlayerScore.resolves();
        scoresService.getPlayerScore.resolves(SCORE1);
        scoresService.resetAllScores.resolves();
        const app = container.get<Application>(Types.Application);
        Object.defineProperty(app['scoresController'], 'scoresService', { value: scoresService });
        expressApp = app.app;
    });

    it('should return classic highest scores', async () => {
        return supertest(expressApp)
            .get('/scores/classic')
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal(DEFAULT_SCORES_CLASSIC);
            });
    });

    it('should return error on service error for classic highest scores', async () => {
        scoresService.getAllClassicScores.rejects(new Error('error'));
        return supertest(expressApp)
            .get('/scores/classic')
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('should return log highest scores', async () => {
        return supertest(expressApp)
            .get('/scores/log2990')
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal(DEFAULT_SCORES_CLASSIC);
            });
    });

    it('should return error on service error for log highest scores', async () => {
        scoresService.getAllLogScores.rejects(new Error());
        return supertest(expressApp)
            .get('/scores/log2990')
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should return a score pack if he is in classic database with a specific score', async () => {
        return supertest(expressApp)
            .get(`/scores/classic/${SCORE1.names[0]}/${SCORE1.score}`)
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal(SCORE1);
            });
    });

    it('should return a score pack if he is in LOG database with a specific score', async () => {
        return supertest(expressApp)
            .get(`/scores/log2990/${SCORE1.names[0]}/${SCORE1.score}`)
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal(SCORE1);
            });
    });

    it('should return a score pack if score exists in classic db', async () => {
        return supertest(expressApp)
            .get(`/scores/log2990/${SCORE1.score}`)
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal(SCORE1);
            });
    });

    it('should return a score pack if score exists in log db', async () => {
        return supertest(expressApp)
            .get(`/scores/classic/${SCORE1.score}`)
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal(SCORE1);
            });
    });

    it('should return null if score does not exists in classic db', async () => {
        scoresService.getScore.resolves(null);
        return supertest(expressApp)
            .get(`/scores/classic/${SCORE1.score}`)
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal(null);
            });
    });

    it('should return null if score does not exists in log db', async () => {
        scoresService.getScore.resolves(null);
        return supertest(expressApp)
            .get(`/scores/log2990/${SCORE1.score}`)
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal(null);
            });
    });

    it('should return null if player is not in classic database', async () => {
        scoresService.getPlayerScore.resolves(null);
        return supertest(expressApp)
            .get('/scores/classic/notarealplayer/123')
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal(null);
            });
    });

    it('should return null if player is not in log database', async () => {
        scoresService.getPlayerScore.resolves(null);
        return supertest(expressApp)
            .get('/scores/log2990/notarealplayer/123')
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal(null);
            });
    });

    it('should return error if he is in classic database with error thrown', async () => {
        scoresService.getPlayerScore.rejects(new Error());
        return supertest(expressApp)
            .get(`/scores/log2990/${SCORE1.names[0]}/${SCORE1.score}`)
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should return error if score is in classic database with error thrown', async () => {
        scoresService.getScore.rejects(new Error());
        return supertest(expressApp)
            .get(`/scores/classic/${SCORE1.score}`)
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should return error if score is in log database with error thrown', async () => {
        scoresService.getScore.rejects(new Error());
        return supertest(expressApp)
            .get(`/scores/log2990/${SCORE1.score}`)
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should return error if he is in log database with error thrown', async () => {
        scoresService.getPlayerScore.rejects(new Error());
        return supertest(expressApp)
            .get(`/scores/log2990/${SCORE1.names[0]}/${SCORE1.score}`)
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should post classic request a player', async () => {
        return supertest(expressApp).post('/scores/classic').send(PLAYER_1).set('Accept', 'application/json').expect(StatusCodes.CREATED);
    });

    it('should post log request a player', async () => {
        return supertest(expressApp).post('/scores/log2990').send(PLAYER_1).set('Accept', 'application/json').expect(StatusCodes.CREATED);
    });

    it('should give error when classic post a player if service error', async () => {
        scoresService.addPlayerScore.rejects(new Error());
        return supertest(expressApp).post('/scores/classic').send(PLAYER_1).set('Accept', 'application/json').expect(StatusCodes.NOT_FOUND);
    });

    it('should give error when log post a player if service error', async () => {
        scoresService.addPlayerScore.rejects(new Error());
        return supertest(expressApp).post('/scores/log2990').send(PLAYER_1).set('Accept', 'application/json').expect(StatusCodes.NOT_FOUND);
    });

    it('should send change request content of classic player', async () => {
        PLAYER_1.name = specConstants.TEST_NAME;
        return supertest(expressApp).patch('/scores/classic').send(PLAYER_1).set('Accept', 'application/json').expect(StatusCodes.OK);
    });

    it('should send change request content of log2990 player', async () => {
        PLAYER_1.name = specConstants.TEST_NAME;
        return supertest(expressApp).patch('/scores/log2990').send(PLAYER_1).set('Accept', 'application/json').expect(StatusCodes.OK);
    });

    it('should give error when patch a classic player if service error', async () => {
        scoresService.modifyScore.rejects(new Error());
        PLAYER_1.name = specConstants.TEST_NAME;
        return supertest(expressApp).patch('/scores/classic').send(PLAYER_1).set('Accept', 'application/json').expect(StatusCodes.NOT_FOUND);
    });

    it('should give error when patch a log player if service error', async () => {
        scoresService.modifyScore.rejects(new Error());
        PLAYER_1.name = specConstants.TEST_NAME;
        return supertest(expressApp).patch('/scores/log2990').send(PLAYER_1).set('Accept', 'application/json').expect(StatusCodes.NOT_FOUND);
    });

    it('should delete players', async () => {
        return supertest(expressApp).delete('/scores/').expect(StatusCodes.OK);
    });

    it('should return error for delete players', async () => {
        scoresService.resetAllScores.rejects(new Error());

        return supertest(expressApp).delete('/scores/').expect(StatusCodes.NOT_FOUND);
    });
});
