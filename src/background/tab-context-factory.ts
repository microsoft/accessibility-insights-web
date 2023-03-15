// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NeedsReviewCardSelectionActionCreator } from 'background/actions/needs-review-card-selection-action-creator';
import { NeedsReviewScanResultActionCreator } from 'background/actions/needs-review-scan-result-action-creator';
import { TabStopRequirementActionCreator } from 'background/actions/tab-stop-requirement-action-creator';
import { BrowserMessageBroadcasterFactory } from 'background/browser-message-broadcaster-factory';
import { DevToolsMonitor } from 'background/dev-tools-monitor';
import { PersistedData } from 'background/get-persisted-data';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { NotificationCreator } from 'common/notification-creator';
import { PromiseFactory } from 'common/promises/promise-factory';
import { StateDispatcher } from 'common/state-dispatcher';
import { UrlParser } from 'common/url-parser';
import { ActionCreator } from './actions/action-creator';
import { ActionHub } from './actions/action-hub';
import { CardSelectionActionCreator } from './actions/card-selection-action-creator';
import { ContentActionCreator } from './actions/content-action-creator';
import { DetailsViewActionCreator } from './actions/details-view-action-creator';
import { DevToolsActionCreator } from './actions/dev-tools-action-creator';
import { InjectionActionCreator } from './actions/injection-action-creator';
import { InspectActionCreator } from './actions/inspect-action-creator';
import { PathSnippetActionCreator } from './actions/path-snippet-action-creator';
import { PopupActionCreator } from './actions/popup-action-creator';
import { ShortcutsPageActionCreator } from './actions/shortcuts-page-action-creator';
import { TabActionCreator } from './actions/tab-action-creator';
import { UnifiedScanResultActionCreator } from './actions/unified-scan-result-action-creator';
import { ExtensionDetailsViewController } from './extension-details-view-controller';
import { InjectorController } from './injector-controller';
import { ContentScriptInjector } from './injector/content-script-injector';
import { Interpreter } from './interpreter';
import { ShortcutsPageController } from './shortcuts-page-controller';
import { TabContextStoreHub } from './stores/tab-context-store-hub';
import { TabContext } from './tab-context';
import { TargetTabController } from './target-tab-controller';
import { TelemetryEventHandler } from './telemetry/telemetry-event-handler';
import { UsageLogger } from './usage-logger';

export class TabContextFactory {
    constructor(
        private visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private telemetryEventHandler: TelemetryEventHandler,
        private targetTabController: TargetTabController,
        private notificationCreator: NotificationCreator,
        private detailsViewController: ExtensionDetailsViewController,
        private browserAdapter: BrowserAdapter,
        private readonly broadcasterFactory: BrowserMessageBroadcasterFactory,
        private readonly promiseFactory: PromiseFactory,
        private readonly logger: Logger,
        private readonly usageLogger: UsageLogger,
        private readonly persistedData: PersistedData,
        private readonly indexedDBInstance: IndexedDBAPI,
        private readonly urlParser: UrlParser,
    ) {}

    public createTabContext(tabId: number): TabContext {
        const interpreter = new Interpreter();
        const actionsHub = new ActionHub();
        const storeHub = new TabContextStoreHub(
            actionsHub,
            this.visualizationConfigurationFactory,
            this.persistedData,
            this.indexedDBInstance,
            this.logger,
            tabId,
            this.urlParser,
        );
        const shortcutsPageController = new ShortcutsPageController(this.browserAdapter);

        const shortcutsPageActionCreator = new ShortcutsPageActionCreator(
            interpreter,
            shortcutsPageController,
            this.telemetryEventHandler,
            this.logger,
        );

        const actionCreator = new ActionCreator(
            interpreter,
            actionsHub,
            this.detailsViewController,
            this.telemetryEventHandler,
            this.notificationCreator,
            this.visualizationConfigurationFactory,
            this.targetTabController,
            this.logger,
        );

        const detailsViewActionCreator = new DetailsViewActionCreator(
            interpreter,
            actionsHub.detailsViewActions,
            actionsHub.sidePanelActions,
            this.detailsViewController,
            this.telemetryEventHandler,
        );

        const tabStopRequirementActionCreator = new TabStopRequirementActionCreator(
            interpreter,
            actionsHub.tabStopRequirementActions,
            this.telemetryEventHandler,
        );

        const tabActionCreator = new TabActionCreator(
            interpreter,
            actionsHub.tabActions,
            this.browserAdapter,
            this.telemetryEventHandler,
            this.logger,
            tabId,
        );
        const popupActionCreator = new PopupActionCreator(
            interpreter,
            actionsHub.tabActions,
            this.telemetryEventHandler,
            this.usageLogger,
        );
        const devToolsActionCreator = new DevToolsActionCreator(
            interpreter,
            actionsHub.devToolActions,
            this.telemetryEventHandler,
        );
        const inspectActionsCreator = new InspectActionCreator(
            interpreter,
            actionsHub.inspectActions,
            this.telemetryEventHandler,
            this.browserAdapter,
            this.logger,
        );
        const pathSnippetActionCreator = new PathSnippetActionCreator(
            interpreter,
            actionsHub.pathSnippetActions,
        );
        const unifiedScanResultActionCreator = new UnifiedScanResultActionCreator(
            interpreter,
            actionsHub.unifiedScanResultActions,
            this.telemetryEventHandler,
            this.notificationCreator,
        );
        const needsReviewScanResultActionCreator = new NeedsReviewScanResultActionCreator(
            interpreter,
            actionsHub.needsReviewScanResultActions,
            this.telemetryEventHandler,
            this.notificationCreator,
        );
        const contentActionCreator = new ContentActionCreator(
            interpreter,
            actionsHub.contentActions,
            this.telemetryEventHandler,
            this.detailsViewController,
        );
        const cardSelectionActionCreator = new CardSelectionActionCreator(
            interpreter,
            actionsHub.cardSelectionActions,
            this.telemetryEventHandler,
        );
        const needsReviewCardSelectionActionCreator = new NeedsReviewCardSelectionActionCreator(
            interpreter,
            actionsHub.needsReviewCardSelectionActions,
            this.telemetryEventHandler,
        );
        const injectionActionCreator = new InjectionActionCreator(
            interpreter,
            actionsHub.injectionActions,
            this.notificationCreator,
        );

        const injectorController = new InjectorController(
            new ContentScriptInjector(this.browserAdapter, this.promiseFactory, this.logger),
            storeHub.visualizationStore,
            interpreter,
            storeHub.tabStore,
            storeHub.inspectStore,
            this.logger,
        );

        const messageBroadcaster = this.broadcasterFactory.createTabSpecificBroadcaster(tabId);

        shortcutsPageActionCreator.registerCallbacks();
        actionCreator.registerCallbacks();
        detailsViewActionCreator.registerCallback();
        devToolsActionCreator.registerCallbacks();
        inspectActionsCreator.registerCallbacks();
        pathSnippetActionCreator.registerCallbacks();
        tabActionCreator.registerCallbacks();
        tabStopRequirementActionCreator.registerCallbacks();
        popupActionCreator.registerCallbacks();
        contentActionCreator.registerCallbacks();
        needsReviewScanResultActionCreator.registerCallbacks();
        needsReviewCardSelectionActionCreator.registerCallbacks();
        unifiedScanResultActionCreator.registerCallbacks();
        cardSelectionActionCreator.registerCallbacks();
        injectionActionCreator.registerCallbacks();

        injectorController.initialize();
        const dispatcher = new StateDispatcher(messageBroadcaster, storeHub, this.logger);
        dispatcher.initialize();

        const devToolsMonitor = new DevToolsMonitor(
            tabId,
            this.browserAdapter,
            this.promiseFactory,
            interpreter,
            actionsHub.devToolActions,
        );
        devToolsMonitor.initialize();

        return new TabContext(interpreter, storeHub);
    }
}
