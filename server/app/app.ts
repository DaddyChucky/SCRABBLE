import { HttpException } from '@app/classes/http.exception';
import Types from '@app/types';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import * as logger from 'morgan';
import * as swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import { DatabaseController } from './controllers/database/database.controller';
import { DictionariesController } from './controllers/dictionaries/dictionaries.controller';
import { GamesLogsController } from './controllers/games-logs/games-logs.controller';
import { ScoresController } from './controllers/scores/scores.controller';
import { VPManagementController } from './controllers/vp-management/vp-management.controller';

@injectable()
export class Application {
    app: express.Application;
    private readonly internalError: number = StatusCodes.INTERNAL_SERVER_ERROR;
    private readonly swaggerOptions: swaggerJSDoc.Options;

    constructor(
        @inject(Types.ScoresController) private readonly scoresController: ScoresController,
        @inject(Types.DictionariesController) private readonly dictsController: DictionariesController,
        @inject(Types.GamesLogsController) private readonly logsController: GamesLogsController,
        @inject(Types.VPManagementController) private readonly vpController: VPManagementController,
        @inject(Types.DatabaseController) private readonly dbController: DatabaseController,
    ) {
        this.app = express();

        this.swaggerOptions = {
            swaggerDefinition: {
                openapi: '3.0.0',
                info: {
                    title: 'Cadriciel Serveur',
                    version: '1.0.0',
                },
            },
            apis: ['**/*.ts'],
        };

        this.config();
        this.bindRoutes();
        this.errorHandling();
    }

    bindRoutes(): void {
        this.app.use('/scores', this.scoresController.router);
        this.app.use('/dicts', this.dictsController.router);
        this.app.use('/logs', this.logsController.router);
        this.app.use('/vp', this.vpController.router);
        this.app.use('/admin', this.dbController.router);
        this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(this.swaggerOptions)));
        this.app.use('/', (req, res) => {
            res.redirect('/api/docs');
        });
    }

    private config(): void {
        this.app.use(logger('dev'));
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    private errorHandling(): void {
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: HttpException = new HttpException('Not Found', StatusCodes.NOT_FOUND);
            next(err);
        });

        if (this.app.get('env') === 'development') {
            this.app.use((err: HttpException, req: express.Request, res: express.Response) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        this.app.use((err: HttpException, req: express.Request, res: express.Response) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
