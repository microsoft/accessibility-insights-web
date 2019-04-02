// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { LaunchPanelType } from '../popup/components/popup-view';
import { InstallationData } from './installation-data';

export interface LocalStorageData {
    url?: string;
    featureFlags?: FeatureFlagStoreData;
    launchPanelSetting?: LaunchPanelType;
    installationData?: InstallationData;
}
