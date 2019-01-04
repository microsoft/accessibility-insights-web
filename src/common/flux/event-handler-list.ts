// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class EventHandlerList<TSender, TEventArgs> {

    private _handlers: IFunctionPPR<TSender, TEventArgs, any>[] = [];

    public subscribe(handler: IFunctionPPR<TSender, TEventArgs, any>) {
        if (handler) {
            this._handlers.push(handler);
        }
    }

    public unsubscribe(handler: IFunctionPPR<TSender, TEventArgs, any>) {
        if (this._handlers) {
            this._handlers = this._handlers.filter(h => h !== handler);
        }
    }

    public invokeHandlers(sender?: TSender, eventArgs?: TEventArgs): void {
        const handlersCopy = Array.apply(null, this._handlers);

        handlersCopy.forEach(handler => handler(sender, eventArgs));
    }
}
