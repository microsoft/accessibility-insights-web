// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import {
    DeviceDescription,
    DeviceDescriptionProps,
} from 'electron/views/device-connect-view/components/android-setup/device-description';
import * as styles from 'electron/views/device-connect-view/components/android-setup/prompt-connected-start-testing-step.scss';
import { rescanAutomationId } from 'electron/views/device-connect-view/components/automation-ids';
import { DefaultButton } from 'office-ui-fabric-react';
import * as React from 'react';

import { AndroidSetupStepLayout, AndroidSetupStepLayoutProps } from './android-setup-step-layout';
import { CommonAndroidSetupStepProps } from './android-setup-types';

const startTestingAndResetState = (props: CommonAndroidSetupStepProps) => {
    props.deps.startTesting();
    props.deps.androidSetupActionCreator.readyToStart(); // Overloaded to reset to 'connect device state'
};

export const PromptConnectedStartTestingStep = NamedFC<CommonAndroidSetupStepProps>(
    'PromptConnectedStartTestingStep',
    (props: CommonAndroidSetupStepProps) => {
        const { LinkComponent } = props.deps;

        const layoutProps: AndroidSetupStepLayoutProps = {
            headerText: 'Connected and ready to go!',
            moreInfoLink: (
                <LinkComponent href="https://aka.ms/accessibility-insights-for-android/otherDevice">
                    How do I connect a different device?
                </LinkComponent>
            ),
            leftFooterButtonProps: {
                text: 'Cancel',
                onClick: _ => props.deps.androidSetupActionCreator.cancel(),
            },
            rightFooterButtonProps: {
                text: 'Start testing',
                disabled: false,
                onClick: _ => startTestingAndResetState(props),
            },
        };

        const descriptionProps: DeviceDescriptionProps = {
            deviceInfo: props.androidSetupStoreData.selectedDevice,
            className: styles.deviceDescription,
            currentApplication: props.androidSetupStoreData.applicationName,
        };

        return (
            <AndroidSetupStepLayout {...layoutProps}>
                <DeviceDescription {...descriptionProps}></DeviceDescription>
                <DefaultButton
                    data-automation-id={rescanAutomationId}
                    text="Rescan devices"
                    onClick={props.deps.androidSetupActionCreator.rescan}
                />
            </AndroidSetupStepLayout>
        );
    },
);
