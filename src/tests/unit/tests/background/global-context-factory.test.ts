// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PersistedData } from 'background/get-persisted-data';
import { GlobalContext } from 'background/global-context';
import { GlobalContextFactory } from 'background/global-context-factory';
import { Interpreter } from 'background/interpreter';
import { LocalStorageData } from 'background/storage-data';
import { CommandStore } from 'background/stores/global/command-store';
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { LaunchPanelStore } from 'background/stores/global/launch-panel-store';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { Logger } from 'common/logging/logger';
import { IMock, It, Mock } from 'typemoq';
import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';
import { CommandsAdapter } from '../../../../common/browser-adapters/commands-adapter';
import { StorageAdapter } from '../../../../common/browser-adapters/storage-adapter';
import { IndexedDBAPI } from '../../../../common/indexedDB/indexedDB';
import { TelemetryDataFactory } from '../../../../common/telemetry-data-factory';
import { IssueFilingServiceProvider } from '../../../../issue-filing/issue-filing-service-provider';
import { CreateTestAssessmentProvider } from '../../common/test-assessment-provider';

describe('GlobalContextFactoryTest', () => {
    let browserAdapterMock: IMock<BrowserAdapter>;
    let commandsAdapterMock: IMock<CommandsAdapter>;
    let storageAdapterMock: IMock<StorageAdapter>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let telemetryDataFactoryMock: IMock<TelemetryDataFactory>;
    let issueFilingServiceProviderMock: IMock<IssueFilingServiceProvider>;
    let loggerMock: IMock<Logger>;

    let userDataStub: LocalStorageData;
    let mockDBInstance: IMock<IndexedDBAPI>;
    let persistedDataStub: PersistedData;

    beforeAll(() => {
        storageAdapterMock = Mock.ofType<StorageAdapter>();
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        commandsAdapterMock = Mock.ofType<CommandsAdapter>();
        loggerMock = Mock.ofType<Logger>();
        browserAdapterMock
            .setup(adapter => adapter.sendMessageToFrames(It.isAny()))
            .returns(() => Promise.resolve());
        browserAdapterMock
            .setup(adapter => adapter.sendMessageToTab(It.isAny(), It.isAny()))
            .returns(() => Promise.resolve());
        telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler);
        telemetryDataFactoryMock = Mock.ofType(TelemetryDataFactory);
        issueFilingServiceProviderMock = Mock.ofType(IssueFilingServiceProvider);

        userDataStub = {};
        persistedDataStub = {} as PersistedData;
        mockDBInstance = Mock.ofType<IndexedDBAPI>();
        mockDBInstance
            .setup(mdb => mdb.setItem(It.isAny(), It.isAny()))
            .returns(_ => Promise.resolve(true));
    });

    it('createContext', async () => {
        const globalContext = await GlobalContextFactory.createContext(
            browserAdapterMock.object,
            telemetryEventHandlerMock.object,
            userDataStub,
            CreateTestAssessmentProvider(),
            CreateTestAssessmentProvider(),
            telemetryDataFactoryMock.object,
            mockDBInstance.object,
            persistedDataStub,
            issueFilingServiceProviderMock.object,
            storageAdapterMock.object,
            commandsAdapterMock.object,
            loggerMock.object,
        );

        expect(globalContext).toBeInstanceOf(GlobalContext);
        expect(globalContext.interpreter).toBeInstanceOf(Interpreter);
        expect(globalContext.stores.commandStore).toBeInstanceOf(CommandStore);
        expect(globalContext.stores.featureFlagStore).toBeInstanceOf(FeatureFlagStore);
        expect(globalContext.stores.launchPanelStore).toBeInstanceOf(LaunchPanelStore);
    });
});
