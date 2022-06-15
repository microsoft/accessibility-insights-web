// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PrimaryButton } from '@fluentui/react';
import { NamedFC } from 'common/react/named-fc';
import {
    DeviceDescription,
    DeviceDescriptionProps,
} from 'electron/views/device-connect-view/components/android-setup/device-description';
import * as React from 'react';
import { AndroidSetupStepLayout, AndroidSetupStepLayoutProps } from './android-setup-step-layout';
import { CommonAndroidSetupStepProps } from './android-setup-types';
import styles from './prompt-install-service-step.scss';

export const installAutomationId = 'install';
export const PromptInstallServiceStep = NamedFC<CommonAndroidSetupStepProps>(
    'PromptInstallServiceStep',
    (props: CommonAndroidSetupStepProps) => {
        const layoutProps: AndroidSetupStepLayoutProps = {
            headerText: 'Let us install the latest version on your device',
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
                    It looks like the Accessibility Insights for Android Service on your device is
                    either missing or out of date. We'll need to install the latest version.
                </p>
                <DeviceDescription {...descriptionProps}></DeviceDescription>
                <PrimaryButton
                    text="Install"
                    data-automation-id={installAutomationId}
                    onClick={props.deps.androidSetupActionCreator.next}
                />
            </AndroidSetupStepLayout>
        );
    },
);
