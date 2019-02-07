import { Logger } from './logger';

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export const createDefaultLogger = (): Logger => {
    return {
        log: (message?: any, ...otherArgs: any[]) => console.log(message, ...otherArgs),
        error: (message?: any, ...otherArgs: any[]) => console.error(message, ...otherArgs),
    };
};
