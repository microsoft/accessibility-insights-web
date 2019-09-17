// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstallationData } from '../../background/installation-data';
import { LocalStorageData } from '../../background/storage-data';
import { getTelemetryClient } from '../../background/telemetry/telemetry-client-provider';
import { TelemetryLogger } from '../../background/telemetry/telemetry-logger';
import { AppDataAdapter } from '../../common/browser-adapters/app-data-adapter';
import { StorageAdapter } from '../../common/browser-adapters/storage-adapter';

export const getTelemetryClientWrapper = (
    installationData: InstallationData,
    appDataAdapter: AppDataAdapter,
    logger: TelemetryLogger,
    appInsights: Microsoft.ApplicationInsights.IAppInsights,
    storageAdapter: StorageAdapter,
) => {
    const userData: LocalStorageData = {
        installationData,
    };
    return getTelemetryClient(userData, appDataAdapter, logger, appInsights, storageAdapter);
};
