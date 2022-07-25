// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DictionaryStringTo } from 'types/common-types';

export class ScopeMutex {
    /**
     * A mutex to ensure that only one action in a given scope is executing at any time.
     * This prevents cascading actions and infinite loops.
     *
     * However, with AsyncAction, it is possible for two actions to execute concurrently
     * without one having called the other. The most obvious case when this would happen
     * is if a message has multiple callbacks registered, more than one of which invoke
     * actions. In this case, a different scope should be passed to invoke() in each
     * callback to allow them to run concurrently.
     */
    private static executingScopes: DictionaryStringTo<boolean> = {};
    private static defaultScope: string = 'DEFAULT_SCOPE';

    public tryLockScope(scope?: string): void {
        const activeScope = scope ?? ScopeMutex.defaultScope;
        if (ScopeMutex.executingScopes[activeScope]) {
            throw new Error(
                `Cannot invoke an action with scope ${activeScope} from inside another action with the same scope`,
            );
        }

        ScopeMutex.executingScopes[activeScope] = true;
    }

    public unlockScope(scope?: string): void {
        const activeScope = scope ?? ScopeMutex.defaultScope;
        delete ScopeMutex.executingScopes[activeScope];
    }
}
