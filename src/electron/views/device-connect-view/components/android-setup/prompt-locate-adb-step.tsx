// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import * as React from 'react';

export const PromptLocateAdbStep = NamedFC<CommonAndroidSetupStepProps>(
    'PromptLocateAdbStep',
    (props: CommonAndroidSetupStepProps) => {
        return <div>prompt-locate-adb</div>;
    },
);
