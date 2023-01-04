// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CheckboxVisibility,
    DefaultButton,
    DetailsList,
    FontIcon,
    IObjectWithKey,
    ISelection,
    Selection,
    SelectionMode,
} from '@fluentui/react';
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { rescanAutomationId } from 'electron/views/device-connect-view/components/automation-ids';
import * as React from 'react';
import { AndroidSetupStepLayout, AndroidSetupStepLayoutProps } from './android-setup-step-layout';
import { CommonAndroidSetupStepProps } from './android-setup-types';
import { DeviceDescription } from './device-description';
import styles from './prompt-choose-device-step.scss';

interface PromptChooseDeviceListItem extends IObjectWithKey {
    deviceInfo: DeviceInfo;
}

export type PromptChooseDeviceStepState = {
    selectedDevice: PromptChooseDeviceListItem | null;
};

export class PromptChooseDeviceStep extends React.Component<
    CommonAndroidSetupStepProps,
    PromptChooseDeviceStepState
> {
    private selection: ISelection<PromptChooseDeviceListItem>;
    constructor(props) {
        super(props);

        this.selection = new Selection<PromptChooseDeviceListItem>({
            onSelectionChanged: () => {
                const details = this.selection.getSelection();
                if (details.length > 0) {
                    this.setState({ selectedDevice: details[0] as PromptChooseDeviceListItem });
                }
            },
            getKey: item => item.deviceInfo.id,
        });

        this.setInitialListState();
    }

    public render(): JSX.Element {
        const listItems = this.getListItems();

        const layoutProps: AndroidSetupStepLayoutProps = {
            headerText: 'Choose which device to use',
            children: (
                <>
                    <div className={styles.deviceCount}>
                        {listItems.length} Android devices or emulators connected
                    </div>
                    <DefaultButton
                        data-automation-id={rescanAutomationId}
                        text="Rescan"
                        onClick={this.props.deps.androidSetupActionCreator.rescan}
                    />
                    <DetailsList
                        setKey={'devices'}
                        compact={true}
                        ariaLabelForGrid="android devices"
                        className={styles.phoneList}
                        items={listItems}
                        selection={this.selection}
                        selectionMode={SelectionMode.single}
                        checkboxVisibility={CheckboxVisibility.always}
                        isHeaderVisible={false}
                        checkboxCellClassName={styles.checkmarkCell}
                        checkButtonAriaLabel="select"
                        onRenderCheckbox={checkboxProps => {
                            return checkboxProps?.checked ? (
                                <>
                                    <FontIcon iconName="CheckMark" className={styles.checkmark} />
                                </>
                            ) : null;
                        }}
                        onRenderItemColumn={item => {
                            return (
                                <DeviceDescription
                                    className={styles.row}
                                    deviceInfo={item.deviceInfo}
                                ></DeviceDescription>
                            );
                        }}
                    />
                </>
            ),
            leftFooterButtonProps: {
                text: 'Close',
                onClick: _ => this.props.deps.closeApp(),
            },
            rightFooterButtonProps: {
                text: 'Next',
                disabled: this.state.selectedDevice === null,
                onClick: _ => {
                    const { selectedDevice } = this.state;
                    if (selectedDevice != null) {
                        this.props.deps.androidSetupActionCreator.setSelectedDevice(
                            selectedDevice.deviceInfo,
                        );
                    }
                },
            },
        };

        return <AndroidSetupStepLayout {...layoutProps}></AndroidSetupStepLayout>;
    }

    private getListItems(): PromptChooseDeviceListItem[] {
        const devices: DeviceInfo[] = this.props.androidSetupStoreData.availableDevices ?? [];
        const listItems = devices.map(m => ({ deviceInfo: m }));
        return listItems;
    }

    private setInitialListState(): void {
        const listItems = this.getListItems();
        let selectedDevice: PromptChooseDeviceListItem | null = null;

        if (listItems.length > 0) {
            // We always select index 0 in the list.
            this.selection.setChangeEvents(false, true);
            this.selection.setItems(listItems, false);
            this.selection.selectToIndex(0);
            this.selection.setChangeEvents(true, true);
            selectedDevice = listItems[0];
        }

        this.state = { selectedDevice: selectedDevice };
    }
}
