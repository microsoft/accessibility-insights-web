// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupActions } from 'electron/flux/action/android-setup-actions';
import { StateMachineStep } from 'electron/platform/android/setup/state-machine/state-machine-step';

export const checkExpectedActionsAreDefined = (
    step: StateMachineStep<AndroidSetupActions>,
    expectedActions?: (keyof AndroidSetupActions)[],
): void => {
    expectedActions = expectedActions ?? [];

    const actionNames = Object.keys(new AndroidSetupActions()) as (keyof AndroidSetupActions)[];

    for (const actionName of actionNames) {
        if (expectedActions.includes(actionName)) {
            expect(step.actions[actionName]).toBeDefined();
        } else {
            expect(step.actions[actionName]).not.toBeDefined();
        }
    }
};
