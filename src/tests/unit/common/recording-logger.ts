// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';

export type LogRecord = {
    level: 'error' | 'log';
    message?: string;
    optionalParams: any[];
    stack: string;
};

export class RecordingLogger implements Logger {
    public allRecords: LogRecord[] = [];
    public get allMessages() {
        return this.allRecords.map(r => r.message);
    }
    public get errorRecords() {
        return this.allRecords.filter(r => r.level === 'error');
    }
    public get errorMessages() {
        return this.errorRecords.map(r => r.message);
    }
    public get logRecords() {
        return this.allRecords.filter(r => r.level === 'log');
    }
    public get logMessages() {
        return this.logRecords.map(r => r.message);
    }

    private record(level: 'error' | 'log', message: string | undefined, optionalParams: any[]) {
        const stack = new Error().stack.split('\n').splice(2).join('\n');
        this.allRecords.push({ level, message, optionalParams, stack });
    }

    public log(message?: string, ...optionalParams: any[]) {
        this.record('log', message, optionalParams);
    }

    public error(message?: string, ...optionalParams: any[]) {
        this.record('error', message, optionalParams);
    }

    public verifyNoErrors() {
        expect(this.errorRecords).toStrictEqual([]);
    }
}
