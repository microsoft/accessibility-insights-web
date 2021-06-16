// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ExtensionDetailsViewController } from 'background/extension-details-view-controller';
import { Interpreter } from 'background/interpreter';
import { CardSelectionStore } from 'background/stores/card-selection-store';
import { DetailsViewStore } from 'background/stores/details-view-store';
import { DevToolStore } from 'background/stores/dev-tools-store';
import { InspectStore } from 'background/stores/inspect-store';
import { TabStore } from 'background/stores/tab-store';
import { VisualizationScanResultStore } from 'background/stores/visualization-scan-result-store';
import { VisualizationStore } from 'background/stores/visualization-store';
import { TabContext } from 'background/tab-context';
import { TabContextFactory } from 'background/tab-context-factory';
import { TargetTabController } from 'background/target-tab-controller';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { WebVisualizationConfigurationFactory } from 'common/configs/web-visualization-configuration-factory';
import { Logger } from 'common/logging/logger';
import { NotificationCreator } from 'common/notification-creator';
import { WindowUtils } from 'common/window-utils';
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
    return new WebVisualizationConfigurationFactory().getConfiguration(visualizationType);
}

describe('TabContextFactoryTest', () => {
    let mockDetailsViewController: IMock<ExtensionDetailsViewController>;
    let mockBrowserAdapter: IMock<BrowserAdapter>;
    let mockLogger: IMock<Logger>;
    let mockUsageLogger: IMock<UsageLogger>;
    let mockNotificationCreator: IMock<NotificationCreator>;
    let mockWindowUtils: IMock<WindowUtils>;

    beforeEach(() => {
        mockBrowserAdapter = Mock.ofType<BrowserAdapter>();
        mockLogger = Mock.ofType<Logger>();
        mockUsageLogger = Mock.ofType<UsageLogger>();
        mockDetailsViewController = Mock.ofType<ExtensionDetailsViewController>();
        mockNotificationCreator = Mock.ofType<NotificationCreator>();
        mockWindowUtils = Mock.ofType<WindowUtils>();
    });

    it('createInterpreter', () => {
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

        const promiseFactoryMock = Mock.ofType<PromiseFactory>();
        const testObject = new TabContextFactory(
            visualizationConfigurationFactoryMock.object,
            telemetryEventHandlerMock.object,
            targetTabControllerMock.object,
            mockNotificationCreator.object,
            promiseFactoryMock.object,
            mockLogger.object,
            mockUsageLogger.object,
            mockWindowUtils.object,
        );

        const tabContext = testObject.createTabContext(
            broadcastMock.object,
            mockBrowserAdapter.object,
            mockDetailsViewController.object,
        );

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

        tabContext.interpreter.interpret({
            messageType: getStoreStateMessage(StoreNames.VisualizationScanResultStore),
            tabId: null,
        });

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

        broadcastMock.verifyAll();
    });
});
