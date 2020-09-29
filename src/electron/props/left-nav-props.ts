// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LeftNavItem } from 'electron/types/left-nav-item';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';

export type LeftNavProps = {
    selectedKey: LeftNavItemKey;
    items: LeftNavItem[];
};
