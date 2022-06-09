// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { loadTheme } from '@fluentui/react';
import { DocumentManipulator } from 'common/document-manipulator';
import { Logger } from 'common/logging/logger';
import { getNarrowModeThresholdsForWeb } from 'common/narrow-mode-thresholds';
import { StoreUpdateMessageHub } from 'common/store-update-message-hub';
import { textContent } from 'content/strings/text-content';
import * as ReactDOM from 'react-dom';
import { Content } from 'views/content/content';
import { BrowserAdapter } from '../../common/browser-adapters/browser-adapter';
import { TelemetryEventSource } from '../../common/extension-telemetry-events';
import { initializeFabricIcons } from '../../common/fabric-icons';
import { ContentActionMessageCreator } from '../../common/message-creators/content-action-message-creator';
import { RemoteActionMessageDispatcher } from '../../common/message-creators/remote-action-message-dispatcher';
import { StoreProxy } from '../../common/store-proxy';
import { ClientStoresHub } from '../../common/stores/client-stores-hub';
import { StoreNames } from '../../common/stores/store-names';
import { TelemetryDataFactory } from '../../common/telemetry-data-factory';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { contentPages } from '../../content';
import { RendererDeps } from './renderer';

export const rendererDependencies: (
    browserAdapter: BrowserAdapter,
    logger: Logger,
) => RendererDeps = (browserAdapter, logger) => {
    const actionMessageDispatcher = new RemoteActionMessageDispatcher(
        browserAdapter.sendMessageToFrames,
        null,
        logger,
    );

    const telemetryFactory = new TelemetryDataFactory();

    const contentActionMessageCreator = new ContentActionMessageCreator(
        telemetryFactory,
        TelemetryEventSource.ContentPage,
        actionMessageDispatcher,
    );

    const storeUpdateMessageHub = new StoreUpdateMessageHub(
        browserAdapter,
        actionMessageDispatcher,
    );

    const store = new StoreProxy<UserConfigurationStoreData>(
        StoreNames[StoreNames.UserConfigurationStore],
        storeUpdateMessageHub,
    );
    const storesHub = new ClientStoresHub<any>([store]);
    const documentManipulator = new DocumentManipulator(document);

    return {
        textContent,
        dom: document,
        render: ReactDOM.render,
        initializeFabricIcons,
        loadTheme,
        contentProvider: contentPages,
        contentActionMessageCreator,
        storesHub,
        documentManipulator,
        getNarrowModeThresholds: getNarrowModeThresholdsForWeb,
        ContentRootComponent: Content,
    };
};
