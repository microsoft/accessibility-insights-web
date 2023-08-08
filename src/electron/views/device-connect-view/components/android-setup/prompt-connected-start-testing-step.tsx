// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import {
    DeviceDescription,
    DeviceDescriptionProps,
} from 'electron/views/device-connect-view/components/android-setup/device-description';
import * as styles from 'electron/views/device-connect-view/components/android-setup/prompt-connected-start-testing-step.scss';
import { DefaultButton } from 'office-ui-fabric-react';
import * as React from 'react';

import { rescanAutomationId } from 'electron/views/device-connect-view/components/automation-ids';
import { AndroidSetupStepLayout, AndroidSetupStepLayoutProps } from './android-setup-step-layout';
import { CommonAndroidSetupStepProps } from './android-setup-types';

export const PromptConnectedStartTestingStep = NamedFC<CommonAndroidSetupStepProps>(
    'PromptConnectedStartTestingStep',
    (props: CommonAndroidSetupStepProps) => {
        const { LinkComponent } = props.deps;

        const layoutProps: AndroidSetupStepLayoutProps = {
            headerText: 'Set up a target application',
            leftFooterButtonProps: {
                text: 'Cancel',
                onClick: _ => props.deps.androidSetupActionCreator.cancel(),
            },
            rightFooterButtonProps: {
                text: 'Start testing',
                disabled: false,
                onClick: props.deps.startTesting,
            },
        };

        const descriptionProps: DeviceDescriptionProps = {
            deviceInfo: props.androidSetupStoreData.selectedDevice,
            className: styles.deviceDescription,
            currentApplication: props.androidSetupStoreData.applicationName,
        };

        return (
            <AndroidSetupStepLayout {...layoutProps}>
                <p>
                    Start an electron application with the command line arg{' '}
                    <code>--remote-debugging-port=10156</code>
                </p>
            </AndroidSetupStepLayout>
        );
    },
);
