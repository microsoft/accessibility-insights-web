// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppInsightsTelemetryClient } from 'background/telemetry/app-insights-telemetry-client';
import { NullTelemetryClient } from 'background/telemetry/null-telemetry-client';
import { getTelemetryClient } from 'background/telemetry/telemetry-client-provider';
import { TelemetryLogger } from 'background/telemetry/telemetry-logger';
import { Mock } from 'typemoq';

import { InstallationData } from '../../../../../background/installation-data';
import { AppDataAdapter } from '../../../../../common/browser-adapters/app-data-adapter';
import { StorageAdapter } from '../../../../../common/browser-adapters/storage-adapter';
import { configMutator } from '../../../../../common/configuration';

describe('TelemetryClientProvider', () => {
    beforeEach(() => configMutator.reset());
    afterAll(() => configMutator.reset());

    test('with instrumentation key', () => {
        configMutator.setOption('appInsightsInstrumentationKey', 'test-key');

        const appAdapterMock = Mock.ofType<AppDataAdapter>();

        appAdapterMock.setup(adapter => adapter.getVersion()).returns(() => 'test');

        const result = getTelemetryClient(
            {} as InstallationData,
            appAdapterMock.object,
            Mock.ofType<TelemetryLogger>().object,
            Mock.ofType<Microsoft.ApplicationInsights.IAppInsights>().object,
            Mock.ofType<StorageAdapter>().object,
        );

        expect(result).toBeInstanceOf(AppInsightsTelemetryClient);
    });

    test('without instrumentation key', () => {
        configMutator.setOption('appInsightsInstrumentationKey', null);

        const result = getTelemetryClient(
            {} as InstallationData,
            Mock.ofType<AppDataAdapter>().object,
            Mock.ofType<TelemetryLogger>().object,
            Mock.ofType<Microsoft.ApplicationInsights.IAppInsights>().object,
            Mock.ofType<StorageAdapter>().object,
        );

        expect(result).toBeInstanceOf(NullTelemetryClient);
    });
});
