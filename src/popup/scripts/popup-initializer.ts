// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import * as ReactDOM from 'react-dom';

import { BrowserAdapter } from '../../background/browser-adapter';
import { A11YSelfValidator } from '../../common/a11y-self-validator';
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { DropdownClickHandler } from '../../common/dropdown-click-handler';
import { EnumHelper } from '../../common/enum-helper';
import { HTMLElementUtils } from '../../common/html-element-utils';
import { ContentActionMessageCreator } from '../../common/message-creators/content-action-message-creator';
import { DropdownActionMessageCreator } from '../../common/message-creators/dropdown-action-message-creator';
import { StoreActionMessageCreatorFactory } from '../../common/message-creators/store-action-message-creator-factory';
import { UserConfigMessageCreator } from '../../common/message-creators/user-config-message-creator';
import { VisualizationActionMessageCreator } from '../../common/message-creators/visualization-action-message-creator';
import { AutoChecker } from '../../common/self-validator';
import { StoreProxy } from '../../common/store-proxy';
import { StoreNames } from '../../common/stores/store-names';
import { TelemetryDataFactory } from '../../common/telemetry-data-factory';
import { ICommandStoreData } from '../../common/types/store-data/icommand-store-data';
import { ILaunchPanelStoreData } from '../../common/types/store-data/ilaunch-panel-store-data';
import { IVisualizationStoreData } from '../../common/types/store-data/ivisualization-store-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { WindowUtils } from '../../common/window-utils';
import { ScannerUtils } from '../../injected/scanner-utils';
import { scan } from '../../scanner/exposed-apis';
import { SupportLinkHandler } from '../support-link-handler';
import { BaseClientStoresHub } from '../../common/stores/base-client-stores-hub';
import { TelemetryEventSource } from '../../common/telemetry-events';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { contentPages } from '../../content';
import { PopupActionMessageCreator } from './actions/popup-action-message-creator';
import { DiagnosticViewToggleDeps } from './components/diagnostic-view-toggle';
import { DiagnosticViewToggleFactory } from './components/diagnostic-view-toggle-factory';
import { PopupViewControllerState } from './components/popup-view';
import { DiagnosticViewClickHandler } from './handlers/diagnostic-view-toggle-click-handler';
import { IPopupHandlers } from './handlers/ipopup-handlers';
import { LaunchPanelHeaderClickHandler } from './handlers/launch-panel-header-click-handler';
import { PopupViewControllerHandler } from './handlers/popup-view-controller-handler';
import { LaunchPadRowConfigurationFactory } from './launch-pad-row-configuration-factory';
import { MainRenderer, MainRendererDeps } from './main-renderer';
import { TargetTabFinder, TargetTabInfo } from './target-tab-finder';

declare var window: AutoChecker & Window;

export class PopupInitializer {
    private targetTabInfo: TargetTabInfo;

    constructor(private readonly chromeAdapter: BrowserAdapter, private readonly targetTabFinder: TargetTabFinder) {
        this.chromeAdapter = chromeAdapter;
    }

    public initialize(): Promise<void> {
        return this.targetTabFinder
            .getTargetTab()
            .then(tabInfo => {
                this.targetTabInfo = tabInfo;
            })
            .then(this.initializePopup, err => {
                console.log('Error occurred at popup initialization:', err);
            });
    }

    @autobind
    private initializePopup(): void {
        const telemetryFactory = new TelemetryDataFactory();
        const visualizationActionCreator = new VisualizationActionMessageCreator(
            this.chromeAdapter.sendMessageToFrames,
            this.targetTabInfo.tab.id,
        );

        const popupActionMessageCreator = new PopupActionMessageCreator(
            this.chromeAdapter.sendMessageToFrames,
            this.targetTabInfo.tab.id,
            telemetryFactory,
        );

        const userConfigMessageCreator = new UserConfigMessageCreator(this.chromeAdapter.sendMessageToFrames, this.targetTabInfo.tab.id);

        const storeActionMessageCreatorFactory = new StoreActionMessageCreatorFactory(
            this.chromeAdapter.sendMessageToFrames,
            this.targetTabInfo.tab.id,
        );

        const storeActionMessageCreator = storeActionMessageCreatorFactory.forPopup();

        const contentActionMessageCreator = new ContentActionMessageCreator(
            this.chromeAdapter.sendMessageToFrames,
            this.targetTabInfo.tab.id,
            telemetryFactory,
            TelemetryEventSource.DetailsView,
        );

        const dropdownActionMessageCreator = new DropdownActionMessageCreator(
            this.chromeAdapter.sendMessageToFrames,
            this.targetTabInfo.tab.id,
            telemetryFactory,
        );

        const visualizationStoreName = StoreNames[StoreNames.VisualizationStore];
        const commandStoreName = StoreNames[StoreNames.CommandStore];
        const featureFlagStoreName = StoreNames[StoreNames.FeatureFlagStore];
        const launchPanelStateStoreName = StoreNames[StoreNames.LaunchPanelStateStore];
        const userConfigurationStoreName = StoreNames[StoreNames.UserConfigurationStore];

        const visualizationStore = new StoreProxy<IVisualizationStoreData>(visualizationStoreName, this.chromeAdapter);
        const launchPanelStateStore = new StoreProxy<ILaunchPanelStoreData>(launchPanelStateStoreName, this.chromeAdapter);
        const commandStore = new StoreProxy<ICommandStoreData>(commandStoreName, this.chromeAdapter);
        const featureFlagStore = new StoreProxy<FeatureFlagStoreData>(featureFlagStoreName, this.chromeAdapter);
        const userConfigurationStore = new StoreProxy<UserConfigurationStoreData>(userConfigurationStoreName, this.chromeAdapter);
        const windowUtils = new WindowUtils();

        visualizationStore.setTabId(this.targetTabInfo.tab.id);
        commandStore.setTabId(this.targetTabInfo.tab.id);
        featureFlagStore.setTabId(this.targetTabInfo.tab.id);
        launchPanelStateStore.setTabId(this.targetTabInfo.tab.id);
        userConfigurationStore.setTabId(this.targetTabInfo.tab.id);

        const visualizationConfigurationFactory = new VisualizationConfigurationFactory();
        const launchPadRowConfigurationFactory = new LaunchPadRowConfigurationFactory();

        const diagnosticViewClickHandler: DiagnosticViewClickHandler = new DiagnosticViewClickHandler(
            telemetryFactory,
            visualizationActionCreator,
            visualizationConfigurationFactory,
        );

        const popupViewControllerHandler = new PopupViewControllerHandler();
        const dropdownClickHandler = new DropdownClickHandler(dropdownActionMessageCreator, TelemetryEventSource.LaunchPad);
        const feedbackMenuClickHandler = new LaunchPanelHeaderClickHandler();
        const supportLinkHandler = new SupportLinkHandler(this.chromeAdapter, windowUtils);

        const popupHandlers: IPopupHandlers = {
            diagnosticViewClickHandler: diagnosticViewClickHandler,
            popupViewControllerHandler: popupViewControllerHandler,
            launchPanelHeaderClickHandler: feedbackMenuClickHandler,
            supportLinkHandler: supportLinkHandler,
        };

        const actionInitiators = {
            ...contentActionMessageCreator.initiators,
        };

        const visualizationTypes = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);
        const storesHub = new BaseClientStoresHub<PopupViewControllerState>([
            visualizationStore,
            launchPanelStateStore,
            commandStore,
            featureFlagStore,
            userConfigurationStore,
        ]);

        const deps: DiagnosticViewToggleDeps & MainRendererDeps = {
            contentProvider: contentPages,
            popupActionMessageCreator,
            contentActionMessageCreator,
            actionInitiators,
            dropdownClickHandler,
            userConfigMessageCreator,
            storesHub,
            storeActionMessageCreator,
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
            ReactDOM.render,
            document,
            window,
            this.chromeAdapter,
            this.targetTabInfo.tab.url,
            this.targetTabInfo.hasAccess,
            launchPadRowConfigurationFactory,
            diagnosticViewToggleFactory,
            dropdownClickHandler,
        );
        renderer.render();
        popupActionMessageCreator.popupInitialized();

        const a11ySelfValidator = new A11YSelfValidator(new ScannerUtils(scan), new HTMLElementUtils());
        window.A11YSelfValidator = a11ySelfValidator;
    }
}
