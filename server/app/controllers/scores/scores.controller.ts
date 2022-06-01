/* eslint-disable no-unused-vars */
// oblig next arg
import { ScoresService } from '@app/services/scores/scores.service';
import Types from '@app/types';
import { ScorePack } from '@common/model/score-pack';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import * as serviceConstants from './scores.controller.constants';

@injectable()
export class ScoresController {
    router: Router;

    constructor(@inject(Types.ScoresService) private scoresService: ScoresService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/:mode', async (req: Request, res: Response, _next: NextFunction) => {
            try {
                let scores: ScorePack[];
                if (req.params.mode === serviceConstants.CLASSIC_MODE) {
                    scores = await this.scoresService.getAllClassicScores();
                } else {
                    scores = await this.scoresService.getAllLogScores();
                }
                res.json(scores);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.get('/:mode/:name/:score', async (req: Request, res: Response, _next: NextFunction) => {
            try {
                const isClassic = req.params.mode === serviceConstants.CLASSIC_MODE;
                const scorePack = await this.scoresService.getPlayerScore(
                    req.params.name,
                    parseInt(req.params.score, serviceConstants.BASE_DECIMALE),
                    isClassic,
                );
                res.json(scorePack);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.get('/:mode/:score', async (req: Request, res: Response, _next: NextFunction) => {
            try {
                const isClassic = req.params.mode === serviceConstants.CLASSIC_MODE;
                const scorePack = await this.scoresService.getScore(parseInt(req.params.score, serviceConstants.BASE_DECIMALE), isClassic);
                res.json(scorePack);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.post('/:mode', async (req: Request, res: Response, _next: NextFunction) => {
            const isClassic = req.params.mode === serviceConstants.CLASSIC_MODE;
            this.scoresService
                .addPlayerScore(req.body, isClassic)
                .then(() => {
                    res.status(StatusCodes.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.patch('/:mode', async (req: Request, res: Response, _next: NextFunction) => {
            const isClassic = req.params.mode === serviceConstants.CLASSIC_MODE;
            this.scoresService
                .modifyScore(req.body, isClassic)
                .then(() => {
                    res.sendStatus(StatusCodes.OK);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/', async (req: Request, res: Response, _next: NextFunction) => {
            this.scoresService
                .resetAllScores()
                .then(() => {
                    res.sendStatus(StatusCodes.OK);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }
}
