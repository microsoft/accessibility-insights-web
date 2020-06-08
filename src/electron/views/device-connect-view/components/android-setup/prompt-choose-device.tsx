// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import {
    CheckboxVisibility,
    DefaultButton,
    DetailsList,
    FontIcon,
    SelectionMode,
} from 'office-ui-fabric-react';
import * as React from 'react';
import {
    AndroidSetupPromptLayout,
    AndroidSetupPromptLayoutProps,
} from './android-setup-prompt-layout';
import { CommonAndroidSetupStepProps } from './android-setup-types';
import * as styles from './prompt-choose-device.scss';

export const PromptChooseDevice = NamedFC<CommonAndroidSetupStepProps>(
    'PromptChooseDevice',
    (props: CommonAndroidSetupStepProps) => {
        const onCloseButton = () => {
            // To be implemented in future feature work
            console.log(`androidSetupActionCreator.close()`);
        };

        const onNextButton = () => {
            // To be implemented in future feature work
            console.log(`androidSetupActionCreator.next()`);
        };

        const onRescanButton = () => {
            console.log(`androidSetupActionCreator.rescan()`);
        };

        const items = [
            {
                value: 'Galaxy S20',
            },
            {
                value: 'Galaxy S21',
            },
            {
                value: 'Galaxy S22',
            },
        ];

        const layoutProps: AndroidSetupPromptLayoutProps = {
            headerText: 'Choose which device to use',
            children: (
                <>
                    <p>2 Android devices or emulators connected</p>
                    <DefaultButton text="Rescan" onClick={onRescanButton} />
                    <DetailsList
                        className={styles.phoneList}
                        items={items}
                        selectionMode={SelectionMode.single}
                        checkboxVisibility={CheckboxVisibility.always}
                        isHeaderVisible={false}
                        onRenderCheckbox={checkboxProps => {
                            return checkboxProps.checked ? (
                                <>
                                    <FontIcon iconName="CheckMark" className={'test'} />
                                </>
                            ) : null;
                        }}
                    />
                </>
            ),
            leftFooterButtonProps: {
                text: 'Close',
                onClick: onCloseButton,
            },
            rightFooterButtonProps: {
                text: 'Next',
                disabled: false,
                onClick: onNextButton,
            },
        };

        return <AndroidSetupPromptLayout {...layoutProps}></AndroidSetupPromptLayout>;
    },
);
