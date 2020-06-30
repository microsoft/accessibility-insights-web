// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DictionaryStringTo } from '../../types/common-types';

export class Action<TPayload> {
    /**
     * A mutex to ensure that only one action in a given scope is executing at any time.
     * This prevents cascading actions.
     */
    private static executingScopes: DictionaryStringTo<boolean> = {};

    private listeners: ((payload: TPayload) => void)[] = [];
    private scope: string = 'DEFAULT_SCOPE';

    public invoke(payload: TPayload, scope?: string): void {
        const activeScope = scope ?? this.scope;
        if (Action.executingScopes[activeScope]) {
            throw new Error(
                `Cannot invoke an action with scope ${activeScope} from inside another action with the same scope`,
            );
        }

        Action.executingScopes[activeScope] = true;

        try {
            this.listeners.forEach((listener: (payload: TPayload) => void) => {
                listener(payload);
            });
        } finally {
            delete Action.executingScopes[activeScope];
        }
    }

    public addListener(listener: (payload: TPayload) => void): void {
        this.listeners.push(listener);
    }
}
