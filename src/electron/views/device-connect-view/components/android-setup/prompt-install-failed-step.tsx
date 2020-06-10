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
import * as styles from './prompt-install-failed-step.scss';

export const PromptInstallFailedStep = NamedFC<CommonAndroidSetupStepProps>(
    'PromptInstallFailedStep',
    (props: CommonAndroidSetupStepProps) => {
        const { LinkComponent } = props.deps;

        const onCancelButton = () => {
            // To be implemented in future feature work
            console.log(`androidSetupActionCreator.cancel()`);
        };

        const onTryAgain = () => {
            // To be implemented in future feature work
            console.log(`androidSetupActionCreator.installService()`);
        };

        const layoutProps: AndroidSetupStepLayoutProps = {
            headerText: 'Installation attempt failed',
            moreInfoLink: (
                <LinkComponent href="https://aka.ms/accessibility-insights-for-android/troubleshootInstallation">
                    Troubleshooting installation problems
                </LinkComponent>
            ),
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
                    We were unable to install the latest version of Accessibility Insights for
                    Android Service on your device. You can try installing the service yourself,
                    from your device, or choose one of the options below.
                </>
                <DeviceDescription {...descriptionProps}></DeviceDescription>
                <PrimaryButton text="Try again" onClick={onTryAgain} />
            </AndroidSetupStepLayout>
        );
    },
);
