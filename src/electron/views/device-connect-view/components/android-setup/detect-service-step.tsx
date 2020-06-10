// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { AndroidSetupSpinner } from './android-setup-spinner';
import { CommonAndroidSetupStepProps } from './android-setup-types';

export const DetectServiceStep = NamedFC<CommonAndroidSetupStepProps>(
    'DetectServiceStep',
    (props: CommonAndroidSetupStepProps) => {
        return (
            <main>
                <AndroidSetupSpinner label="Scanning for the service on your device..." />
            </main>
        );
    },
);
