// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IconButton, css } from '@fluentui/react';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import styles from './left-nav-hamburger-button.scss';

export type LeftNavHamburgerButtonProps = {
    ariaLabel: string;
    isSideNavOpen: boolean;
    setSideNavOpen: (isOpen: boolean, event?: React.MouseEvent<any>) => void;
    className?: string;
};

export const leftNavHamburgerButtonAutomationId = 'left-nav-hamburger-button';

export const LeftNavHamburgerButton = NamedFC<LeftNavHamburgerButtonProps>(
    'LeftNavHamburgerButton',
    props => {
        const onClick = (event: React.MouseEvent<any>) => {
            props.setSideNavOpen(!props.isSideNavOpen, event);
        };

        return (
            <IconButton
                className={css(styles.leftNavHamburgerButton, props.className)}
                iconProps={{ iconName: 'GlobalNavButton' }}
                ariaLabel={props.ariaLabel}
                aria-expanded={props.isSideNavOpen}
                data-automation-id={leftNavHamburgerButtonAutomationId}
                onClick={onClick}
            />
        );
    },
);
