// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstallationData } from 'background/installation-data';
import { AppInsightsTelemetryClient } from 'background/telemetry/app-insights-telemetry-client';
import { ChainnedTelemetryClient } from 'background/telemetry/chainned-telemetry-client';
import { ConsoleTelemetryClient } from 'background/telemetry/console-telemetry-client';
import { getTelemetryClient } from 'background/telemetry/telemetry-client-provider';
import { TelemetryLogger } from 'background/telemetry/telemetry-logger';
import { AppDataAdapter } from 'common/browser-adapters/app-data-adapter';
import { StorageAdapter } from 'common/browser-adapters/storage-adapter';
import { configMutator } from 'common/configuration';
import { GlobalMock, GlobalScope, IGlobalMock, It, Mock, Times } from 'typemoq';

describe('TelemetryClientProvider', () => {
    const installationData: InstallationData = {
        id: 'test-id',
        month: 9,
        year: 2019,
    };

    const applicationName = 'test application name';

    type FromArray = typeof ChainnedTelemetryClient.fromArray;
    let fromArrayMock: IGlobalMock<FromArray>;

    beforeEach(() => {
        fromArrayMock = GlobalMock.ofInstance(
            ChainnedTelemetryClient.fromArray,
            'fromArray',
            ChainnedTelemetryClient,
        );
        fromArrayMock.callBase = true;
        configMutator.reset();
    });

    afterAll(() => configMutator.reset());

    it('builds a telemetry client using the instrumentation key', () => {
        configMutator.setOption('appInsightsInstrumentationKey', 'test-key');

        const appAdapterMock = Mock.ofType<AppDataAdapter>();

        appAdapterMock.setup(adapter => adapter.getVersion()).returns(() => 'test');

        GlobalScope.using(fromArrayMock).with(() => {
            const result = getTelemetryClient(
                applicationName,
                installationData,
                appAdapterMock.object,
                Mock.ofType<TelemetryLogger>().object,
                Mock.ofType<Microsoft.ApplicationInsights.IAppInsights>().object,
                Mock.ofType<StorageAdapter>().object,
            );

            expect(result).toBeInstanceOf(ChainnedTelemetryClient);
        });

        fromArrayMock.verify(
            fromArray =>
                fromArray(
                    It.is(client => client instanceof ConsoleTelemetryClient),
                    It.is(client => client instanceof AppInsightsTelemetryClient),
                ),
            Times.once(),
        );
    });

    it('builds a telemetry client when there is no instrumentation key', () => {
        configMutator.setOption('appInsightsInstrumentationKey', null);

        GlobalScope.using(fromArrayMock).with(() => {
            const result = getTelemetryClient(
                applicationName,
                installationData,
                Mock.ofType<AppDataAdapter>().object,
                Mock.ofType<TelemetryLogger>().object,
                Mock.ofType<Microsoft.ApplicationInsights.IAppInsights>().object,
                Mock.ofType<StorageAdapter>().object,
            );

            expect(result).toBeInstanceOf(ChainnedTelemetryClient);
        });

        fromArrayMock.verify(
            fromArray =>
                fromArray(
                    It.is(client => client instanceof ConsoleTelemetryClient),
                    undefined,
                ),
            Times.once(),
        );
    });
});
