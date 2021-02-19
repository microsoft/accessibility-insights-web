// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { DeviceFocusControllerFactory } from 'electron/platform/android/device-focus-controller-factory';
import { AdbWrapperHolder } from 'electron/platform/android/setup/adb-wrapper-holder';
import * as styles from 'electron/views/tab-stops/virtual-keyboard-buttons.scss';
import { Button, css, Icon } from 'office-ui-fabric-react';
import * as React from 'react';

export type VirtualKeyboardButtonsDeps = {
    deviceFocusControllerFactory: DeviceFocusControllerFactory;
    adbWrapperHolder: AdbWrapperHolder;
};

export type VirtualKeyboardButtonsProps = {
    deps: VirtualKeyboardButtonsDeps;
    narrowModeStatus: NarrowModeStatus;
    deviceId: string;
};

export const buildKeyboardButtonAutomationId = (text: string) => `virtual-keyboard-${text}-button`;

export const VirtualKeyboardButtons = NamedFC<VirtualKeyboardButtonsProps>(
    'VirtualKeyboardButtons',
    props => {
        const getArrowButton = (text: string, onClick: () => void, className?: string) => {
            return (
                <Button
                    onClick={onClick}
                    className={styles.button}
                    data-automation-id={buildKeyboardButtonAutomationId(text)}
                    primary
                >
                    <span className={styles.innerButtonContainer}>
                        <Icon iconName="upArrow" className={className} />
                        {text}
                    </span>
                </Button>
            );
        };

        const getLargeButton = (text: string, onClick: () => void, className?: string) => {
            return (
                <Button
                    onClick={onClick}
                    className={css(className, styles.button)}
                    data-automation-id={buildKeyboardButtonAutomationId(text)}
                    primary
                >
                    <span className={styles.innerButtonContainer}>{text}</span>
                </Button>
            );
        };

        const deps = props.deps;
        const deviceFocusController = deps.deviceFocusControllerFactory.getDeviceFocusController(
            deps.adbWrapperHolder.getAdb(),
        );
        deviceFocusController.setDeviceId(props.deviceId);
        const isVirtualKeyboardCollapsed = props.narrowModeStatus.isVirtualKeyboardCollapsed;
        const upButton = getArrowButton('Up', deviceFocusController.sendUpKey);
        const leftButton = getArrowButton('Left', deviceFocusController.sendLeftKey, styles.left);
        const rightButton = getArrowButton(
            'Right',
            deviceFocusController.sendRightKey,
            styles.right,
        );
        const downButton = getArrowButton('Down', deviceFocusController.sendDownKey, styles.down);
        const tabButton = getLargeButton(
            'Tab',
            deviceFocusController.sendTabKey,
            isVirtualKeyboardCollapsed ? undefined : styles.rectangleButton,
        );
        const enterButton = getLargeButton(
            'Enter',
            deviceFocusController.sendEnterKey,
            isVirtualKeyboardCollapsed ? undefined : styles.rectangleButton,
        );

        if (isVirtualKeyboardCollapsed) {
            return (
                <div className={styles.virtualKeyboardButtons}>
                    {tabButton}
                    {upButton}
                    {leftButton}
                    {downButton}
                    {rightButton}
                    {enterButton}
                </div>
            );
        }

        return (
            <div className={styles.virtualKeyboardButtons}>
                {tabButton}
                <div className={styles.arrowButtonsContainer}>
                    {upButton}
                    <div className={styles.bottomRowButtons}>
                        {leftButton}
                        {downButton}
                        {rightButton}
                    </div>
                </div>
                {enterButton}
            </div>
        );
    },
);
