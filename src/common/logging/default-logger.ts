// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from './logger';

export const createDefaultLogger = (): Logger => {
    return {
        log: console.log,
        error: console.error,
    };
};
