// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { AndroidSetupSpinnerStep } from './android-setup-spinner-step';
import { CommonAndroidSetupStepProps } from './android-setup-types';

export const InstallingServiceStep = NamedFC<CommonAndroidSetupStepProps>(
    'InstallingServiceStep',
    (props: CommonAndroidSetupStepProps) => {
        return (
            <main>
                <AndroidSetupSpinnerStep
                    deps={props.deps}
                    spinnerLabel="Installing on your device..."
                />
            </main>
        );
    },
);
