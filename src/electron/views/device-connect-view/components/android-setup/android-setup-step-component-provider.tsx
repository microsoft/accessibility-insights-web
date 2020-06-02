// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import {
    AndroidSetupStep,
    CommonAndroidSetupStepProps,
} from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import * as React from 'react';

export type AndroidSetupStepComponentProvider = Partial<
    Record<AndroidSetupStepId, AndroidSetupStep>
>;

export class AndroidSetupStepComponent extends React.Component<CommonAndroidSetupStepProps> {
    constructor(props: CommonAndroidSetupStepProps) {
        super(props);
    }

    public render(): JSX.Element {
        const Component = this.props.deps.androidSetupStepComponentProvider[
            this.props.androidSetupStoreData.currentStepId
        ];
        return <Component {...this.props} />;
    }
}
