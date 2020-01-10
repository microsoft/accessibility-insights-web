// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import * as styles from './header.scss';

export interface HeaderProps {
    title: string;
    subtitle?: React.ReactChild;
    children?: JSX.Element;
}

export const Header = NamedFC<HeaderProps>('Header', props => {
    return (
        <header className={styles.launchPanelHeader}>
            <div className="ms-Grid-row">
                <div
                    role="heading"
                    aria-level={1}
                    className="ms-Grid-col ms-u-sm10 ms-fontColor-neutralPrimary ms-font-xl old"
                >
                    {props.title}
                </div>
                {props.children}
            </div>
            <div className={css(styles.headerSubtitle, 'ms-fontWeight-semilight ms-fontSize-xs')}>
                {props.subtitle}
            </div>
        </header>
    );
});
