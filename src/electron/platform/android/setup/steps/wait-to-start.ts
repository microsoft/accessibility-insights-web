// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const waitToStart: AndroidSetupStepConfig = deps => {
    return {
        actions: {
            readyToStart: () => deps.stepTransition('detect-adb'),
        },
    };
};
