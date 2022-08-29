// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// We want behavior in between Promise.all and Promise.allSettled; we want to wait for every
// promise even if one errors immediately, like allSettled, but we also want to reject the
// wrapping promise if any of the inner ones fail (for error reporting purposes).
export async function mergePromiseResponses(asyncResponses: Promise<unknown>[]): Promise<void> {
    const results = await Promise.allSettled(asyncResponses);

    const rejectedResults = results.filter(
        (r): r is PromiseRejectedResult => r.status === 'rejected',
    );

    if (rejectedResults.length === 1) {
        throw rejectedResults[0].reason;
    }

    if (rejectedResults.length > 0) {
        const rejectedReasons = rejectedResults.map(r => r.reason);
        throw new AggregateError(rejectedReasons);
    }
}
