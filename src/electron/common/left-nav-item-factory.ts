// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { LeftNavActionCreator } from 'electron/flux/action-creator/left-nav-action-creator';
import { TabStopsActionCreator } from 'electron/flux/action/tab-stops-action-creator';
import { LeftNavItem } from 'electron/types/left-nav-item';
import { TestConfig } from 'electron/types/test-config';

export const createLeftNavItems = (
    configs: TestConfig[],
    leftNavActionCreator: LeftNavActionCreator,
    tabStopsActionCreator: TabStopsActionCreator,
): LeftNavItem[] => {
    return configs.map(config =>
        createLeftNavItem(config, leftNavActionCreator, tabStopsActionCreator),
    );
};

const createLeftNavItem = (
    config: TestConfig,
    actionCreator: LeftNavActionCreator,
    tabStopsActionCreator: TabStopsActionCreator,
): LeftNavItem => {
    return {
        key: config.key,
        displayName: config.contentPageInfo.title,
        featureFlag: config.featureFlag,
        onSelect: () => {
            actionCreator.itemSelected(config.key);
            tabStopsActionCreator.resetTabStopsToDefaultState();
        },
    };
};
