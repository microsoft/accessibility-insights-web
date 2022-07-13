// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { ScopeMutex } from 'common/flux/scope-mutex';

export class AsyncAction<TPayload> implements Action<TPayload, Promise<void>> {
    private listeners: ((payload: TPayload) => Promise<void>)[] = [];

    constructor(private readonly scopeMutex: ScopeMutex = new ScopeMutex()) {}

    public async invoke(payload: TPayload, scope?: string): Promise<void> {
        this.scopeMutex.tryLockScope(scope);

        try {
            const results = await Promise.allSettled(
                this.listeners.map((listener: (payload: TPayload) => void) => listener(payload)),
            );
            this.throwCombinedRejections(results);
        } finally {
            this.scopeMutex.unlockScope(scope);
        }
    }

    public addListener(listener: (payload: TPayload) => Promise<void>): void {
        this.listeners.push(listener);
    }

    private throwCombinedRejections(promiseResults: PromiseSettledResult<void>[]): void {
        const rejectedResults = promiseResults.filter(
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
}
