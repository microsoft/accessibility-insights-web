// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Tabs } from 'webextension-polyfill-ts';
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';
import { CommandsAdapter } from '../common/browser-adapters/commands-adapter';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { DisplayableStrings } from '../common/constants/displayable-strings';
import { ToggleTelemetryData } from '../common/extension-telemetry-events';
import { Logger } from '../common/logging/logger';
import { Messages } from '../common/messages';
import { NotificationCreator } from '../common/notification-creator';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';
import {
    ScanData,
    VisualizationStoreData,
} from '../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { UrlValidator } from '../common/url-validator';
import { DictionaryStringTo } from '../types/common-types';
import { VisualizationTogglePayload } from './actions/action-payloads';
import { UserConfigurationStore } from './stores/global/user-configuration-store';
import { TabToContextMap } from './tab-context';
import { UsageLogger } from './usage-logger';

const VisualizationMessages = Messages.Visualizations;

export class KeyboardShortcutHandler {
    private targetTabUrl: string;
    private commandToVisualizationType: DictionaryStringTo<VisualizationType>;

    constructor(
        private tabToContextMap: TabToContextMap,
        private browserAdapter: BrowserAdapter,
        private urlValidator: UrlValidator,
        private notificationCreator: NotificationCreator,
        private visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private telemetryDataFactory: TelemetryDataFactory,
        private userConfigurationStore: UserConfigurationStore,
        private commandsAdapter: CommandsAdapter,
        private logger: Logger,
        private usageLogger: UsageLogger,
    ) {}

    public initialize(): void {
        this.commandToVisualizationType =
            this.visualizationConfigurationFactory.getChromeCommandToVisualizationTypeMap();
        this.commandsAdapter.addCommandListener(this.onCommand);
    }

    private onCommand = async (commandId: string): Promise<void> => {
        try {
            if (this.userConfigurationStore.getState().isFirstTime) {
                // Avoid launching functionality until a user has decided whether to allow telemetry
                return;
            }

            this.usageLogger.record();
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
                    this.notificationCreator.createNotification(
                        DisplayableStrings.fileUrlDoesNotHaveAccess,
                    );
                } else {
                    this.notificationCreator.createNotification(
                        DisplayableStrings.urlNotScannable.join('\n'),
                    );
                }

                return;
            }

            const state = tabContext.stores.visualizationStore.getState();

            if (state.scanning != null) {
                // do not notify if we are already scanning
                return;
            }

            const visualizationType = this.getVisualizationTypeFromCommand(commandId);

            if (visualizationType != null) {
                this.createEnableNotificationIfCurrentStateIsDisabled(visualizationType, state);
                this.invokeToggleAction(visualizationType, state, tabId);
            }
        } catch (err) {
            this.logger.error('Error occurred at chrome command handler:', err);
        }
    };

    private async checkAccessUrl(): Promise<boolean> {
        return await this.urlValidator.isSupportedUrl(this.targetTabUrl);
    }

    private async queryCurrentActiveTab(): Promise<Tabs.Tab> {
        const tabQueryParams: chrome.tabs.QueryInfo = { active: true, currentWindow: true };
        const currentActiveTabs = await this.browserAdapter.tabsQuery(tabQueryParams);

        if (currentActiveTabs && currentActiveTabs[0]) {
            return currentActiveTabs[0];
        }
        return null;
    }

    private getVisualizationTypeFromCommand(commandId: string): VisualizationType {
        return this.commandToVisualizationType[commandId];
    }

    private createEnableNotificationIfCurrentStateIsDisabled(
        visualizationType: VisualizationType,
        data: VisualizationStoreData,
    ): void {
        if (!this.shouldNotifyOnEnable(visualizationType)) {
            return;
        }

        const configuration =
            this.visualizationConfigurationFactory.getConfiguration(visualizationType);
        const scanData = configuration.getStoreData(data.tests);

        if (!scanData.enabled) {
            const displayableVisualizationData = configuration.displayableData;

            if (displayableVisualizationData) {
                this.notificationCreator.createNotification(
                    displayableVisualizationData.enableMessage,
                );
            }
        }
    }

    private shouldNotifyOnEnable(visualizationType: VisualizationType): boolean {
        return visualizationType !== VisualizationType.TabStops;
    }

    private invokeToggleAction(
        visualizationType: VisualizationType,
        state: VisualizationStoreData,
        tabId: number,
    ): void {
        const configuration =
            this.visualizationConfigurationFactory.getConfiguration(visualizationType);
        const scanData: ScanData = configuration.getStoreData(state.tests);
        const tabContext = this.tabToContextMap[tabId];

        const action = VisualizationMessages.Common.Toggle;
        const toEnabled = !scanData.enabled;

        const telemetryInfo: ToggleTelemetryData =
            this.telemetryDataFactory.forVisualizationToggleByCommand(toEnabled);

        const payload: VisualizationTogglePayload = {
            enabled: toEnabled,
            telemetry: telemetryInfo,
            test: visualizationType,
        };

        tabContext.interpreter.interpret({
            tabId: tabId,
            messageType: action,
            payload,
        });
    }
}
