// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EventHandlerList } from './event-handler-list';

export class Store {
    private changedHandlers = new EventHandlerList();

    public addChangedListener(handler: Function): void {
        this.changedHandlers.subscribe(handler as any);
    }

    public removeChangedListener(handler: Function): void {
        this.changedHandlers.unsubscribe(handler as any);
    }

    protected emitChanged(): void {
        this.changedHandlers.invokeHandlers(this);
    }
}
