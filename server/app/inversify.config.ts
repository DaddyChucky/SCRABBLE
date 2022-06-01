import { Container } from 'inversify';
import { Application } from './app';
import { DatabaseController } from './controllers/database/database.controller';
import { DictionariesController } from './controllers/dictionaries/dictionaries.controller';
import { GamesLogsController } from './controllers/games-logs/games-logs.controller';
import { ScoresController } from './controllers/scores/scores.controller';
import { VPManagementController } from './controllers/vp-management/vp-management.controller';
import { Server } from './server';
import { DatabaseService } from './services/database/database.service';
import { GamesLogsService } from './services/games-logs/games-logs.service';
import { ScoresService } from './services/scores/scores.service';
import { VPManagementService } from './services/vp-management/vp-management.service';
import Types from './types';

const container: Container = new Container();

container.bind<Server>(Types.Server).to(Server);
container.bind<Application>(Types.Application).to(Application);
container.bind<ScoresController>(Types.ScoresController).to(ScoresController);
container.bind<GamesLogsController>(Types.GamesLogsController).to(GamesLogsController);
container.bind<DictionariesController>(Types.DictionariesController).to(DictionariesController);
container.bind<VPManagementService>(Types.VPManagementService).to(VPManagementService);
container.bind<VPManagementController>(Types.VPManagementController).to(VPManagementController);
container.bind<ScoresService>(Types.ScoresService).to(ScoresService);
container.bind<GamesLogsService>(Types.GamesLogsService).to(GamesLogsService).inSingletonScope();
container.bind<DatabaseController>(Types.DatabaseController).to(DatabaseController);
container.bind<DatabaseService>(Types.DatabaseService).to(DatabaseService).inSingletonScope();

export { container };
