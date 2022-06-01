import { Application } from '@app/app';
import { DatabaseService } from '@app/services/database/database.service';
import { SocketManagementService } from '@app/services/socket-management/socket-management.service';
import Types from '@app/types';
import { BASE_TEN } from '@common/model/constants';
import * as http from 'http';
import { inject, injectable } from 'inversify';
import { AddressInfo } from 'net';

@injectable()
export class Server {
    private static readonly appPort: string | number | boolean = Server.normalizePort(process.env.PORT || '3000');
    private server: http.Server;
    private socketManager: SocketManagementService;

    constructor(
        @inject(Types.Application) private readonly application: Application,
        @inject(Types.DatabaseService) private databaseService: DatabaseService,
    ) {}

    private static normalizePort(val: number | string): number | string | boolean {
        const port: number = typeof val === 'string' ? parseInt(val, BASE_TEN) : val;
        if (isNaN(port)) return val;
        if (port >= 0) return port;
        return false;
    }
    async init(): Promise<void> {
        this.application.app.set('port', Server.appPort);
        this.server = http.createServer(this.application.app);
        this.socketManager = new SocketManagementService(this.server);
        this.socketManager.handleSockets();
        this.server.listen(Server.appPort);
        this.server.on('error', (error: NodeJS.ErrnoException) => this.onError(error));
        this.server.on('listening', () => this.onListening());
        try {
            await this.databaseService.start();
        } catch {
            process.exit(1);
        }
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const bind: string = typeof Server.appPort === 'string' ? 'Pipe ' + Server.appPort : 'Port ' + Server.appPort;
        switch (error.code) {
            case 'EACCES':
                // eslint-disable-next-line no-console
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                // eslint-disable-next-line no-console
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    private onListening(): void {
        const addr = this.server.address() as AddressInfo;
        const bind: string = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
        // eslint-disable-next-line no-console
        console.log(`Listening on ${bind}`);
    }
}
