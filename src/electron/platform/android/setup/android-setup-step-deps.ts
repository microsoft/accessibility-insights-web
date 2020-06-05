// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';

export type AndroidSetupStepDeps = {
    stepTransition: (nextStep: AndroidSetupStepId) => void;
};
