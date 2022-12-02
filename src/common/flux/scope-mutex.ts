// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { getStackTrace } from 'common/get-stack-trace';
import { DictionaryStringTo } from 'types/common-types';

type Scope = {
    name: string;
    stack?: string;
};

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
    private static executingScopes: DictionaryStringTo<Scope> = {};
    private static defaultScope: string = 'DEFAULT_SCOPE';

    public tryLockScope(scopeName?: string): void {
        scopeName = scopeName ?? ScopeMutex.defaultScope;
        const scope = ScopeMutex.executingScopes[scopeName];
        if (scope != null) {
            throw new Error(
                `Cannot invoke an action with scope ${scopeName} from inside another action with the same scope. Stack of original scope holder: ${scope.stack}`,
            );
        }

        ScopeMutex.executingScopes[scopeName] = {
            name: scopeName,
            stack: getStackTrace(),
        };
    }

    public unlockScope(scopeName?: string): void {
        scopeName = scopeName ?? ScopeMutex.defaultScope;
        delete ScopeMutex.executingScopes[scopeName];
    }
}
