// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import * as styles from 'electron/views/virtual-keyboard/virtual-keyboard-buttons.scss';
import { Button, css, Icon } from 'office-ui-fabric-react';
import * as React from 'react';

export type VirtualKeyboardButtonsProps = { narrowModeStatus: NarrowModeStatus };
export const VirtualKeyboardButtons = NamedFC<VirtualKeyboardButtonsProps>(
    'VirtualKeyboardButtons',
    props => {
        const getArrowButton = (text: string, className?: string) => {
            return (
                <Button className={styles.button} primary>
                    <span className={styles.innerButtonContainer}>
                        <Icon iconName="upArrow" className={className} />
                        {text}
                    </span>
                </Button>
            );
        };

        const getLargeButton = (text: string, className?: string) => {
            return (
                <Button className={css(className, styles.button)} primary>
                    <span className={styles.innerButtonContainer}>{text}</span>
                </Button>
            );
        };

        const isVirtualKeyboardCollapsed = props.narrowModeStatus.isVirtualKeyboardCollapsed;
        const upButton = getArrowButton('Up');
        const leftButton = getArrowButton('Left', styles.left);
        const rightButton = getArrowButton('Right', styles.right);
        const downButton = getArrowButton('Down', styles.down);
        const tabButton = getLargeButton(
            'Tab',
            isVirtualKeyboardCollapsed ? undefined : styles.rectangleButton,
        );
        const enterButton = getLargeButton(
            'Enter',
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
