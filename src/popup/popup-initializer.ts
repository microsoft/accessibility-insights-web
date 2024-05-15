// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { loadTheme } from '@fluentui/react';
import { Assessments } from 'assessments/assessments';
import { assessmentsProviderForRequirements } from 'assessments/assessments-requirements-filter';
import { QuickAssessRequirementMap } from 'assessments/quick-assess-requirements';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { WebVisualizationConfigurationFactory } from 'common/configs/web-visualization-configuration-factory';
import { DocumentManipulator } from 'common/document-manipulator';
import { StoreUpdateMessageHub } from 'common/store-update-message-hub';
import { ExceptionTelemetryListener } from 'common/telemetry/exception-telemetry-listener';
import { ExceptionTelemetrySanitizer } from 'common/telemetry/exception-telemetry-sanitizer';
import { createRoot } from 'react-dom/client';
import { AxeInfo } from '../common/axe-info';
import { NewTabLink } from '../common/components/new-tab-link';
import { DropdownClickHandler } from '../common/dropdown-click-handler';
import { EnumHelper } from '../common/enum-helper';
import { TelemetryEventSource } from '../common/extension-telemetry-events';
import { HTMLElementUtils } from '../common/html-element-utils';
import { IsSupportedBrowser } from '../common/is-supported-browser';
import { Logger } from '../common/logging/logger';
import { ContentActionMessageCreator } from '../common/message-creators/content-action-message-creator';
import { DropdownActionMessageCreator } from '../common/message-creators/dropdown-action-message-creator';
import { RemoteActionMessageDispatcher } from '../common/message-creators/remote-action-message-dispatcher';
import { UserConfigMessageCreator } from '../common/message-creators/user-config-message-creator';
import { VisualizationActionMessageCreator } from '../common/message-creators/visualization-action-message-creator';
import { SelfFastPass, SelfFastPassContainer } from '../common/self-fast-pass';
import { StoreProxy } from '../common/store-proxy';
import { ClientStoresHub } from '../common/stores/client-stores-hub';
import { StoreNames } from '../common/stores/store-names';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';
import { CommandStoreData } from '../common/types/store-data/command-store-data';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { LaunchPanelStoreData } from '../common/types/store-data/launch-panel-store-data';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { VisualizationStoreData } from '../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { WindowUtils } from '../common/window-utils';
import { contentPages } from '../content';
import { ScannerUtils } from '../injected/scanner-utils';
import { scan } from '../scanner/exposed-apis';
import { PopupActionMessageCreator } from './actions/popup-action-message-creator';
import { DiagnosticViewToggleDeps } from './components/diagnostic-view-toggle';
import { DiagnosticViewToggleFactory } from './components/diagnostic-view-toggle-factory';
import { PopupViewControllerState } from './components/popup-view';
import { DiagnosticViewClickHandler } from './handlers/diagnostic-view-toggle-click-handler';
import { LaunchPanelHeaderClickHandler } from './handlers/launch-panel-header-click-handler';
import { PopupHandlers } from './handlers/popup-handlers';
import { PopupViewControllerHandler } from './handlers/popup-view-controller-handler';
import { IncompatibleBrowserRenderer } from './incompatible-browser-renderer';
import { LaunchPadRowConfigurationFactory } from './launch-pad-row-configuration-factory';
import { MainRenderer, MainRendererDeps } from './main-renderer';
import { TargetTabFinder, TargetTabInfo } from './target-tab-finder';

declare let window: SelfFastPassContainer & Window;

export class PopupInitializer {
    private targetTabInfo: TargetTabInfo;

    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly targetTabFinder: TargetTabFinder,
        private readonly isSupportedBrowser: IsSupportedBrowser,
        private logger: Logger,
    ) {}

    public initialize(): Promise<void> {
        if (!this.isSupportedBrowser()) {
            this.useIncompatibleBrowserRenderer();
            return;
        }

        return this.targetTabFinder
            .getTargetTab()
            .then(tabInfo => {
                this.targetTabInfo = tabInfo;
            })
            .then(this.initializePopup, err => {
                this.logger.log('Error occurred at popup initialization:', err);
            });
    }

    private useIncompatibleBrowserRenderer = () => {
        const incompatibleBrowserRenderer = new IncompatibleBrowserRenderer(createRoot, document);
        incompatibleBrowserRenderer.render();
    };

    private initializePopup = (): void => {
        const telemetryFactory = new TelemetryDataFactory();
        const tab = this.targetTabInfo.tab;
        const actionMessageDispatcher = new RemoteActionMessageDispatcher(
            this.browserAdapter.sendMessageToFrames,
            tab.id,
            this.logger,
        );

        const telemetrySanitizer = new ExceptionTelemetrySanitizer(
            this.browserAdapter.getExtensionId(),
        );
        const exceptionTelemetryListener = new ExceptionTelemetryListener(
            TelemetryEventSource.PopUp,
            actionMessageDispatcher.sendTelemetry,
            telemetrySanitizer,
        );
        exceptionTelemetryListener.initialize(this.logger);

        const visualizationActionCreator = new VisualizationActionMessageCreator(
            actionMessageDispatcher,
        );

        const windowUtils = new WindowUtils();
        const popupActionMessageCreator = new PopupActionMessageCreator(
            telemetryFactory,
            actionMessageDispatcher,
            windowUtils,
        );

        const userConfigMessageCreator = new UserConfigMessageCreator(
            actionMessageDispatcher,
            telemetryFactory,
        );

        const contentActionMessageCreator = new ContentActionMessageCreator(
            telemetryFactory,
            TelemetryEventSource.DetailsView,
            actionMessageDispatcher,
        );

        const dropdownActionMessageCreator = new DropdownActionMessageCreator(
            telemetryFactory,
            actionMessageDispatcher,
        );

        const storeUpdateMessageHub = new StoreUpdateMessageHub(actionMessageDispatcher, tab.id);
        this.browserAdapter.addListenerOnRuntimeMessage(storeUpdateMessageHub.handleBrowserMessage);

        const visualizationStoreName = StoreNames[StoreNames.VisualizationStore];
        const commandStoreName = StoreNames[StoreNames.CommandStore];
        const featureFlagStoreName = StoreNames[StoreNames.FeatureFlagStore];
        const launchPanelStateStoreName = StoreNames[StoreNames.LaunchPanelStateStore];
        const userConfigurationStoreName = StoreNames[StoreNames.UserConfigurationStore];

        const visualizationStore = new StoreProxy<VisualizationStoreData>(
            visualizationStoreName,
            storeUpdateMessageHub,
        );
        const launchPanelStateStore = new StoreProxy<LaunchPanelStoreData>(
            launchPanelStateStoreName,
            storeUpdateMessageHub,
        );
        const commandStore = new StoreProxy<CommandStoreData>(
            commandStoreName,
            storeUpdateMessageHub,
        );
        const featureFlagStore = new StoreProxy<FeatureFlagStoreData>(
            featureFlagStoreName,
            storeUpdateMessageHub,
        );
        const userConfigurationStore = new StoreProxy<UserConfigurationStoreData>(
            userConfigurationStoreName,
            storeUpdateMessageHub,
        );

        const visualizationConfigurationFactory = new WebVisualizationConfigurationFactory(
            Assessments,
            assessmentsProviderForRequirements(Assessments, QuickAssessRequirementMap),
        );
        const launchPadRowConfigurationFactory = new LaunchPadRowConfigurationFactory();

        const diagnosticViewClickHandler: DiagnosticViewClickHandler =
            new DiagnosticViewClickHandler(
                telemetryFactory,
                visualizationActionCreator,
                visualizationConfigurationFactory,
            );

        const popupViewControllerHandler = new PopupViewControllerHandler();
        const dropdownClickHandler = new DropdownClickHandler(
            dropdownActionMessageCreator,
            TelemetryEventSource.LaunchPad,
        );
        const launchPanelHeaderClickHandler = new LaunchPanelHeaderClickHandler();

        const popupHandlers: PopupHandlers = {
            diagnosticViewClickHandler,
            popupViewControllerHandler,
            launchPanelHeaderClickHandler,
        };

        const actionInitiators = {
            ...contentActionMessageCreator.initiators,
        };

        const visualizationTypes =
            EnumHelper.getNumericValues<VisualizationType>(VisualizationType);
        const storesHub = new ClientStoresHub<PopupViewControllerState>([
            visualizationStore,
            launchPanelStateStore,
            commandStore,
            featureFlagStore,
            userConfigurationStore,
        ]);

        const axeInfo = AxeInfo.Default;

        const documentManipulator = new DocumentManipulator(document);

        const deps: DiagnosticViewToggleDeps & MainRendererDeps = {
            contentProvider: contentPages,
            popupActionMessageCreator,
            contentActionMessageCreator,
            actionInitiators,
            dropdownClickHandler,
            userConfigMessageCreator,
            storesHub,
            loadTheme,
            axeInfo,
            launchPanelHeaderClickHandler,
            browserAdapter: this.browserAdapter,
            LinkComponent: NewTabLink,
            documentManipulator,
        };

        const diagnosticViewToggleFactory = new DiagnosticViewToggleFactory(
            deps,
            document,
            visualizationTypes,
            visualizationConfigurationFactory,
            visualizationStore,
            featureFlagStore,
            commandStore,
            popupActionMessageCreator,
            diagnosticViewClickHandler,
        );

        const renderer = new MainRenderer(
            deps,
            popupHandlers,
            createRoot,
            document,
            window,
            tab.url,
            this.targetTabInfo.hasAccess,
            launchPadRowConfigurationFactory,
            diagnosticViewToggleFactory,
            dropdownClickHandler,
        );
        renderer.render();
        popupActionMessageCreator.popupInitialized(tab);

        const selfFastPass = new SelfFastPass(
            new ScannerUtils(scan, this.logger),
            new HTMLElementUtils(),
            this.logger,
        );
        window.selfFastPass = selfFastPass;
    };
}
