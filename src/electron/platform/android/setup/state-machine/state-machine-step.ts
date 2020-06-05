// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActionBag, StateMachineActionCallback } from './state-machine-action-callback';

export type StateMachineStep<ActionT extends ActionBag<ActionT>> = {
    actions: {
        // eg, 'adb-location-confirmed': (newAdbLocation) => { /* behavior */ }
        [actionName in keyof ActionT]?: StateMachineActionCallback<ActionT, actionName>;
    };
    onEnter?: () => void;
};
