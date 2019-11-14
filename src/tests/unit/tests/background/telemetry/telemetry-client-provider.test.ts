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
    const installationData: InstallationData = {
        id: 'test-id',
        month: 9,
        year: 2019,
    };

    const applicationName = 'test application name';

    beforeEach(() => configMutator.reset());
    afterAll(() => configMutator.reset());

    it('builds a telemetry client using the instrumentation key', () => {
        configMutator.setOption('appInsightsInstrumentationKey', 'test-key');

        const appAdapterMock = Mock.ofType<AppDataAdapter>();

        appAdapterMock
            .setup(adapter => adapter.getVersion())
            .returns(() => 'test');

        const result = getTelemetryClient(
            applicationName,
            installationData,
            appAdapterMock.object,
            Mock.ofType<TelemetryLogger>().object,
            Mock.ofType<Microsoft.ApplicationInsights.IAppInsights>().object,
            Mock.ofType<StorageAdapter>().object,
        );

        expect(result).toBeInstanceOf(AppInsightsTelemetryClient);
    });

    it('builds a telemetry client when there is no instrumentation key', () => {
        configMutator.setOption('appInsightsInstrumentationKey', null);

        const result = getTelemetryClient(
            applicationName,
            installationData,
            Mock.ofType<AppDataAdapter>().object,
            Mock.ofType<TelemetryLogger>().object,
            Mock.ofType<Microsoft.ApplicationInsights.IAppInsights>().object,
            Mock.ofType<StorageAdapter>().object,
        );

        expect(result).toBeInstanceOf(NullTelemetryClient);
    });
});
