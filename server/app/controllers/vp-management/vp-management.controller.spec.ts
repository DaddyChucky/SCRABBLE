import { Application } from '@app/app';
import { container } from '@app/inversify.config';
import { VPManagementService } from '@app/services/vp-management/vp-management.service';
import Types from '@app/types';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import * as specConstants from './vp-management.controller.spec.constants';

describe('VPManagementController', () => {
    let vpService: SinonStubbedInstance<VPManagementService>;
    let expressApp: Express.Application;

    before(async () => {
        vpService = createStubInstance(VPManagementService);
        vpService.getAllVPlayers.resolves([]);
        vpService.addVPlayer.resolves();
        vpService.deleteVPlayer.resolves();
        vpService.modifyVPlayer.resolves();
        vpService.resetAllVPlayers.resolves();
        const app = container.get<Application>(Types.Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['vpController'], 'vpManager', { value: vpService });
        expressApp = app.app;
    });

    it('should return beginner players', async () => {
        return supertest(expressApp)
            .get('/vp/true')
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal([]);
            });
    });

    it('should return error if service error for players get', async () => {
        vpService.getAllVPlayers.rejects(new Error('error'));

        return supertest(expressApp)
            .get('/vp/true')
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should post a player', async () => {
        return supertest(expressApp).post('/vp/').send(specConstants.TEST_VP).set('Accept', 'application/json').expect(StatusCodes.CREATED);
    });

    it('should return error if service error for post', async () => {
        vpService.addVPlayer.rejects(new Error());
        return supertest(expressApp).post('/vp/').send(specConstants.TEST_VP).set('Accept', 'application/json').expect(StatusCodes.NOT_FOUND);
    });

    it('should modify a player', async () => {
        return supertest(expressApp).patch('/vp/ppman').send(specConstants.TEST_VP).set('Accept', 'application/json').expect(StatusCodes.OK);
    });

    it('should return error if service error for patch', async () => {
        vpService.modifyVPlayer.rejects(new Error());
        return supertest(expressApp).patch('/vp/ppman').send(specConstants.TEST_VP).set('Accept', 'application/json').expect(StatusCodes.NOT_FOUND);
    });

    it('should delete a player', async () => {
        return supertest(expressApp).delete('/vp/ppman').set('Accept', 'application/json').expect(StatusCodes.OK);
    });

    it('should return error if service error for delete', async () => {
        vpService.deleteVPlayer.rejects(new Error());
        return supertest(expressApp).delete('/vp/ppman').set('Accept', 'application/json').expect(StatusCodes.NOT_FOUND);
    });

    it('should delete all players', async () => {
        return supertest(expressApp).delete('/vp/').set('Accept', 'application/json').expect(StatusCodes.OK);
    });

    it('should return error if service error for delete', async () => {
        vpService.resetAllVPlayers.rejects(new Error());
        return supertest(expressApp).delete('/vp/').set('Accept', 'application/json').expect(StatusCodes.NOT_FOUND);
    });
});
