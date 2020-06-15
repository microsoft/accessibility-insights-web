// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { AndroidSetupStepLayout, AndroidSetupStepLayoutProps } from './android-setup-step-layout';
import { CommonAndroidSetupStepProps } from './android-setup-types';
import { FolderPicker } from './folder-picker';

export const PromptLocateAdbStep = NamedFC<CommonAndroidSetupStepProps>(
    'PromptLocateAdbStep',
    (props: CommonAndroidSetupStepProps) => {
        const [adbLocation, setAdbLocation] = React.useState(
            props.userConfigurationStoreData.adbLocation ?? '',
        );

        const { LinkComponent } = props.deps;

        const onFolderPickerChange = (newValue?: string) => {
            setAdbLocation(newValue ?? '');
        };

        const layoutProps: AndroidSetupStepLayoutProps = {
            headerText: 'Locate Android Debug Bridge (adb)',
            moreInfoLink: (
                <LinkComponent href="https://aka.ms/accessibility-insights-for-android/locateadb">
                    How do I locate adb?
                </LinkComponent>
            ),
            leftFooterButtonProps: {
                text: 'Close',
                onClick: _ => props.deps.closeApp(),
            },
            rightFooterButtonProps: {
                text: 'Next',
                disabled: adbLocation === '',
                onClick: _ => props.deps.androidSetupActionCreator.saveAdbPath(adbLocation),
            },
        };

        return (
            <AndroidSetupStepLayout {...layoutProps}>
                <FolderPicker
                    deps={props.deps}
                    instructionsText="Select the folder containing adb. We'll use it to connect to your device."
                    value={adbLocation}
                    onChange={onFolderPickerChange}
                />
            </AndroidSetupStepLayout>
        );
    },
);
