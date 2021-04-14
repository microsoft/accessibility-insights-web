// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DocumentManipulator } from 'common/document-manipulator';
import { Logger } from 'common/logging/logger';
import { textContent } from 'content/strings/text-content';
import { getNarrowModeThresholdsForWeb } from 'electron/common/narrow-mode-thresholds';
import { loadTheme } from 'office-ui-fabric-react';
import * as ReactDOM from 'react-dom';
import { BrowserAdapter } from '../../common/browser-adapters/browser-adapter';
import { TelemetryEventSource } from '../../common/extension-telemetry-events';
import { initializeFabricIcons } from '../../common/fabric-icons';
import { ContentActionMessageCreator } from '../../common/message-creators/content-action-message-creator';
import { RemoteActionMessageDispatcher } from '../../common/message-creators/remote-action-message-dispatcher';
import { StoreActionMessageCreatorFactory } from '../../common/message-creators/store-action-message-creator-factory';
import { StoreProxy } from '../../common/store-proxy';
import { BaseClientStoresHub } from '../../common/stores/base-client-stores-hub';
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

    const store = new StoreProxy<UserConfigurationStoreData>(
        StoreNames[StoreNames.UserConfigurationStore],
        browserAdapter,
    );
    const storesHub = new BaseClientStoresHub<any>([store]);
    const storeActionMessageCreatorFactory = new StoreActionMessageCreatorFactory(
        actionMessageDispatcher,
    );
    const storeActionMessageCreator = storeActionMessageCreatorFactory.fromStores(storesHub.stores);

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
        storeActionMessageCreator,
        documentManipulator,
        getNarrowModeThresholds: getNarrowModeThresholdsForWeb,
    };
};
