// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { serializeError } from 'tests/common/serialize-error';

export type RetryOptions = {
    operationLabel?: string;
    retryOnlyIfMatches?: (e: any) => boolean;
    maxRetries?: number;
    warnOnRetry?: boolean;
};
export async function retry<T>(operation: () => Promise<T>, options?: RetryOptions): Promise<T> {
    options = {
        retryOnlyIfMatches: () => true,
        maxRetries: 3,
        warnOnRetry: false,
        operationLabel: 'operation',
        ...options,
    };
    const maxTries = options.maxRetries! + 1;
    for (let currentTry = 1; currentTry <= maxTries; currentTry += 1) {
        try {
            return await operation();
        } catch (e) {
            if (currentTry === maxTries || !options.retryOnlyIfMatches!(e)) {
                throw e;
            } else if (options.warnOnRetry) {
                console.warn(
                    `${options.operationLabel} attempt ${currentTry} failed with ${serializeError(
                        e,
                    )}, retrying...`,
                );
            }
        }
    }
    throw new Error('unreachable');
}
