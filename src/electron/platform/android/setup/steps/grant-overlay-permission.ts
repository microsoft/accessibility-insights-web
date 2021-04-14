// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const grantOverlayPermission: AndroidSetupStepConfig = (stepTransition, deps) => ({
    actions: {},
    onEnter: async () => {
        await deps.grantOverlayPermission();
        stepTransition('configuring-port-forwarding');
    },
});
