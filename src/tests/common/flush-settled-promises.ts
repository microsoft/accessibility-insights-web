// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Helper function returns a promise that resolves after all other promise mocks,
// even if they are chained like Promise.resolve().then(...)
// Technically: this is designed to resolve on the next macro-task
export const flushSettledPromises = (): Promise<void> => {
    return new Promise((resolve: () => void) => {
        setTimeout(resolve, 0);
    });
};
