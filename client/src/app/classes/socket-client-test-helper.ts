import { SocketClientService } from '@app/services/socket-client/socket-client.service';

export class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect(): void {}
}
