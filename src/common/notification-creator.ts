// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from 'common/types/visualization-type';
import * as _ from 'lodash';
import { DictionaryStringTo } from 'types/common-types';

import { BrowserAdapter } from './browser-adapters/browser-adapter';
import { VisualizationConfigurationFactory } from './configs/visualization-configuration-factory';

export class NotificationCreator {
    private browserAdapter: BrowserAdapter;
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;

    constructor(browserAdapter: BrowserAdapter, visualizationConfigurationFactory: VisualizationConfigurationFactory) {
        this.browserAdapter = browserAdapter;
        this.visualizationConfigurationFactory = visualizationConfigurationFactory;
    }

    public createNotification(message: string): void {
        if (message) {
            const manifest = this.browserAdapter.getManifest();
            this.browserAdapter
                .createNotification({
                    type: 'basic',
                    message: message,
                    title: manifest.name,
                    iconUrl: '../' + manifest.icons[128],
                })
                .catch(console.error);
        }
    }

    public createNotificationByVisualizationKey(
        selectorMap: DictionaryStringTo<any>,
        key: string,
        visualizationType: VisualizationType,
    ): void {
        if (_.isEmpty(selectorMap)) {
            const configuration = this.visualizationConfigurationFactory.getConfiguration(visualizationType);
            const notificationMessage = configuration.getNotificationMessage(selectorMap, key);
            if (notificationMessage != null) {
                this.createNotification(notificationMessage);
            }
        }
    }
}
