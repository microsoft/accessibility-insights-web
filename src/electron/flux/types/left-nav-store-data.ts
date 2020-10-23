// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LeftNavItemKey } from 'electron/types/left-nav-item-key';

export type LeftNavStoreData = {
    selectedKey: LeftNavItemKey;
    leftNavVisible: boolean;
};
