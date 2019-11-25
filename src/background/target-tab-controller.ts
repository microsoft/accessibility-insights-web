// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { VisualizationType } from '../common/types/visualization-type';

export class TargetTabController {
    private browserAdapter: BrowserAdapter;
    private configurationFactory: VisualizationConfigurationFactory;

    constructor(adapter: BrowserAdapter, configurationFactory: VisualizationConfigurationFactory) {
        this.browserAdapter = adapter;
        this.configurationFactory = configurationFactory;
    }

    public showTargetTab(
        targetTabId: number,
        testType: VisualizationType,
        testStep: string = null,
    ): void {
        const config = this.configurationFactory.getConfiguration(testType);
        const switchToTargetTab = config.getSwitchToTargetTabOnScan(testStep);

        if (switchToTargetTab) {
            this.browserAdapter.switchToTab(targetTabId);
        }
    }
}
