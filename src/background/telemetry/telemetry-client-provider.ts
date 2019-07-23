// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { config } from '../../common/configuration';
import { DateProvider } from '../../common/date-provider';
import { generateUID } from '../../common/uid-generator';
import { ApplicationBuildGenerator } from '../application-build-generator';
import { BrowserAdapter } from '../../common/browser-adapters/browser-adapter';
import { StorageAdapter } from '../../common/browser-adapters/storage-adapter';
import { InstallDataGenerator } from '../install-data-generator';
import { LocalStorageData } from '../storage-data';
import { AppInsightsTelemetryClient } from './app-insights-telemetry-client';
import { ApplicationTelemetryDataFactory } from './application-telemetry-data-factory';
import { NullTelemetryClient } from './null-telemetry-client';
import { TelemetryClient } from './telemetry-client';
import { TelemetryLogger } from './telemetry-logger';

export const getTelemetryClient = (
    userData: LocalStorageData,
    browserAdapter: BrowserAdapter,
    logger: TelemetryLogger,
    appInsights: Microsoft.ApplicationInsights.IAppInsights,
    storageAdapter: StorageAdapter,
): TelemetryClient => {
    const appInsightsInstrumentationKey = config.getOption('appInsightsInstrumentationKey');

    if (appInsightsInstrumentationKey == null) {
        return new NullTelemetryClient(logger);
    }

    const installDataGenerator = new InstallDataGenerator(
        userData.installationData,
        generateUID,
        DateProvider.getCurrentDate,
        storageAdapter,
    );
    const applicationBuildGenerator = new ApplicationBuildGenerator();
    const coreTelemetryDataFactory = new ApplicationTelemetryDataFactory(browserAdapter, applicationBuildGenerator, installDataGenerator);

    return new AppInsightsTelemetryClient(appInsights, coreTelemetryDataFactory, logger);
};
