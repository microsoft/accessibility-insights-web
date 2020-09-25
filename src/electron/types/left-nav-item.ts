// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LeftNavItemKey } from 'electron/platform/android/types/left-nav-item-key';

export type LeftNavItem<KeyT> = {
    key: KeyT;
    displayName: string;
    onSelect: () => void;
};
