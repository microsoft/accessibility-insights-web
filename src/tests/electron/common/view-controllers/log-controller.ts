// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import * as util from 'util';
import { SpectronAsyncClient } from 'tests/electron/common/view-controllers/spectron-async-client';
import { DEFAULT_WAIT_FOR_LOG_TIMEOUT_MS } from 'tests/electron/setup/timeouts';
import {
    generateAdbLogPath,
    generateOutputLogsDir,
    generateServerLogPath,
} from '../../../miscellaneous/mock-adb/generate-log-paths';

const readFile = util.promisify(fs.readFile);

export class LogController {
    private adbLogPath: string;
    private serverLogPath: string;

    constructor(
        currentContext: string,
        private mockAdbPath: string,
        private client: SpectronAsyncClient,
    ) {
        this.adbLogPath = this.getAdbLogPath(currentContext);
        this.serverLogPath = this.getServerLogPath(currentContext);
    }

    private getOutputLogsDir(currentContext: string): string {
        return generateOutputLogsDir(this.mockAdbPath, currentContext);
    }

    private getServerLogPath(currentContext: string): string {
        return generateServerLogPath(this.getOutputLogsDir(currentContext));
    }

    private getAdbLogPath(currentContext: string): string {
        return generateAdbLogPath(this.getOutputLogsDir(currentContext));
    }

    public async getServerLog(): Promise<string> {
        const log = await readFile(this.serverLogPath);
        return log.toString();
    }

    public async getAdbLog(): Promise<string> {
        const log = await readFile(this.adbLogPath);
        return log.toString();
    }

    public resetAdbLog(): void {
        fs.unlinkSync(this.adbLogPath);
    }

    public resetServerLog(): void {
        fs.unlinkSync(this.serverLogPath);
    }

    private adbLogExists(): boolean {
        return fs.existsSync(this.adbLogPath);
    }

    public async waitForAdbLogToContain(contains: string) {
        const isLogReady = async () =>
            this.adbLogExists() && (await this.getAdbLog()).includes(contains);

        return this.client.waitUntil(isLogReady, { timeout: DEFAULT_WAIT_FOR_LOG_TIMEOUT_MS });
    }
}
