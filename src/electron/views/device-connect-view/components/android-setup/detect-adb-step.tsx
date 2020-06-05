// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import * as React from 'react';

import { androidSetupSpinner } from '../android-setup/android-setup.scss';

export const DetectAdbStep = NamedFC<CommonAndroidSetupStepProps>(
    'DetectAdbStep',
    (props: CommonAndroidSetupStepProps) => {
        return (
            <Spinner
                className={androidSetupSpinner}
                size={SpinnerSize.large}
                label="Loading..."
                role="alert"
                aria-live={props['aria-live']}
            />
        );
    },
);
