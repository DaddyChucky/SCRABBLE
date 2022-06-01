// eslint-disable-next-line @typescript-eslint/ban-types
type CallbackSignature = (params: unknown) => {};

export class SocketTestHelper {
    private callbacks = new Map<string, CallbackSignature[]>();

    on(event: string, callback: CallbackSignature): void {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []);
        }

        // @ts-ignore -- condition verified above, cannot be undefined
        this.callbacks.get(event).push(callback);
    }

    // eslint-disable-next-line no-unused-vars
    emit(_event: string, _data: string): void {
        return;
    }

    disconnect(): void {
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    peerSideEmit(event: string, data?: any) {
        if (!this.callbacks.has(event)) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        for (const callback of this.callbacks.get(event)!) {
            callback(data);
        }
    }
}
