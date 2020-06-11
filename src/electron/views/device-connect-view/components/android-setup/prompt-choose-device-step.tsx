// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { DeviceMetadata } from 'electron/flux/types/device-metadata';
import {
    CheckboxVisibility,
    DefaultButton,
    DetailsList,
    FontIcon,
    SelectionMode,
} from 'office-ui-fabric-react';
import * as React from 'react';
import { AndroidSetupStepLayout, AndroidSetupStepLayoutProps } from './android-setup-step-layout';
import { CommonAndroidSetupStepProps } from './android-setup-types';
import { DeviceDescription } from './device-description';
import * as styles from './prompt-choose-device-step.scss';

export const PromptChooseDeviceStep = NamedFC<CommonAndroidSetupStepProps>(
    'PromptChooseDeviceStep',
    (props: CommonAndroidSetupStepProps) => {
        const [selectedDevice, setSelectedDevice] = React.useState(
            props.androidSetupStoreData.selectedDevice ?? null,
        );
        const onNextButton = () => {
            // To be implemented in future feature work
            console.log(`androidSetupActionCreator.next()`);
        };

        const onRescanButton = () => {
            // To be implemented in future feature work
            console.log(`androidSetupActionCreator.rescan()`);
        };

        const devices: DeviceMetadata[] = [
            {
                description: 'Phone 1',
                isEmulator: true,
            },
            {
                description: 'Phone 2',
                isEmulator: false,
            },
            {
                description: 'Phone 3',
                isEmulator: true,
            },
        ];

        const items = devices.map(m => ({ metadata: m }));

        const layoutProps: AndroidSetupStepLayoutProps = {
            headerText: 'Choose which device to use',
            children: (
                <>
                    <p>2 Android devices or emulators connected</p>
                    <DefaultButton text="Rescan" onClick={onRescanButton} />
                    <DetailsList
                        compact={true}
                        ariaLabel="android devices"
                        className={styles.phoneList}
                        items={items}
                        selectionMode={SelectionMode.single}
                        checkboxVisibility={CheckboxVisibility.always}
                        isHeaderVisible={false}
                        checkboxCellClassName={styles.checkmarkCell}
                        checkButtonAriaLabel="select"
                        onRenderCheckbox={checkboxProps => {
                            return checkboxProps.checked ? (
                                <>
                                    <FontIcon iconName="CheckMark" className={styles.checkmark} />
                                </>
                            ) : null;
                        }}
                        onRenderItemColumn={item => {
                            return (
                                <DeviceDescription
                                    className={styles.row}
                                    {...item.metadata}
                                ></DeviceDescription>
                            );
                        }}
                        onActiveItemChanged={item => {
                            setSelectedDevice(item.metadata);
                        }}
                    />
                </>
            ),
            leftFooterButtonProps: {
                text: 'Close',
                onClick: _ => props.deps.closeApp(),
            },
            rightFooterButtonProps: {
                text: 'Next',
                disabled: selectedDevice == null,
                onClick: onNextButton,
            },
        };

        return <AndroidSetupStepLayout {...layoutProps}></AndroidSetupStepLayout>;
    },
);
