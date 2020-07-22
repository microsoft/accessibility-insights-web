// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import {
    DeviceDescription,
    DeviceDescriptionProps,
} from 'electron/views/device-connect-view/components/android-setup/device-description';
import { tryAgainAutomationId } from 'electron/views/device-connect-view/components/automation-ids';
import { PrimaryButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { AndroidSetupStepLayout, AndroidSetupStepLayoutProps } from './android-setup-step-layout';
import { CommonAndroidSetupStepProps } from './android-setup-types';
import * as styles from './prompt-install-failed-step.scss';

export const PromptConfiguringPortForwardingFailedStep = NamedFC<CommonAndroidSetupStepProps>(
    'PromptConfiguringPortForwardingFailedStep',
    (props: CommonAndroidSetupStepProps) => {
        const { LinkComponent } = props.deps;

        const layoutProps: AndroidSetupStepLayoutProps = {
            headerText: 'Port forwarding failed',
            moreInfoLink: (
                <LinkComponent href="https://aka.ms/accessibility-insights-for-android/portForwarding">
                    Troubleshooting port forwarding problems
                </LinkComponent>
            ),
            leftFooterButtonProps: {
                text: 'Cancel',
                onClick: _ => props.deps.androidSetupActionCreator.cancel(),
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
                <p>
                    We were unable to configure port forwarding from Accessibility Insights for
                    Android Service on your device. Please reconnect your device and try again.
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
