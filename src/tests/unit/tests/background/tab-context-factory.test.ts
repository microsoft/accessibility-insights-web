// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Assessments } from 'assessments/assessments';
import { BrowserMessageBroadcasterFactory } from 'background/browser-message-broadcaster-factory';
import { ExtensionDetailsViewController } from 'background/extension-details-view-controller';
import { PersistedData } from 'background/get-persisted-data';
import { Interpreter } from 'background/interpreter';
import { CardSelectionStore } from 'background/stores/card-selection-store';
import { DetailsViewStore } from 'background/stores/details-view-store';
import { DevToolStore } from 'background/stores/dev-tools-store';
import { InspectStore } from 'background/stores/inspect-store';
import { NeedsReviewCardSelectionStore } from 'background/stores/needs-review-card-selection-store';
import { NeedsReviewScanResultStore } from 'background/stores/needs-review-scan-result-store';
import { TabStore } from 'background/stores/tab-store';
import { VisualizationScanResultStore } from 'background/stores/visualization-scan-result-store';
import { VisualizationStore } from 'background/stores/visualization-store';
import { TabContext } from 'background/tab-context';
import { TabContextFactory } from 'background/tab-context-factory';
import { TargetTabController } from 'background/target-tab-controller';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { WebVisualizationConfigurationFactory } from 'common/configs/web-visualization-configuration-factory';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { NotificationCreator } from 'common/notification-creator';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { UnifiedScanResultStore } from '../../../../background/stores/unified-scan-result-store';
import { UsageLogger } from '../../../../background/usage-logger';
import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';
import { VisualizationConfiguration } from '../../../../common/configs/visualization-configuration';
import { getStoreStateMessage } from '../../../../common/messages';
import { PromiseFactory } from '../../../../common/promises/promise-factory';
import { StoreNames } from '../../../../common/stores/store-names';
import { StoreUpdateMessage } from '../../../../common/types/store-update-message';
import { VisualizationType } from '../../../../common/types/visualization-type';

function getConfigs(visualizationType: VisualizationType): VisualizationConfiguration {
    return new WebVisualizationConfigurationFactory(Assessments).getConfiguration(
        visualizationType,
    );
}

describe('TabContextFactoryTest', () => {
    let mockDetailsViewController: IMock<ExtensionDetailsViewController>;
    let mockBrowserAdapter: IMock<BrowserAdapter>;
    let mockLogger: IMock<Logger>;
    let mockUsageLogger: IMock<UsageLogger>;
    let mockNotificationCreator: IMock<NotificationCreator>;
    let mockDBInstance: IMock<IndexedDBAPI>;
    let mockBroadcasterFactory: IMock<BrowserMessageBroadcasterFactory>;
    let persistedDataStub: PersistedData;

    beforeEach(() => {
        mockBrowserAdapter = Mock.ofType<BrowserAdapter>();
        mockLogger = Mock.ofType<Logger>();
        mockUsageLogger = Mock.ofType<UsageLogger>();
        mockDetailsViewController = Mock.ofType<ExtensionDetailsViewController>();
        mockNotificationCreator = Mock.ofType<NotificationCreator>();
        mockDBInstance = Mock.ofType<IndexedDBAPI>();
        mockBroadcasterFactory = Mock.ofType<BrowserMessageBroadcasterFactory>();
        persistedDataStub = {} as PersistedData;
    });

    it('createInterpreter', async () => {
        const tabId = 5;
        const broadcastMock = Mock.ofType<(message: Object) => Promise<void>>(
            null,
            MockBehavior.Strict,
        );
        const telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler);
        const targetTabControllerMock = Mock.ofType(TargetTabController);

        const storeNames: StoreNames[] = [
            StoreNames.VisualizationScanResultStore,
            StoreNames.VisualizationStore,
            StoreNames.TabStore,
            StoreNames.DevToolsStore,
            StoreNames.DetailsViewStore,
            StoreNames.InspectStore,
            StoreNames.PathSnippetStore,
            StoreNames.UnifiedScanResultStore,
            StoreNames.CardSelectionStore,
            StoreNames.NeedsReviewCardSelectionStore,
            StoreNames.NeedsReviewScanResultStore,
        ];

        storeNames.forEach(storeName => {
            broadcastMock
                .setup(bm =>
                    bm(
                        It.isObjectWith({
                            storeId: StoreNames[storeName],
                        } as StoreUpdateMessage<any>),
                    ),
                )
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
        });

        mockBrowserAdapter.setup(ba => ba.addListenerToTabsOnRemoved(It.isAny())).verifiable();
        mockBrowserAdapter.setup(ba => ba.addListenerToTabsOnUpdated(It.isAny())).verifiable();

        const visualizationConfigurationFactoryMock =
            Mock.ofType<VisualizationConfigurationFactory>();
        visualizationConfigurationFactoryMock
            .setup(vcfm => vcfm.getConfiguration(It.isAny()))
            .returns(theType => getConfigs(theType));

        mockBroadcasterFactory
            .setup(m => m.createTabSpecificBroadcaster(tabId))
            .returns(() => broadcastMock.object);

        const promiseFactoryMock = Mock.ofType<PromiseFactory>();
        const testObject = new TabContextFactory(
            visualizationConfigurationFactoryMock.object,
            telemetryEventHandlerMock.object,
            targetTabControllerMock.object,
            mockNotificationCreator.object,
            mockDetailsViewController.object,
            mockBrowserAdapter.object,
            mockBroadcasterFactory.object,
            promiseFactoryMock.object,
            mockLogger.object,
            mockUsageLogger.object,
            persistedDataStub,
            mockDBInstance.object,
            null,
        );

        const tabContext = testObject.createTabContext(tabId);

        broadcastMock.verifyAll();
        broadcastMock.reset();

        broadcastMock
            .setup(bm =>
                bm(
                    It.isObjectWith({
                        storeId: StoreNames[StoreNames.VisualizationScanResultStore],
                    } as StoreUpdateMessage<any>),
                ),
            )
            .returns(() => Promise.resolve())
            .verifiable(Times.once());

        const result = tabContext.interpreter.interpret({
            messageType: getStoreStateMessage(StoreNames.VisualizationScanResultStore),
            tabId: null,
        });
        await result.result;

        broadcastMock.verifyAll();
        expect(tabContext).toBeInstanceOf(TabContext);
        expect(tabContext.interpreter).toBeInstanceOf(Interpreter);
        expect(tabContext.stores.visualizationStore).toBeInstanceOf(VisualizationStore);
        expect(tabContext.stores.tabStore).toBeInstanceOf(TabStore);
        expect(tabContext.stores.visualizationScanResultStore).toBeInstanceOf(
            VisualizationScanResultStore,
        );
        expect(tabContext.stores.devToolStore).toBeInstanceOf(DevToolStore);
        expect(tabContext.stores.detailsViewStore).toBeInstanceOf(DetailsViewStore);
        expect(tabContext.stores.inspectStore).toBeInstanceOf(InspectStore);
        expect(tabContext.stores.unifiedScanResultStore).toBeInstanceOf(UnifiedScanResultStore);
        expect(tabContext.stores.cardSelectionStore).toBeInstanceOf(CardSelectionStore);
        expect(tabContext.stores.needsReviewCardSelectionStore).toBeInstanceOf(
            NeedsReviewCardSelectionStore,
        );
        expect(tabContext.stores.needsReviewScanResultStore).toBeInstanceOf(
            NeedsReviewScanResultStore,
        );

        broadcastMock.verifyAll();
    });
});
