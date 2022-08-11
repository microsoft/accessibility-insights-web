// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action, ActionListener } from 'common/flux/action';
import { ScopeMutex } from 'common/flux/scope-mutex';
import { mergePromiseResponses } from 'common/merge-promise-responses';

export class AsyncAction<TPayload> implements Action<TPayload, Promise<void>> {
    private listeners: ActionListener<TPayload, Promise<void>>[] = [];

    constructor(
        private readonly scopeMutex: ScopeMutex = new ScopeMutex(),
        private mergePromises: (
            promises: Promise<unknown>[],
        ) => Promise<void> = mergePromiseResponses,
    ) {}

    public async invoke(payload: TPayload, scope?: string): Promise<void> {
        let promiseResult: Promise<void>;
        this.scopeMutex.tryLockScope(scope);

        try {
            promiseResult = this.mergePromises(this.listeners.map(listener => listener(payload)));
        } finally {
            this.scopeMutex.unlockScope(scope);
            return promiseResult;
        }
    }

    public addListener(listener: ActionListener<TPayload, Promise<void>>): void {
        this.listeners.push(listener);
    }
}
