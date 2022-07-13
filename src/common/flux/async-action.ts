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
            await Promise.all(
                this.listeners.map((listener: (payload: TPayload) => void) => listener(payload)),
            );
        } finally {
            this.scopeMutex.unlockScope(scope);
        }
    }

    public addListener(listener: (payload: TPayload) => Promise<void>): void {
        this.listeners.push(listener);
    }
}
