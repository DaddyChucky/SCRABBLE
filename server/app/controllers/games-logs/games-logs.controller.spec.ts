import { Application } from '@app/app';
import { container } from '@app/inversify.config';
import { GamesLogsService } from '@app/services/games-logs/games-logs.service';
import { GAME_LOG_ABANDONED } from '@app/services/games-logs/games-logs.service.spec.constants';
import Types from '@app/types';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import * as specConstants from './games-logs.controller.spec.constants';

describe('GamesLogController', () => {
    let gameLogService: SinonStubbedInstance<GamesLogsService>;
    let expressApp: Express.Application;

    before(async () => {
        gameLogService = createStubInstance(GamesLogsService);
        gameLogService.getAllLogs.resolves([GAME_LOG_ABANDONED]);
        gameLogService.resetLogs.resolves();
        const app = container.get<Application>(Types.Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['logsController'], 'logsService', { value: gameLogService });
        expressApp = app.app;
    });

    it('should return all Game Logs', async () => {
        return supertest(expressApp)
            .get(specConstants.LOG_LINK)
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal([GAME_LOG_ABANDONED]);
            });
    });

    it('should return error if service error for dictionaries resume', async () => {
        gameLogService.getAllLogs.rejects(new Error(specConstants.ERROR_STRING));

        return supertest(expressApp)
            .get(specConstants.LOG_LINK)
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should return all Game Logs', async () => {
        return supertest(expressApp)
            .delete(specConstants.LOG_LINK)
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should return error if service error for dictionaries resume', async () => {
        gameLogService.resetLogs.rejects(new Error(specConstants.ERROR_STRING));

        return supertest(expressApp)
            .delete(specConstants.LOG_LINK)
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                expect(response.body).to.deep.equal({});
            });
    });
});
