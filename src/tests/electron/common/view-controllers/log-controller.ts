// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import * as util from 'util';
import {
    generateAdbLogPath,
    generateOutputLogsDir,
    generateServerLogPath,
} from '../../../miscellaneous/mock-adb/generate-log-paths';
import { DEFAULT_WAIT_FOR_LOG_TIMEOUT_MS } from 'tests/electron/setup/timeouts';
import { tick } from 'tests/unit/common/tick';

const readFile = util.promisify(fs.readFile);
export class LogController {
    private adbLogPath: string;
    private serverLogPath: string;

    constructor(currentContext: string, private mockAdbPath: string) {
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

    private serverLogExists(): boolean {
        return fs.existsSync(this.adbLogPath);
    }

    public waitUntil = async (waitFunction): Promise<void> => {
        while (true) {
            const value = await waitFunction();
            if (value === true) {
                return;
            }
            await tick();
        }
    };

    public waitUntilWithOptions = async (waitFunction, args?, options?): Promise<void> => {
        const { timeout } = options ? options : { timeout: DEFAULT_WAIT_FOR_LOG_TIMEOUT_MS };
        const endTime = Number(new Date()) + timeout;
        while (true) {
            const value = args ? await waitFunction(...args) : await waitFunction();
            if (value === true) {
                return value;
            } else if (Number(new Date()) < endTime) {
                await tick();
                continue;
            } else {
                throw new Error('timed out');
            }
        }
    };

    public waitForAdbLogToExist = async () => {
        await this.waitUntil(this.adbLogExists.bind(this));
    };

    public waitForServerLogToExist = async () => {
        await this.waitUntil(this.serverLogExists.bind(this));
    };

    private waitForLogToContain = async (contains, log) => {
        return await this.waitUntilWithOptions((log, contains) => log.includes(contains), [
            log,
            contains,
        ]);
    };

    public waitForAdbLogToContain = async (contains: string) => {
        await this.waitForAdbLogToExist();
        await this.waitForLogToContain(contains, await this.getAdbLog());
    };

    public waitForServerLogToContain = async (contains: string) => {
        await this.waitForServerLogToExist();
        await this.waitForLogToContain(contains, await this.getServerLog());
    };
}
