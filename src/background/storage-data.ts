// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { InstallationData } from './installation-data';
import { LaunchPanelType } from '../popup/components/popup-view';

export interface LocalStorageData {
    url?: string;
    featureFlags?: FeatureFlagStoreData;
    launchPanelSetting?: LaunchPanelType;
    installationData?: InstallationData;
}
