// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as leftNavSwitcherStyles from './left-nav-switcher.scss';
import * as headerSwitcherStyles from './switcher.scss';

export interface SwitcherStyleNames {
    dropdownOptionClassName: string;
    switcherClassName: string;
    dropdownClassName: string;
}

export const headerSwitcherStyleNames = {
    switcherClassName: headerSwitcherStyles.headerSwitcher,
    dropdownClassName: headerSwitcherStyles.headerSwitcherDropdown,
    dropdownOptionClassName: headerSwitcherStyles.switcherDropdownOption,
};

export const leftNavSwitcherStyleNames = {
    switcherClassName: leftNavSwitcherStyles.leftNavSwitcher,
    dropdownClassName: leftNavSwitcherStyles.leftNavSwitcherDropdown,
    dropdownOptionClassName: headerSwitcherStyles.switcherDropdownOption,
};
