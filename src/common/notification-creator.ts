// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';

import { BrowserAdapter } from '../background/browser-adapters/browser-adapter';
import { NotificationAdapter } from '../background/browser-adapters/notification-adapter';
import { VisualizationType } from '../common/types/visualization-type';
import { DictionaryStringTo } from '../types/common-types';
import { VisualizationConfigurationFactory } from './configs/visualization-configuration-factory';

export class NotificationCreator {
    constructor(
        private readonly chromeAdapter: BrowserAdapter,
        private readonly notificationAdapter: NotificationAdapter,
        private readonly visualizationConfigurationFactory: VisualizationConfigurationFactory,
    ) {}

    public createNotification(message: string): void {
        if (message) {
            const manifest = this.chromeAdapter.getManifest();
            this.notificationAdapter.createNotification({
                message: message,
                title: manifest.name,
                iconUrl: '../' + manifest.icons[128],
            });
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
