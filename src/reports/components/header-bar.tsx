// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { BrandWhite } from 'icons/brand/white/brand-white';
import * as React from 'react';
import styles from './header-bar.scss';

export type HeaderBarProps = {
    headerText: string;
};

export const HeaderBar = NamedFC<HeaderBarProps>('HeaderBar', props => {
    return (
        <div className={styles.reportHeaderBar}>
            <BrandWhite />
            <div className={styles.headerText}>{props.headerText}</div>
        </div>
    );
});
