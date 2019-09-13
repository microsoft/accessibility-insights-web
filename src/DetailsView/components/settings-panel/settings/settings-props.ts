// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { LinkComponentDeps } from '../../../../common/components/telemetry-notice';
import { UserConfigMessageCreator } from '../../../../common/message-creators/user-config-message-creator';
import { FeatureFlagStoreData } from '../../../../common/types/store-data/feature-flag-store-data';
import { UserConfigurationStoreData } from '../../../../common/types/store-data/user-configuration-store';
import { IssueFilingServiceProvider } from './../../../../issue-filing/issue-filing-service-provider';

export type SettingsDeps = {
    userConfigMessageCreator: UserConfigMessageCreator;
    issueFilingServiceProvider: IssueFilingServiceProvider;
} & LinkComponentDeps;

export type SettingsProps = {
    deps: SettingsDeps;
    featureFlagData: FeatureFlagStoreData;
    userConfigurationStoreState: UserConfigurationStoreData;
};
