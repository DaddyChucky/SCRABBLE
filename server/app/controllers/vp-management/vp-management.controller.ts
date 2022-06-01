/* eslint-disable no-unused-vars */
// oblig next arg
import { VPManagementService } from '@app/services/vp-management/vp-management.service';
import Types from '@app/types';
import { VirtualPlayerInfo } from '@common/model/virtual-player-info';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import * as serviceConstants from './vp-management.controller.constants';

@injectable()
export class VPManagementController {
    router: Router;

    constructor(@inject(Types.VPManagementService) private vpManager: VPManagementService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/:isBeginner', async (req: Request, res: Response, _next: NextFunction) => {
            try {
                const vPlayers: VirtualPlayerInfo[] = await this.vpManager.getAllVPlayers(req.params.isBeginner === serviceConstants.TRUE_STRING);
                res.json(vPlayers);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.post('/', async (req: Request, res: Response, _next: NextFunction) => {
            this.vpManager
                .addVPlayer(req.body)
                .then(() => {
                    res.status(StatusCodes.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.patch('/:name', async (req: Request, res: Response, _next: NextFunction) => {
            this.vpManager
                .modifyVPlayer(req.params.name, req.body)
                .then(() => {
                    res.sendStatus(StatusCodes.OK);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/:name', async (req: Request, res: Response, _next: NextFunction) => {
            this.vpManager
                .deleteVPlayer(req.params.name)
                .then(() => {
                    res.sendStatus(StatusCodes.OK);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/', async (req: Request, res: Response, _next: NextFunction) => {
            this.vpManager
                .resetAllVPlayers()
                .then(() => {
                    res.sendStatus(StatusCodes.OK);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }
}
