// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { mergePromiseResponses } from 'common/merge-promise-responses';
import { isPromise } from 'common/promises/is-promise';
import { FunctionPPR } from '../../types/common-types';

export type HandlerReturnType = void | Promise<void>;

export class EventHandlerList<TSender, TEventArgs, TReturn extends HandlerReturnType = void> {
    private handlers: FunctionPPR<TSender, TEventArgs, TReturn>[] = [];

    public subscribe(handler: FunctionPPR<TSender, TEventArgs, TReturn>): void {
        if (handler) {
            this.handlers.push(handler);
        }
    }

    public unsubscribe(handler: FunctionPPR<TSender, TEventArgs, TReturn>): void {
        if (this.handlers) {
            this.handlers = this.handlers.filter(h => h !== handler);
        }
    }

    public invokeHandlers(sender: TSender, eventArgs?: TEventArgs): TReturn {
        const handlersCopy = [...this.handlers];

        const results = handlersCopy.map(handler => handler(sender, eventArgs));

        const asyncResults = results.filter(isPromise);

        if (asyncResults.length === 1) {
            return asyncResults[0] as TReturn;
        }

        if (asyncResults.length > 1) {
            return mergePromiseResponses(
                asyncResults as unknown as Promise<void>[],
            ) as unknown as TReturn;
        }

        return undefined as TReturn;
    }
}
