// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { LeftNavActionCreator } from 'electron/flux/action-creator/left-nav-action-creator';
import { LeftNavItem } from 'electron/types/left-nav-item';
import { TestConfig } from 'electron/types/test-config';

export const createLeftNavItems = (
    configs: TestConfig[],
    actionCreator: LeftNavActionCreator,
    featureFlagStoreData: FeatureFlagStoreData,
): LeftNavItem[] => {
    return configs
        .filter(config => filterForFeatureFlag(config, featureFlagStoreData))
        .map(config => createLeftNavItem(config, actionCreator));
};

const filterForFeatureFlag = (
    config: TestConfig,
    featureFlagStoreData: FeatureFlagStoreData,
): boolean => {
    return config.featureFlag === undefined || featureFlagStoreData[config.featureFlag];
};

const createLeftNavItem = (
    config: TestConfig,
    actionCreator: LeftNavActionCreator,
): LeftNavItem => {
    return {
        key: config.key,
        displayName: config.contentPageInfo.title,
        onSelect: () => actionCreator.itemSelected(config.key),
    };
};
