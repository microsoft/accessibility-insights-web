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
    constructor(private mockAdbPath: string) {}

    private getOutputLogsDir(currentContext: string): string {
        return generateOutputLogsDir(this.mockAdbPath, currentContext);
    }

    public async getServerLog(currentContext: string): Promise<string> {
        const log = await readFile(generateServerLogPath(this.getOutputLogsDir(currentContext)));
        return log.toString();
    }

    public async getAdbLog(currentContext: string): Promise<string> {
        const log = await readFile(generateAdbLogPath(this.getOutputLogsDir(currentContext)));
        return log.toString();
    }

    public resetAdbLog(currentContext: string): void {
        fs.unlinkSync(generateAdbLogPath(this.getOutputLogsDir(currentContext)));
    }

    public resetServerLog(currentContext: string): void {
        fs.unlinkSync(generateServerLogPath(this.getOutputLogsDir(currentContext)));
    }

    public async waitForAdbLogToContain(
        contains: string,
        currentContext: string,
        client: SpectronAsyncClient,
    ) {
        const isLogReady = async () => (await this.getAdbLog(currentContext)).includes(contains);
        return client.waitUntil(isLogReady, { timeout: DEFAULT_WAIT_FOR_LOG_TIMEOUT_MS });
    }
}
