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
import styles from './prompt-grant-permissions-step.scss';

export const PromptGrantPermissionsStep = NamedFC<CommonAndroidSetupStepProps>(
    'PromptGrantPermissionsStep',
    (props: CommonAndroidSetupStepProps) => {
        const { LinkComponent } = props.deps;

        const layoutProps: AndroidSetupStepLayoutProps = {
            headerText: 'Grant permissions on your device',
            moreInfoLink: (
                <LinkComponent href="https://aka.ms/accessibility-insights-for-android/grantPermissions">
                    How do I grant permissions?
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
                    Be sure the Accessibility Insights for Android Service on your device is turned
                    on and has permission to access your device and capture screenshots. Then select{' '}
                    <i>Try again</i> to connect.
                </p>
                <DeviceDescription {...descriptionProps}></DeviceDescription>
                <PrimaryButton
                    text="Try again"
                    data-automation-id={tryAgainAutomationId}
                    onClick={props.deps.androidSetupActionCreator.next}
                />
            </AndroidSetupStepLayout>
        );
    },
);
