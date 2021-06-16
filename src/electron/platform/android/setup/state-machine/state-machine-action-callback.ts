// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Action } from 'common/flux/action';

// The following type requires a parameter
// because if you pass a class type into StateMachineActionCallback
// you will get a typescript error complaining about
// how the indexer type on the class can't be infered.
// https://github.com/microsoft/TypeScript/issues/15300
export type ActionBag<ActionT> = {
    [key in keyof ActionT]: Action<unknown>;
};

// This type represents a callback of form `(payload: PayloadT) => void`, where PayloadT matches
// the type parameter of the Action corresponding to actionName.
export type StateMachineActionCallback<
    ActionT extends ActionBag<ActionT>,
    actionName extends keyof ActionT,
> = Parameters<ActionT[actionName]['addListener']>[0];
