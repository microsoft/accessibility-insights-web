// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DefaultButton, css, Icon } from '@fluentui/react';
import { NamedFC } from 'common/react/named-fc';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { TabStopsActionCreator } from 'electron/flux/action/tab-stops-action-creator';
import styles from 'electron/views/tab-stops/virtual-keyboard-buttons.scss';
import * as React from 'react';

export type VirtualKeyboardButtonsDeps = {
    tabStopsActionCreator: TabStopsActionCreator;
};

export type VirtualKeyboardButtonsProps = {
    deps: VirtualKeyboardButtonsDeps;
    narrowModeStatus: NarrowModeStatus;
};

export const buildKeyboardButtonAutomationId = (text: string) => `virtual-keyboard-${text}-button`;

export const VirtualKeyboardButtons = NamedFC<VirtualKeyboardButtonsProps>(
    'VirtualKeyboardButtons',
    props => {
        const getArrowButton = (text: string, onClick: () => void, className?: string) => {
            return (
                <DefaultButton
                    onClick={onClick}
                    className={styles.button}
                    data-automation-id={buildKeyboardButtonAutomationId(text)}
                    primary
                >
                    <span className={styles.innerButtonContainer}>
                        <Icon iconName="Up" className={className} />
                        {text}
                    </span>
                </DefaultButton>
            );
        };

        const getLargeButton = (text: string, onClick: () => void, className?: string) => {
            return (
                <DefaultButton
                    onClick={onClick}
                    className={css(className, styles.button)}
                    data-automation-id={buildKeyboardButtonAutomationId(text)}
                    primary
                >
                    <span className={styles.innerButtonContainer}>{text}</span>
                </DefaultButton>
            );
        };

        const deps = props.deps;
        const tabStopsActionCreator = deps.tabStopsActionCreator;
        const isVirtualKeyboardCollapsed = props.narrowModeStatus.isVirtualKeyboardCollapsed;
        const upButton = getArrowButton('Up', tabStopsActionCreator.sendUpKey);
        const leftButton = getArrowButton('Left', tabStopsActionCreator.sendLeftKey, styles.left);
        const rightButton = getArrowButton(
            'Right',
            tabStopsActionCreator.sendRightKey,
            styles.right,
        );
        const downButton = getArrowButton('Down', tabStopsActionCreator.sendDownKey, styles.down);
        const tabButton = getLargeButton(
            'Tab',
            tabStopsActionCreator.sendTabKey,
            isVirtualKeyboardCollapsed ? undefined : styles.rectangleButton,
        );
        const enterButton = getLargeButton(
            'Enter',
            tabStopsActionCreator.sendEnterKey,
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
