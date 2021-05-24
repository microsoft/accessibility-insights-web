// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import * as React from 'react';

export class AndroidSetupStepContainer extends React.Component<CommonAndroidSetupStepProps> {
    constructor(props: CommonAndroidSetupStepProps) {
        super(props);
    }

    public render(): JSX.Element {
        const Component =
            this.props.deps.androidSetupStepComponentProvider[
                this.props.androidSetupStoreData.currentStepId
            ];
        return (
            <div data-automation-id={`${this.props.androidSetupStoreData.currentStepId}-content`}>
                <Component {...this.props} />
            </div>
        );
    }
}
