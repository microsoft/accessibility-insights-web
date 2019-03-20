// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FunctionPPR } from '../../types/common-types';

export class EventHandlerList<TSender, TEventArgs> {
    private _handlers: FunctionPPR<TSender, TEventArgs, any>[] = [];

    public subscribe(handler: FunctionPPR<TSender, TEventArgs, any>): void {
        if (handler) {
            this._handlers.push(handler);
        }
    }

    public unsubscribe(handler: FunctionPPR<TSender, TEventArgs, any>): void {
        if (this._handlers) {
            this._handlers = this._handlers.filter(h => h !== handler);
        }
    }

    public invokeHandlers(sender?: TSender, eventArgs?: TEventArgs): void {
        const handlersCopy = Array.apply(null, this._handlers);

        handlersCopy.forEach(handler => handler(sender, eventArgs));
    }
}
