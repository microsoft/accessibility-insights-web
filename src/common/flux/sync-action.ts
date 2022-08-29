// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action, ActionListener } from 'common/flux/action';
import { ScopeMutex } from 'common/flux/scope-mutex';

export class SyncAction<TPayload> implements Action<TPayload, void> {
    private listeners: ActionListener<TPayload, void>[] = [];

    constructor(private readonly scopeMutex: ScopeMutex = new ScopeMutex()) {}

    public invoke(payload: TPayload, scope?: string): void {
        this.scopeMutex.tryLockScope(scope);

        try {
            this.listeners.forEach(listener => {
                listener(payload);
            });
        } finally {
            this.scopeMutex.unlockScope(scope);
        }
    }

    public addListener(listener: ActionListener<TPayload, void>): void {
        this.listeners.push(listener);
    }
}
