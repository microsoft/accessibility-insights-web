// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import * as Q from 'q';

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

const VisualizationMessages = Messages.Visualizations;

export class ExceptionsDuringScanning {
    public static readonly fileUrlDoesNotHaveAccess = 'ex01_fileNoAccess';
    public static readonly chromeUrlNotScannable = 'ex02_chromeNotScannable';
}

export class ChromeCommandHandler {
    private tabToContextMap: TabToContextMap;
    private chromeAdapter: BrowserAdapter;
    private urlValidator: UrlValidator;
    private targetTabUrl: string;
    private notificationCreator: NotificationCreator;
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;
    private commandToVisualizationType: IDictionaryStringTo<VisualizationType>;
    private telemetryDataFactory: TelemetryDataFactory;

    constructor(
        tabIdToInterpreterMap: TabToContextMap,
        chromeAdapter: BrowserAdapter,
        urlValidator: UrlValidator,
        notificationCreator: NotificationCreator,
        visualizationConfigurationFactory: VisualizationConfigurationFactory,
        telemetryDataFactory: TelemetryDataFactory,
    ) {
        this.tabToContextMap = tabIdToInterpreterMap;
        this.chromeAdapter = chromeAdapter;
        this.urlValidator = urlValidator;
        this.notificationCreator = notificationCreator;
        this.visualizationConfigurationFactory = visualizationConfigurationFactory;
        this.telemetryDataFactory = telemetryDataFactory;
    }

    public initialize() {
        this.chromeAdapter.addCommandListener(this.onCommand);
        this.commandToVisualizationType = this.visualizationConfigurationFactory.getChromeCommandToVisualizationTypeMap();
    }

    private checkAccessUrl(): Q.IPromise<boolean> {
        return this.urlValidator.isSupportedUrl(this.targetTabUrl, this.chromeAdapter);
    }

    @autobind
    private onCommand(commandId: string) {
        const tabQueryParams: chrome.tabs.QueryInfo = { active: true, currentWindow: true };

        this.chromeAdapter.tabsQuery(
            tabQueryParams,
            (tabs: chrome.tabs.Tab[]) => {
                const currentTab = tabs && tabs[0];

                if (!currentTab) {
                    return;
                }

                const tabId = currentTab.id;
                const tabContext = this.tabToContextMap[tabId];
                this.targetTabUrl = currentTab.url;

                if (!tabContext) {
                    return;
                }

                this.checkAccessUrl().then(hasAccess => {

                    if (hasAccess === false) {
                        if (UrlValidator.isFileUrl(currentTab.url)) {
                            this.notificationCreator.createNotification(DisplayableStrings.fileUrlDoesNotHaveAccess);
                        }
                        else {
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
                }, err => {
                    console.log('Error occurred at chrome command handler:', err);
                });
            });
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
