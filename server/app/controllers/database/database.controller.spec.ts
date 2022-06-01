import { Application } from '@app/app';
import { container } from '@app/inversify.config';
import { DatabaseService } from '@app/services/database/database.service';
import Types from '@app/types';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import * as controllerConstants from './database.controller.constants';

describe('DatabaseController', () => {
    let service: SinonStubbedInstance<DatabaseService>;
    let expressApp: Express.Application;

    before(async () => {
        service = createStubInstance(DatabaseService);
        service.resetDatabaseScores.resolves();
        const app = container.get<Application>(Types.Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['dbController'], 'databaseService', { value: service });
        expressApp = app.app;
    });

    it('should return success code for delete /admin/', async () => {
        return supertest(expressApp)
            .delete(controllerConstants.ADMIN_PATH)
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should return error on service error for resetDatabaseScores', async () => {
        service.resetDatabaseScores.rejects(new Error('error'));
        return supertest(expressApp)
            .delete(controllerConstants.ADMIN_PATH)
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                expect(response.body).to.deep.equal({});
            });
    });
});
