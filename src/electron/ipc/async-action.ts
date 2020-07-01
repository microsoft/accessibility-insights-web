// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class AsyncAction {
    private listeners: (() => Promise<void>)[] = [];

    public async invokeAsync(): Promise<void> {
        for (const listener of this.listeners) {
            await listener();
        }
    }

    public addAsyncListener(listener: () => Promise<void>): void {
        this.listeners.push(listener);
    }
}
