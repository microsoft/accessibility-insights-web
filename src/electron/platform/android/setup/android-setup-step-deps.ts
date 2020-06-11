// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidSetupStepId } from './android-setup-step-id';

export type AndroidSetupStepDeps = {
    hasAdbPath: () => Promise<boolean>;
    stepTransition: (nextStep: AndroidSetupStepId) => void;
};
