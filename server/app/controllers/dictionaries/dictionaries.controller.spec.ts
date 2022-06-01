/* eslint-disable @typescript-eslint/no-require-imports */
import { Application } from '@app/app';
import { container } from '@app/inversify.config';
import Types from '@app/types';
import { Dictionary } from '@common/model/dictionary';
import { expect } from 'chai';
import * as fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import * as supertest from 'supertest';
import * as specConstants from './dictionaries.controller.spec.constants';
import Sinon = require('sinon');

describe('DictionariesController', () => {
    let expressApp: Express.Application;

    before(async () => {
        const app = container.get<Application>(Types.Application);
        expressApp = app.app;
    });

    afterEach(() => {
        Sinon.restore();
    });

    it('should return all dictionaries resume', async () => {
        Sinon.stub(fs, 'readFileSync').callsFake(() => {
            return JSON.stringify(specConstants.RESUME_FRENCH);
        });
        return supertest(expressApp)
            .get('/dicts/')
            .expect(StatusCodes.OK)
            .then((response) => {
                const dicts: Dictionary[] = response.body;
                expect(dicts.find((aDict) => aDict.title === specConstants.RESUME_FRENCH.title)).to.eql(specConstants.RESUME_FRENCH);
            });
    });

    it('should return error for dictionaries resume', async () => {
        Sinon.stub(fs, 'readFileSync').rejects(new Error());
        return supertest(expressApp)
            .get('/dicts/')
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should return a dictionary', async () => {
        Sinon.stub(fs, 'readFileSync').callsFake(() => {
            return JSON.stringify(specConstants.RESUME_FRENCH);
        });
        return supertest(expressApp)
            .get('/dicts/francais')
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal(specConstants.RESUME_FRENCH);
            });
    });

    it('should return error for dictionary', async () => {
        Sinon.stub(fs, 'readFileSync').rejects(new Error());
        return supertest(expressApp)
            .get('/dicts/francais')
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should post a dictionary', async () => {
        Sinon.stub(fs, 'writeFileSync').callsFake(() => {
            return;
        });
        Sinon.stub(fs, 'readFileSync').callsFake(() => {
            return JSON.stringify(specConstants.RESUME_FRENCH);
        });
        return supertest(expressApp).post('/dicts/').expect(StatusCodes.CREATED);
    });

    it('should return error for post a dictionary', async () => {
        Sinon.stub(fs, 'writeFileSync').callsFake(() => {
            return;
        });
        Sinon.stub(fs, 'readFileSync').callsFake(() => {
            return '';
        });
        return supertest(expressApp).post('/dicts/').expect(StatusCodes.NOT_FOUND);
    });

    it('should patch a dictionary', async () => {
        Sinon.stub(fs, 'readFileSync').callsFake(() => {
            return JSON.stringify(specConstants.RESUME_FRENCH);
        });
        Sinon.stub(fs, 'writeFileSync').callsFake(() => {
            return;
        });
        Sinon.stub(fs, 'renameSync').callsFake(() => {
            return;
        });
        return supertest(expressApp).patch('/dicts/francais').expect(StatusCodes.OK);
    });

    it('should return error for patch a dictionary', async () => {
        Sinon.stub(fs, 'readFileSync').callsFake(() => {
            return '';
        });
        Sinon.stub(fs, 'writeFileSync').callsFake(() => {
            return;
        });
        Sinon.stub(fs, 'renameSync').callsFake(() => {
            return;
        });
        return supertest(expressApp).patch('/dicts/francais').expect(StatusCodes.NOT_FOUND);
    });

    it('should delete a dictionary ', async () => {
        Sinon.stub(fs, 'unlinkSync').callsFake(() => {
            return;
        });
        return supertest(expressApp).delete('/dicts/fr').expect(StatusCodes.OK);
    });

    it('should throw error if delete default ', async () => {
        Sinon.stub(fs, 'unlinkSync').callsFake(() => {
            return;
        });
        return supertest(expressApp).delete('/dicts/francais').expect(StatusCodes.NOT_FOUND);
    });

    it('should delete all dictionary except default', async () => {
        Sinon.stub(fs, 'unlinkSync').callsFake(() => {
            return;
        });
        return supertest(expressApp).delete('/dicts/').expect(StatusCodes.OK);
    });

    it('should not continue for not default dict in delete all dictionary ', async () => {
        Sinon.stub(fs, 'unlinkSync').callsFake(() => {
            return;
        });
        Sinon.stub(fs, 'readdirSync').callsFake(() => {
            return [new fs.Dirent()];
        });
        return supertest(expressApp).delete('/dicts/').expect(StatusCodes.OK);
    });

    it('should return error for delete all dictionary except default', async () => {
        Sinon.stub(fs, 'unlinkSync').callsFake(() => {
            return;
        });
        Sinon.stub(fs, 'readdirSync').callsFake(() => {
            return [];
        });
        return supertest(expressApp).delete('/dicts/').expect(StatusCodes.NOT_FOUND);
    });
});
