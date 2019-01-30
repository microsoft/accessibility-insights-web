// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { DisplayableStrings } from '../common/constants/displayable-strings';
import { Messages } from '../common/messages';
import { NotificationCreator } from '../common/notification-creator';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';
import { ToggleTelemetryData } from '../common/telemetry-events';
import { IScanData, IVisualizationStoreData } from '../common/types/store-data/ivisualization-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { UrlValidator } from '../common/url-validator';
import { IVisualizationTogglePayload } from './actions/action-payloads';
import { BrowserAdapter } from './browser-adapter';
import { TabToContextMap } from './tab-context';
import { UserConfigurationStore } from './stores/global/user-configuration-store';

const VisualizationMessages = Messages.Visualizations;

export class ChromeCommandHandler {
    private targetTabUrl: string;
    private commandToVisualizationType: IDictionaryStringTo<VisualizationType>;

    constructor(
        private tabToContextMap: TabToContextMap,
        private chromeAdapter: BrowserAdapter,
        private urlValidator: UrlValidator,
        private notificationCreator: NotificationCreator,
        private visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private telemetryDataFactory: TelemetryDataFactory,
        private userConfigurationStore: UserConfigurationStore,
    ) {}

    public initialize(): void {
        this.commandToVisualizationType = this.visualizationConfigurationFactory.getChromeCommandToVisualizationTypeMap();
        this.chromeAdapter.addCommandListener(this.onCommand);
    }

    @autobind
    private async onCommand(commandId: string): Promise<void> {
        try {
            if (this.userConfigurationStore.getState().isFirstTime) {
                // Avoid launching functionality until a user has decided whether to allow telemetry
                return;
            }

            const currentTab = await this.queryCurrentActiveTab();

            if (!currentTab) {
                return;
            }

            const tabId = currentTab.id;
            const tabContext = this.tabToContextMap[tabId];
            this.targetTabUrl = currentTab.url;

            if (!tabContext) {
                return;
            }

            const hasAccess = await this.checkAccessUrl();
            if (hasAccess === false) {
                if (UrlValidator.isFileUrl(currentTab.url)) {
                    this.notificationCreator.createNotification(DisplayableStrings.fileUrlDoesNotHaveAccess);
                } else {
                    this.notificationCreator.createNotification(DisplayableStrings.urlNotScannable.join('\n'));
                }

                return;
            }

            const state = tabContext.stores.visualizationStore.getState();

            if (state.scanning != null) {
                // do not change state if currently scanning, not even the toggle
                return;
            }

            const visualizationType = this.getVisualizationTypeFromCommand(commandId);

            if (visualizationType != null) {
                this.createEnableNotificationIfCurrentStateIsDisabled(visualizationType, state);
                this.invokeToggleAction(visualizationType, state, tabId);
            }
        } catch (err) {
            console.log('Error occurred at chrome command handler:', err);
        }
    }

    private async checkAccessUrl(): Promise<boolean> {
        return await this.urlValidator.isSupportedUrl(this.targetTabUrl, this.chromeAdapter);
    }

    private queryTabs(tabQueryParams: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]> {
        return new Promise(resolve => this.chromeAdapter.tabsQuery(tabQueryParams, resolve));
    }

    private async queryCurrentActiveTab(): Promise<chrome.tabs.Tab> {
        const tabQueryParams: chrome.tabs.QueryInfo = { active: true, currentWindow: true };
        const currentActiveTabs = await this.queryTabs(tabQueryParams);

        if (currentActiveTabs && currentActiveTabs[0]) {
            return currentActiveTabs[0];
        }
        return null;
    }

    private getVisualizationTypeFromCommand(commandId: string): VisualizationType {
        return this.commandToVisualizationType[commandId];
    }

    private createEnableNotificationIfCurrentStateIsDisabled(visualizationType: VisualizationType, data: IVisualizationStoreData): void {
        if (!this.shouldNotifyOnDisable(visualizationType)) {
            return;
        }

        const configuration = this.visualizationConfigurationFactory.getConfiguration(visualizationType);
        const scanData = configuration.getStoreData(data.tests);

        if (!scanData.enabled) {
            const displayableVisualizationData = configuration.displayableData;

            if (displayableVisualizationData) {
                this.notificationCreator.createNotification(displayableVisualizationData.enableMessage);
            }
        }
    }

    private shouldNotifyOnDisable(type: VisualizationType): boolean {
        return type !== VisualizationType.TabStops;
    }

    private invokeToggleAction(visualizationType: VisualizationType, state: IVisualizationStoreData, tabId: number): void {
        const configuration = this.visualizationConfigurationFactory.getConfiguration(visualizationType);
        const scanData: IScanData = configuration.getStoreData(state.tests);
        const tabContext = this.tabToContextMap[tabId];

        const action = VisualizationMessages.Common.Toggle;
        const toEnabled = !scanData.enabled;

        const telemetryInfo: ToggleTelemetryData = this.telemetryDataFactory.forVisualizationToggleByCommand(toEnabled);

        const payload: IVisualizationTogglePayload = {
            enabled: toEnabled,
            telemetry: telemetryInfo,
            test: visualizationType,
        };

        tabContext.interpreter.interpret({
            tabId: tabId,
            type: action,
            payload,
        });
    }
}
