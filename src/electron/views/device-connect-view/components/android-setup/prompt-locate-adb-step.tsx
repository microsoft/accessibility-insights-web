// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import {
    AndroidSetupPromptLayout,
    AndroidSetupPromptLayoutProps,
} from './android-setup-prompt-layout';
import { CommonAndroidSetupStepProps } from './android-setup-types';
import { FolderPickerTextField } from './folder-picker-text-field';

export const PromptLocateAdbStep = NamedFC<CommonAndroidSetupStepProps>(
    'PromptLocateAdbStep',
    (props: CommonAndroidSetupStepProps) => {
        const [adbLocation, setAdbLocation] = React.useState(
            props.userConfigurationStoreData.adbLocation ?? '',
        );

        const { LinkComponent } = props.deps;

        const onCloseButton = () => {
            console.log(`androidSetupActionCreator.close()`);
            // props.deps.androidSetupActionCreator.close();
        };

        const onNextButton = () => {
            console.log(`androidSetupActionCreator.commitAdbLocation(${adbLocation})`);
            // props.deps.androidSetupActionCreator.commitAdbLocation(adbLocation);
        };

        const onFolderPickerChange = (newValue?: string) => {
            setAdbLocation(newValue ?? '');
        };

        const layoutProps: AndroidSetupPromptLayoutProps = {
            headerText: 'Locate Android Debug Bridge (adb)',
            moreInfoLink: <LinkComponent href="https://TODO">How do I locate adb?</LinkComponent>,
            leftFooterButtonProps: {
                text: 'Close',
                onClick: onCloseButton,
            },
            rightFooterButtonProps: {
                text: 'Next',
                disabled: adbLocation === '',
                onClick: onNextButton,
            },
        };

        return (
            <AndroidSetupPromptLayout {...layoutProps}>
                <FolderPickerTextField
                    deps={props.deps}
                    value={adbLocation}
                    onChange={onFolderPickerChange}
                />
            </AndroidSetupPromptLayout>
        );
    },
);
