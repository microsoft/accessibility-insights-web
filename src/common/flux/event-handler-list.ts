// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FunctionPPR } from '../../types/common-types';

export class EventHandlerList<TSender, TEventArgs> {
    private handlers: FunctionPPR<TSender, TEventArgs, any>[] = [];

    public subscribe(handler: FunctionPPR<TSender, TEventArgs, any>): void {
        if (handler) {
            this.handlers.push(handler);
        }
    }

    public unsubscribe(handler: FunctionPPR<TSender, TEventArgs, any>): void {
        if (this.handlers) {
            this.handlers = this.handlers.filter(h => h !== handler);
        }
    }

    public invokeHandlers(sender?: TSender, eventArgs?: TEventArgs): void {
        if (sender == null) {
            return;
        }
        if (eventArgs == null) {
            return;
        }

        const handlersCopy = [...this.handlers];

        handlersCopy.forEach(handler => handler(sender, eventArgs));
    }
}
