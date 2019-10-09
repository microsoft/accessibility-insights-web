// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EventHandlerList } from './event-handler-list';

export class Store {
    private changedHandlers = new EventHandlerList<this, unknown>();

    public addChangedListener(handler: (store: this, args?: unknown) => void): void {
        this.changedHandlers.subscribe(handler);
    }

    public removeChangedListener(handler: (store: this, args?: unknown) => void): void {
        this.changedHandlers.unsubscribe(handler);
    }

    protected emitChanged(): void {
        this.changedHandlers.invokeHandlers(this);
    }
}
