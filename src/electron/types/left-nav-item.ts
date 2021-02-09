// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LeftNavItemKey } from './left-nav-item-key';

export type LeftNavItem = {
    key: LeftNavItemKey;
    displayName: string;
    featureFlag?: string;
    onSelect: () => void;
};
