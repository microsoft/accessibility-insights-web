import { Logger } from './logger';

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export const createDefaultLogger = (): Logger => {
    return {
        // It's important that these use the console functions directly rather than wrapping them
        // because it ensures that the file/line numbers reported in the devtools console point to
        // the lines that are actually responsible for emitting log/error calls, rather than always
        // pointing to a generic wrapping function.
        log: console.log,
        error: console.error,
    };
};
