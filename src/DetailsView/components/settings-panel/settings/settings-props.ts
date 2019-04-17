// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfoProvider } from '../../../../common/environment-info-provider';
import { UserConfigMessageCreator } from '../../../../common/message-creators/user-config-message-creator';
import { FeatureFlagStoreData } from '../../../../common/types/store-data/feature-flag-store-data';
import { UserConfigurationStoreData } from '../../../../common/types/store-data/user-configuration-store';
import { BugFilingServiceProvider } from './../../../../bug-filing/bug-filing-service-provider';

export type SettingsDeps = {
    userConfigMessageCreator: UserConfigMessageCreator;
    bugFilingServiceProvider: BugFilingServiceProvider;
};

export type SettingsProps = {
    deps: SettingsDeps;
    featureFlagData: FeatureFlagStoreData;
    userConfigurationStoreState: UserConfigurationStoreData;
};
