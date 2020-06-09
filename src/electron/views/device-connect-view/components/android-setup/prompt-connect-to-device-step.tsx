// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { PrimaryButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { AndroidSetupStepLayout, AndroidSetupStepLayoutProps } from './android-setup-step-layout';
import { CommonAndroidSetupStepProps } from './android-setup-types';

export const PromptConnectToDeviceStep = NamedFC<CommonAndroidSetupStepProps>(
    'PromptConnectToDeviceStep',
    (props: CommonAndroidSetupStepProps) => {
        const { LinkComponent } = props.deps;

        const onCloseButton = () => {
            // To be implemented in future feature work
            console.log(`androidSetupActionCreator.close()`);
        };

        const onDetectButton = () => {
            // To be implemented in future feature work
            console.log(`androidSetupActionCreator.detectDevices()`);
        };

        const layoutProps: AndroidSetupStepLayoutProps = {
            headerText: 'Connect to your Android device',
            moreInfoLink: (
                <LinkComponent href="https://aka.ms/accessibility-insights-for-android/connectDevice">
                    How do I connect to my device?
                </LinkComponent>
            ),
            leftFooterButtonProps: {
                text: 'Close',
                onClick: onCloseButton,
            },
            rightFooterButtonProps: {
                text: 'Next',
                disabled: true,
                onClick: null,
            },
        };

        return (
            <AndroidSetupStepLayout {...layoutProps}>
                <PrimaryButton text="Detect my device" onClick={onDetectButton} />
            </AndroidSetupStepLayout>
        );
    },
);
