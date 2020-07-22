// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { detectDeviceAutomationId } from 'electron/views/device-connect-view/components/automation-ids';
import { PrimaryButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { AndroidSetupStepLayout, AndroidSetupStepLayoutProps } from './android-setup-step-layout';
import { CommonAndroidSetupStepProps } from './android-setup-types';
import * as styles from './prompt-connect-to-device-step.scss';

export const PromptConnectToDeviceStep = NamedFC<CommonAndroidSetupStepProps>(
    'PromptConnectToDeviceStep',
    (props: CommonAndroidSetupStepProps) => {
        const { LinkComponent } = props.deps;

        const layoutProps: AndroidSetupStepLayoutProps = {
            headerText: 'Connect to your Android device',
            moreInfoLink: (
                <LinkComponent href="https://aka.ms/accessibility-insights-for-android/connectDevice">
                    How do I connect to my device?
                </LinkComponent>
            ),
            leftFooterButtonProps: {
                text: 'Close',
                onClick: _ => props.deps.closeApp(),
            },
            rightFooterButtonProps: {
                text: 'Next',
                disabled: true,
                onClick: null,
            },
        };

        return (
            <AndroidSetupStepLayout {...layoutProps}>
                <PrimaryButton
                    data-automation-id={detectDeviceAutomationId}
                    text="Detect my device"
                    className={styles.detectButton}
                    onClick={props.deps.androidSetupActionCreator.next}
                />
            </AndroidSetupStepLayout>
        );
    },
);
