// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as child_process from 'child_process';
import { Socket } from 'net';
import axios from 'axios';
import Protocol from 'devtools-protocol';
import * as CDP from 'chrome-remote-interface';

/* example:
    +     "description": "",
    +     "devtoolsFrontendUrl": "/devtools/inspector.html?ws=localhost:10156/devtools/page/1686CE1B19D91054826B05D29B3946DB",
    +     "id": "1686CE1B19D91054826B05D29B3946DB",
    +     "title": "Accessibility Insights for Android - Connect to your Android device",
    +     "type": "page",
    +     "url": "file:///C:/Users/danielbj/AppData/Local/Programs/Accessibility%20Insights%20for%20Android/resources/app.asar/product/ele
ctron/views/index.html",
    +     "webSocketDebuggerUrl": "ws://localhost:10156/devtools/page/1686CE1B19D91054826B05D29B3946DB",
*/
export type CDPWindowProps = {
    description: string;
    devtoolsFrontendUrl: string;
    id: string;
    title: string;
    type: string; // 'page' | ?
    url: string;
    webSocketDebuggerUrl: string;
};

export class CDPWindow {
    private cdpClient: CDP;

    constructor(private readonly props: CDPWindowProps) {}

    private async waitForOpen(): Promise<void> {
        if (this.cdpClient == null) {
            this.cdpClient = await CDP({ port: 10156 });
        }
    }

    public async evaluate(
        request: Protocol.Runtime.EvaluateRequest,
    ): Promise<Protocol.Runtime.RemoteObject> {
        await this.waitForOpen();
        const response = await this.cdpClient.Runtime.evaluate(request);
        return response.result;
    }
}

export class ProcessInjector {
    private targetPort = 10156;

    constructor(private readonly targetBinary?: string) {}

    public createProcess() {
        // This is already vulnerable to shell injection, never ship this!
        const targetProcess = child_process.spawn(this.targetBinary, [
            `--remote-debugging-port=${this.targetPort}`,
        ]);
        return targetProcess;
    }

    public isCDPAvailable(): boolean {
        const socket = new Socket();
        try {
            socket.connect({ port: this.targetPort });
            return true;
        } catch (error) {
            return false;
        } finally {
            socket.destroy();
        }
    }

    public async listWindows(): Promise<CDPWindow[]> {
        const unixEpochTimestamp = Date.now();
        const response = await axios.get(
            `http://localhost:${this.targetPort}/json/list?t=${unixEpochTimestamp}`,
        );
        return response.data.map(windowProps => new CDPWindow(windowProps));
    }

    private async waitForTime(milliseconds: number): Promise<void> {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }

    public async launchUnderDebugger(): Promise<CDPWindow[]> {
        if (this.targetBinary !== undefined) {
            const process = this.createProcess();
        }
        for (let tryIndex = 1; tryIndex < 10; tryIndex += 1) {
            if (this.isCDPAvailable()) {
                break;
            }
            await this.waitForTime(1000);
        }

        return await this.listWindows();
    }
}
