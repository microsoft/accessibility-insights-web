import { LeftNavActionCreator } from 'electron/flux/action-creator/left-nav-action-creator';
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TestConfig } from 'electron/types/test-config';
import { LeftNavItem } from 'electron/types/left-nav-item';

export const createLeftNavItems = (
    configs: TestConfig[],
    actionCreator: LeftNavActionCreator,
): LeftNavItem[] => {
    return configs.map(config => createLeftNavItem(config, actionCreator));
};

const createLeftNavItem = (
    config: TestConfig,
    actionCreator: LeftNavActionCreator,
): LeftNavItem => {
    return {
        key: config.key,
        displayName: config.title,
        onSelect: () => actionCreator.itemSelected(config.key),
    };
};
