// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from '../../../../common/types/store-data/feature-flag-store-data';
import { UserConfigurationStoreData } from '../../../../common/types/store-data/user-configuration-store';

export type SettingsProps<TDeps> = {
    deps: TDeps;
    featureFlagData: FeatureFlagStoreData;
    userConfigurationStoreState: UserConfigurationStoreData;
};
