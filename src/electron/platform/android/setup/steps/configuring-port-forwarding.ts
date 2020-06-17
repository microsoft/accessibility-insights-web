// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepConfig } from 'electron/platform/android/setup/android-setup-steps-configs';

export const configuringPortForwarding: AndroidSetupStepConfig = deps => ({
    actions: {},
    onEnter: async () => {
        const configured = await deps.setTcpForwarding();
        deps.stepTransition(
            configured
                ? 'prompt-connected-start-testing'
                : 'prompt-configuring-port-forwarding-failed',
        );
    },
});
