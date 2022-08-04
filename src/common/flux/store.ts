// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EventHandlerList, HandlerReturnType } from './event-handler-list';

export class Store<TReturn extends HandlerReturnType = void> {
    private changedHandlers = new EventHandlerList<this, unknown, TReturn>();

    public addChangedListener(handler: (store: this, args?: unknown) => TReturn): void {
        this.changedHandlers.subscribe(handler);
    }

    public removeChangedListener(handler: (store: this, args?: unknown) => TReturn): void {
        this.changedHandlers.unsubscribe(handler);
    }

    protected emitChanged(): TReturn {
        return this.changedHandlers.invokeHandlers(this);
    }
}
