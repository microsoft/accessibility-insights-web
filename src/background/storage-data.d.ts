// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from './../types/store-data/feature-flag-store-data.d';
import { InstallationData } from './installation-data';

export interface LocalStorageData {
    url?: string;
    featureFlags?: FeatureFlagStoreData;
    launchPanelSetting?: LaunchPanelType;
    installationData?: InstallationData;
}
