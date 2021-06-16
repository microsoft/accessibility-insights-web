// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { VisualizationType } from 'common/types/visualization-type';
import { DictionaryStringTo } from 'types/common-types';
import { BrowserAdapter } from './browser-adapters/browser-adapter';
import { VisualizationConfigurationFactory } from './configs/visualization-configuration-factory';

export class NotificationCreator {
    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private readonly logger: Logger,
    ) {}

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
                .catch(this.logger.error);
        }
    }

    public createNotificationByVisualizationKey(
        selectorMap: DictionaryStringTo<any>,
        key: string,
        visualizationType: VisualizationType,
        warnings: ScanIncompleteWarningId[],
    ): void {
        const configuration =
            this.visualizationConfigurationFactory.getConfiguration(visualizationType);
        const notificationMessage = configuration.getNotificationMessage(
            selectorMap,
            key,
            warnings,
        );

        this.createNotification(notificationMessage);
    }
}
