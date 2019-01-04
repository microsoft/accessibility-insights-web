// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { IChromeAdapter } from './browser-adapter';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { VisualizationType } from '../common/types/visualization-type';

export class TargetTabController {
    private browserAdapter: IChromeAdapter;
    private configurationFactory: VisualizationConfigurationFactory;

    constructor(adapter: IChromeAdapter, configurationFactory: VisualizationConfigurationFactory) {
        this.browserAdapter = adapter;
        this.configurationFactory = configurationFactory;
    }

    public showTargetTab(targetTabId: number, testType: VisualizationType, testStep: string = null): void {
        const config = this.configurationFactory.getConfiguration(testType);
        const switchToTargetTab = config.getSwitchToTargetTabOnScan(testStep);

        if (switchToTargetTab) {
            this.browserAdapter.switchToTab(targetTabId);
        }
    }
}
