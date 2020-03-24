// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { HeaderIcon, HeaderIconDeps } from 'common/components/header-icon';
import { NamedFC } from 'common/react/named-fc';
import { TextContent } from 'content/strings/text-content';
import * as styles from './header.scss';

export type HeaderDeps = { textContent: Pick<TextContent, 'applicationTitle'> } & HeaderIconDeps;

export type HeaderProps = {
    deps: HeaderDeps;
    items?: JSX.Element;
    farItems?: JSX.Element;
};

export const Header = NamedFC<HeaderProps>('Header', props => {
    const { applicationTitle } = props.deps.textContent;
    return (
        <header className={styles.headerBar}>
            <HeaderIcon deps={props.deps} />
            <span className={styles.headerTitle}>{applicationTitle}</span>
            <div>{props.items}</div>
            <div className={styles.spacer}></div>
            <div className={styles.farItems}>{props.farItems}</div>
        </header>
    );
});
