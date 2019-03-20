// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DictionaryStringTo } from '../../types/common-types';

export class Action<TPayload> {
    /**
     * A mutex to ensure that only one action in a given scope is executing at any time.
     * This prevents cascading actions.
     */
    private static executingScopes: DictionaryStringTo<boolean> = {};

    private _listeners: ((payload: TPayload) => void)[] = [];
    private _scope: string = 'DEFAULT_SCOPE';

    public invoke(payload: TPayload): void {
        if (Action.executingScopes[this._scope]) {
            throw new Error(`Cannot invoke an action with scope ${this._scope} from inside another action with the same scope`);
        }

        Action.executingScopes[this._scope] = true;

        try {
            this._listeners.forEach((listener: (payload: TPayload) => void) => {
                listener(payload);
            });
        } finally {
            delete Action.executingScopes[this._scope];
        }
    }

    public addListener(listener: (payload: TPayload) => void): void {
        this._listeners.push(listener);
    }
}
