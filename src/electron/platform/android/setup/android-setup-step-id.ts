// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type AndroidSetupStepId =
    | 'wait-to-start'
    | 'detect-adb'
    | 'prompt-locate-adb'
    | 'prompt-connect-to-device'
    | 'detect-devices'
    | 'prompt-choose-device'
    | 'detect-service'
    | 'prompt-install-service'
    | 'installing-service'
    | 'prompt-install-failed'
    | 'detect-permissions'
    | 'prompt-grant-permissions'
    | 'grant-overlay-permission'
    | 'establish-connection'
    | 'prompt-establishing-connection-failed'
    | 'prompt-connected-start-testing';
