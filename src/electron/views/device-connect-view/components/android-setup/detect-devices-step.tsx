// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { AndroidSetupSpinnerLayout } from 'electron/views/device-connect-view/components/android-setup/android-setup-spinner-layout';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import * as React from 'react';

// export type DetectDevicesStepDeps = BufferingDeps;
// export type DetectDevicesStepProps = BufferingProps;

export const DetectDevicesStep = NamedFC<CommonAndroidSetupStepProps>(
    'DetectAdbStep',
    (props: CommonAndroidSetupStepProps) => {
        return (
            <AndroidSetupSpinnerLayout
                deps={props.deps}
                spinnerLabel="Scanning for devices..."
            ></AndroidSetupSpinnerLayout>
        );
    },
);
