// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import {
    DeviceDescription,
    DeviceDescriptionProps,
} from 'electron/views/device-connect-view/components/android-setup/device-description';
import { PrimaryButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { AndroidSetupStepLayout, AndroidSetupStepLayoutProps } from './android-setup-step-layout';
import { CommonAndroidSetupStepProps } from './android-setup-types';
import * as styles from './prompt-install-service-step.scss';

export const PromptInstallServiceStep = NamedFC<CommonAndroidSetupStepProps>(
    'PromptInstallServiceStep',
    (props: CommonAndroidSetupStepProps) => {
        const onCancelButton = () => {
            // To be implemented in future feature work
            console.log(`androidSetupActionCreator.cancel()`);
        };

        const onInstallButton = () => {
            // To be implemented in future feature work
            console.log(`androidSetupActionCreator.installService()`);
        };

        const layoutProps: AndroidSetupStepLayoutProps = {
            headerText: 'Let us install the latest version on your device',
            leftFooterButtonProps: {
                text: 'Cancel',
                onClick: onCancelButton,
            },
            rightFooterButtonProps: {
                text: 'Next',
                disabled: true,
                onClick: null,
            },
        };

        const descriptionProps: DeviceDescriptionProps = {
            ...props.androidSetupStoreData.selectedDevice,
            className: styles.deviceDescription,
        };

        return (
            <AndroidSetupStepLayout {...layoutProps}>
                <>
                    It looks like the Accessibility Insights for Android Service on your device is
                    either missing or out of date. We'll need to install the latest version.
                </>
                <DeviceDescription {...descriptionProps}></DeviceDescription>
                <PrimaryButton text="Install" onClick={onInstallButton} />
            </AndroidSetupStepLayout>
        );
    },
);
