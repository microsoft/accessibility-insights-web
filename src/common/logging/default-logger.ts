// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from './logger';

export const createDefaultLogger = (): Logger => {
    return {
        log: console.log,
        // Note that this can be altered later by ExceptionTelemetryListener, so it's functionally
        // important for this to remain a direct reference to console.error.
        error: console.error,
    };
};
