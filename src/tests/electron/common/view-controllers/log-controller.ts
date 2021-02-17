// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import {
    generateAdbLogPath,
    generateOutputLogsDir,
    generateServerLogPath,
} from '../../../miscellaneous/mock-adb/generate-log-paths';

export class LogController {
    constructor(private mockAdbPath: string) {}

    private getOutputLogsDir(currentContext: string): string {
        return generateOutputLogsDir(this.mockAdbPath, currentContext);
    }

    public getServerLog(currentContext: string): string {
        return fs
            .readFileSync(generateServerLogPath(this.getOutputLogsDir(currentContext)))
            .toString();
    }

    public getAdbLog(currentContext: string): string {
        return fs
            .readFileSync(generateAdbLogPath(this.getOutputLogsDir(currentContext)))
            .toString();
    }

    public resetAdbLog(currentContext: string): void {
        fs.unlinkSync(generateAdbLogPath(this.getOutputLogsDir(currentContext)));
    }

    public resetServerLog(currentContext: string): void {
        fs.unlinkSync(generateServerLogPath(this.getOutputLogsDir(currentContext)));
    }
}
