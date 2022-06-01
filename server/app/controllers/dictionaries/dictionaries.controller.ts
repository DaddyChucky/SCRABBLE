/* eslint-disable no-unused-vars */
// oblig next arg
import { Dictionary } from '@common/model/dictionary';
import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import * as serviceConstants from './dictionaries.controller.constants';
@injectable()
export class DictionariesController {
    router: Router;

    constructor() {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
            try {
                const dicts: Dictionary[] = [];
                const filesNames = fs.readdirSync(serviceConstants.START_PATH);
                for (const fileName of filesNames) {
                    const dict: Dictionary = JSON.parse(fs.readFileSync(serviceConstants.START_PATH + fileName, serviceConstants.UTF_8));
                    dict.words = undefined;
                    dicts.push(dict);
                }
                res.json(dicts);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.get('/:name/', async (req: Request, res: Response, _next: NextFunction) => {
            try {
                const dict: Dictionary = JSON.parse(
                    fs.readFileSync(serviceConstants.START_PATH + req.params.name + serviceConstants.JSON_FORMAT, serviceConstants.UTF_8),
                );
                res.json(dict);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.post('/', async (req: Request, res: Response, _next: NextFunction) => {
            try {
                const uploadedDict: Dictionary = req.body as Dictionary;
                const path: string = serviceConstants.START_PATH + uploadedDict.title + serviceConstants.JSON_FORMAT;
                fs.writeFileSync(path, JSON.stringify(req.body));
                if (!fs.readFileSync(path, serviceConstants.UTF_8)) throw new Error();
                res.status(StatusCodes.CREATED).send();
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.patch('/:name', async (req: Request, res: Response, _next: NextFunction) => {
            try {
                const uploadedDict: Dictionary = req.body as Dictionary;
                const path: string = serviceConstants.START_PATH + req.params.name + serviceConstants.JSON_FORMAT;
                const newpath: string = serviceConstants.START_PATH + uploadedDict.title + serviceConstants.JSON_FORMAT;
                const data: Dictionary = JSON.parse(fs.readFileSync(path, { encoding: serviceConstants.UTF_8 }));
                data.title = uploadedDict.title;
                data.description = uploadedDict.description;
                fs.writeFileSync(path, JSON.stringify(data));
                fs.renameSync(path, newpath);
                res.status(StatusCodes.OK).send();
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.delete('/:name', async (req: Request, res: Response, _next: NextFunction) => {
            try {
                if (req.params.name === serviceConstants.DEFAULT) throw new Error();
                const path: string = serviceConstants.START_PATH + req.params.name + serviceConstants.JSON_FORMAT;
                fs.unlinkSync(path);
                res.status(StatusCodes.OK).send();
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.delete('/', async (req: Request, res: Response, _next: NextFunction) => {
            try {
                const filesNames: string[] = fs.readdirSync(serviceConstants.START_PATH);
                if (!filesNames.length) throw new Error();
                for (const fileName of filesNames) {
                    if (fileName === serviceConstants.DEFAULT_PATH) continue;
                    fs.unlinkSync(serviceConstants.START_PATH + fileName);
                }
                res.status(StatusCodes.OK).send();
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });
    }
}
