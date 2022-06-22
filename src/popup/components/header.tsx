// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import styles from './header.scss';

export interface HeaderProps {
    title: string;
    subtitle?: React.ReactChild;
    children?: JSX.Element;
}

export const Header = NamedFC<HeaderProps>('Header', props => {
    return (
        <header className={styles.launchPanelHeader}>
            <h1 className={styles.title}>{props.title}</h1>
            <div className={styles.children}>{props.children}</div>
            <div className={styles.subtitle}>{props.subtitle}</div>
        </header>
    );
});
