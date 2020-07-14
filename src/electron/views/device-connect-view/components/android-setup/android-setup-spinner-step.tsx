// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import { AndroidSetupSpinner } from 'electron/views/device-connect-view/components/android-setup/android-setup-spinner';
import * as React from 'react';
import * as styles from './android-setup-spinner-step.scss';
import { AndroidSetupStepLayout, AndroidSetupStepLayoutProps } from './android-setup-step-layout';

export type AndroidSetupSpinnerStepDeps = {
    androidSetupActionCreator: AndroidSetupActionCreator;
};

export type AndroidSetupSpinnerStepProps = {
    deps: AndroidSetupSpinnerStepDeps;
    spinnerLabel: string;
    disableCancel?: boolean;
};

export const AndroidSetupSpinnerStep = NamedFC<AndroidSetupSpinnerStepProps>(
    'AndroidSetupSpinnerStep',
    props => {
        const layoutProps: AndroidSetupStepLayoutProps = {
            leftFooterButtonProps: {
                text: 'Cancel',
                onClick: props.deps.androidSetupActionCreator.cancel,
                disabled: props.disableCancel ? props.disableCancel : false,
            },
            rightFooterButtonProps: {
                text: 'Next',
                disabled: true,
            },
            contentClassName: styles.content,
        };

        return (
            <AndroidSetupStepLayout {...layoutProps}>
                <AndroidSetupSpinner label={props.spinnerLabel} />
            </AndroidSetupStepLayout>
        );
    },
);
