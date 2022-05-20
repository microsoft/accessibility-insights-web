// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PrimaryButton } from '@fluentui/react';
import { NamedFC } from 'common/react/named-fc';
import {
    DeviceDescription,
    DeviceDescriptionProps,
} from 'electron/views/device-connect-view/components/android-setup/device-description';
import { tryAgainAutomationId } from 'electron/views/device-connect-view/components/automation-ids';
import * as React from 'react';
import { AndroidSetupStepLayout, AndroidSetupStepLayoutProps } from './android-setup-step-layout';
import { CommonAndroidSetupStepProps } from './android-setup-types';
import styles from './prompt-install-failed-step.scss';

export const PromptEstablishingConnectionFailedStep = NamedFC<CommonAndroidSetupStepProps>(
    'PromptEstablishingConnectionFailedStep',
    (props: CommonAndroidSetupStepProps) => {
        const { LinkComponent } = props.deps;

        const layoutProps: AndroidSetupStepLayoutProps = {
            headerText: 'Establishing connection failed',
            moreInfoLink: (
                <LinkComponent href="https://aka.ms/accessibility-insights-for-android/establishingConnection">
                    Troubleshooting guidance
                </LinkComponent>
            ),
            leftFooterButtonProps: {
                text: 'Cancel',
                onClick: _ => props.deps.androidSetupActionCreator.cancel(),
            },
            rightFooterButtonProps: {
                text: 'Next',
                disabled: true,
                onClick: undefined,
            },
        };

        const descriptionProps: DeviceDescriptionProps = {
            deviceInfo: props.androidSetupStoreData.selectedDevice,
            className: styles.deviceDescription,
        };

        return (
            <AndroidSetupStepLayout {...layoutProps}>
                <p>
                    We were unable to connect to the Accessibility Insights for Android Service on
                    your device. Please reconnect your device and try again.
                </p>
                <DeviceDescription {...descriptionProps}></DeviceDescription>
                <PrimaryButton
                    data-automation-id={tryAgainAutomationId}
                    text="Try again"
                    onClick={props.deps.androidSetupActionCreator.next}
                />
            </AndroidSetupStepLayout>
        );
    },
);
