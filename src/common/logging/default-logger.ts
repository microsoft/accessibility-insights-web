// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import { Logger } from './logger';

export const createDefaultLogger = (): Logger => {
    return {
        log: (message, ...params) =>
            fs.writeFileSync('drop/mock-adb/logs.txt', message + JSON.stringify(params), {
                flag: 'a',
            }),
        error: (message, ...params) =>
            fs.writeFileSync('drop/mock-adb/logs.txt', message + JSON.stringify(params), {
                flag: 'a',
            }),
    };
};
