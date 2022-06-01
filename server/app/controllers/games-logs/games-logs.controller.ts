/* eslint-disable no-unused-vars */
// In router.get or delete, we need the arg req and next to declare the function, but we don't need to use them
import { GamesLogsService } from '@app/services/games-logs/games-logs.service';
import Types from '@app/types';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

@injectable()
export class GamesLogsController {
    router: Router;

    constructor(@inject(Types.GamesLogsService) private logsService: GamesLogsService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
            try {
                res.json(await this.logsService.getAllLogs());
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.delete('/', async (_req: Request, res: Response, _next: NextFunction) => {
            this.logsService
                .resetLogs()
                .then(() => {
                    res.sendStatus(StatusCodes.OK);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }
}
