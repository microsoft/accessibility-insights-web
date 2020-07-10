// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import {
    CheckboxVisibility,
    DefaultButton,
    DetailsList,
    FontIcon,
    ISelection,
    Selection,
    SelectionMode,
} from 'office-ui-fabric-react';
import * as React from 'react';
import { AndroidSetupStepLayout, AndroidSetupStepLayoutProps } from './android-setup-step-layout';
import { CommonAndroidSetupStepProps } from './android-setup-types';
import { DeviceDescription } from './device-description';
import * as styles from './prompt-choose-device-step.scss';

export type PromptChooseDeviceStepState = {
    selectedDevice: DeviceInfo;
};

export class PromptChooseDeviceStep extends React.Component<
    CommonAndroidSetupStepProps,
    PromptChooseDeviceStepState
> {
    private selection: ISelection;
    constructor(props) {
        super(props);

        const listItems = this.getListItems();
        this.state = { selectedDevice: listItems.length > 0 ? listItems[0] : null };

        this.selection = new Selection({
            onSelectionChanged: () => {
                const details = this.selection.getSelection();
                if (details.length > 0) {
                    this.setState({ selectedDevice: details[0] as DeviceInfo });
                }
            },
        });

        this.selectItemZeroInList(listItems);
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
                        data-automation-id={'rescan'}
                        text="Rescan"
                        onClick={this.props.deps.androidSetupActionCreator.rescan}
                    />
                    <DetailsList
                        setKey={'devices'}
                        compact={true}
                        ariaLabel="android devices"
                        className={styles.phoneList}
                        items={listItems}
                        selection={this.selection}
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
                    const selectedDevice: DeviceInfo = this.state.selectedDevice['metadata'];
                    this.props.deps.androidSetupActionCreator.setSelectedDevice(selectedDevice);
                },
            },
        };

        return <AndroidSetupStepLayout {...layoutProps}></AndroidSetupStepLayout>;
    }

    private getListItems(): any {
        const devices: DeviceInfo[] = this.props.androidSetupStoreData.availableDevices;
        const items = devices.map(m => ({ metadata: m }));
        return items;
    }

    private selectItemZeroInList(items: any): void {
        if (items.length > 0) {
            this.selection.setChangeEvents(false, true);
            this.selection.setItems(items, false);
            this.selection.selectToIndex(0);
            this.selection.setChangeEvents(true, true);
        }
    }
}
