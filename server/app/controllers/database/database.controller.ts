/* eslint-disable no-unused-vars */
// oblig next arg
import { DatabaseService } from '@app/services/database/database.service';
import Types from '@app/types';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

@injectable()
export class DatabaseController {
    router: Router;

    constructor(@inject(Types.DatabaseService) private databaseService: DatabaseService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .resetDatabaseScores()
                .then(() => {
                    res.sendStatus(StatusCodes.OK);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }
}
