// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Switcher, SwitcherProps, SwitcherStyleNames } from 'DetailsView/components/switcher';
import * as React from 'react';
import * as leftNavSwitcherStyles from './left-nav-switcher.scss';
import * as headerSwitcherStyles from './switcher.scss';

export function getHeaderSwitcher(props: Omit<SwitcherProps, 'styles'>): JSX.Element {
    const styles: SwitcherStyleNames = {
        switcherClassName: headerSwitcherStyles.headerSwitcher,
        dropdownClassName: headerSwitcherStyles.headerSwitcherDropdown,
        dropdownOptionClassName: headerSwitcherStyles.switcherDropdownOption,
    };
    return <Switcher styles={styles} {...props} />;
}

export function getLeftNavSwitcher(props: Omit<SwitcherProps, 'styles'>): JSX.Element {
    const styles: SwitcherStyleNames = {
        switcherClassName: leftNavSwitcherStyles.leftNavSwitcher,
        dropdownClassName: leftNavSwitcherStyles.leftNavSwitcherDropdown,
        dropdownOptionClassName: headerSwitcherStyles.switcherDropdownOption,
    };
    return <Switcher styles={styles} {...props} />;
}
