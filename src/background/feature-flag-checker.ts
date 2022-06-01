// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { StoreProxy } from 'common/store-proxy';
import { DictionaryStringTo } from 'types/common-types';

export type FeatureFlagChecker = {
    isEnabled: (feature: string) => boolean;
};

export const getStoreProxyFeatureFlagChecker: (
    featureFlagStoreProxy: StoreProxy<DictionaryStringTo<boolean>>,
) => FeatureFlagChecker = (featureFlagStoreProxy: StoreProxy<DictionaryStringTo<boolean>>) => {
    return {
        isEnabled: function (feature: string): boolean {
            return (
                featureFlagStoreProxy?.getState() !== undefined &&
                featureFlagStoreProxy.getState()[feature] === true
            );
        },
    };
};
