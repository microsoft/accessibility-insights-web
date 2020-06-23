// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { AndroidSetupSpinner } from 'electron/views/device-connect-view/components/android-setup/android-setup-spinner';
import * as React from 'react';
import { CommonAndroidSetupStepProps } from './android-setup-types';

export const WaitToStartStep = NamedFC<CommonAndroidSetupStepProps>(
    'WaitToStartStep',
    (props: CommonAndroidSetupStepProps) => {
        return (
            <main>
                <AndroidSetupSpinner label="Loading..." />
            </main>
        );
    },
);
