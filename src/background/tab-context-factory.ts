// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Q from 'q';
import { AssessmentsProvider } from '../assessments/types/assessments-provider';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { NotificationCreator } from '../common/notification-creator';
import { StateDispatcher } from '../common/state-dispatcher';
import { WindowUtils } from '../common/window-utils';
import { ActionCreator } from './actions/action-creator';
import { ActionHub } from './actions/action-hub';
import { ContentActionCreator } from './actions/content-action-creator';
import { DevToolsActionCreator } from './actions/dev-tools-action-creator';
import { InspectActionCreator } from './actions/inspect-action-creator';
import { ScopingActionCreator } from './actions/scoping-action-creator';
import { TabActionCreator } from './actions/tab-action-creator';
import { AssessmentScanPolicyRunner } from './assessment-scan-policy-runner';
import { BrowserAdapter } from './browser-adapter';
import { ChromeFeatureController } from './chrome-feature-controller';
import { DetailsViewController } from './details-view-controller';
import { InjectorController } from './injector-controller';
import { ContentScriptInjector } from './injector/content-script-injector';
import { Interpreter } from './interpreter';
import { isAnAssessmentSelected } from './is-an-assessment-selected';
import { ScannerUtility } from './scanner-utility';
import { AssessmentStore } from './stores/assessment-store';
import { TabContextStoreHub } from './stores/tab-context-store-hub';
import { TabContext } from './tab-context';
import { TargetTabController } from './target-tab-controller';
import { TelemetryEventHandler } from './telemetry/telemetry-event-handler';

export class TabContextFactory {
    constructor(
        private visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private telemetryEventHandler: TelemetryEventHandler,
        private windowUtils: WindowUtils,
        private targetTabController: TargetTabController,
        private assessmentStore: AssessmentStore,
        private assessmentsProvider: AssessmentsProvider,
    ) {}

    public createTabContext(
        broadcastMessage: (message) => void,
        browserAdapter: BrowserAdapter,
        detailsViewController: DetailsViewController,
        tabId: number,
    ): TabContext {
        const interpreter = new Interpreter();
        const actionsHub = new ActionHub();
        const storeHub = new TabContextStoreHub(actionsHub, this.visualizationConfigurationFactory);
        const notificationCreator = new NotificationCreator(browserAdapter, this.visualizationConfigurationFactory);
        const chromeFeatureController = new ChromeFeatureController(browserAdapter);

        const actionCreator = new ActionCreator(
            actionsHub,
            interpreter.registerTypeToPayloadCallback,
            detailsViewController,
            chromeFeatureController,
            this.telemetryEventHandler,
            notificationCreator,
            this.visualizationConfigurationFactory,
            this.targetTabController,
        );

        const tabActionCreator = new TabActionCreator(
            interpreter.registerTypeToPayloadCallback,
            browserAdapter,
            this.telemetryEventHandler,
            actionsHub.tabActions,
        );

        const devToolsActionCreator = new DevToolsActionCreator(
            actionsHub.devToolActions,
            this.telemetryEventHandler,
            interpreter.registerTypeToPayloadCallback,
        );

        const inspectActionsCreator = new InspectActionCreator(
            actionsHub.inspectActions,
            this.telemetryEventHandler,
            browserAdapter,
            interpreter.registerTypeToPayloadCallback,
        );

        const scopingActionCreator = new ScopingActionCreator(
            actionsHub.scopingActions,
            this.telemetryEventHandler,
            interpreter.registerTypeToPayloadCallback,
            detailsViewController,
        );

        const contentActionCreator = new ContentActionCreator(
            actionsHub.contentActions,
            this.telemetryEventHandler,
            interpreter.registerTypeToPayloadCallback,
            detailsViewController,
        );

        const injectorController = new InjectorController(
            new ContentScriptInjector(browserAdapter, Q),
            storeHub.visualizationStore,
            interpreter,
            storeHub.tabStore,
            storeHub.inspectStore,
        );

        const scannerUtility = new ScannerUtility(interpreter, this.windowUtils);
        const simpleSequentialScanner = new AssessmentScanPolicyRunner(
            this.assessmentStore,
            storeHub.visualizationStore,
            scannerUtility.executeScan,
            this.assessmentsProvider,
            isAnAssessmentSelected,
            tabId,
        );
        simpleSequentialScanner.beginListeningToStores();

        actionCreator.registerCallbacks();
        devToolsActionCreator.registerCallbacks();
        inspectActionsCreator.registerCallbacks();
        tabActionCreator.registerCallbacks();
        scopingActionCreator.registerCallbacks();
        contentActionCreator.registerCallbacks();

        injectorController.initialize();
        const dispatcher = new StateDispatcher(broadcastMessage, storeHub);
        dispatcher.initialize();

        return new TabContext(interpreter, storeHub);
    }
}
