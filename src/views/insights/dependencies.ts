// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ChromeAdapter } from '../../background/browser-adapter';
import { initializeFabricIcons } from '../../common/fabric-icons';
import { ContentActionMessageCreator } from '../../common/message-creators/content-action-message-creator';
import { StoreActionMessageCreatorFactory } from '../../common/message-creators/store-action-message-creator-factory';
import { StoreProxy } from '../../common/store-proxy';
import { BaseClientStoresHub } from '../../common/stores/base-client-stores-hub';
import { StoreNames } from '../../common/stores/store-names';
import { TelemetryDataFactory } from '../../common/telemetry-data-factory';
import { TelemetryEventSource } from '../../common/telemetry-events';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { contentPages } from '../../content';
import { RendererDeps } from './renderer';

const chromeAdapter = new ChromeAdapter();
const url = new URL(window.location.href);
const tabId = parseInt(url.searchParams.get('tabId'), 10);

const telemetryFactory = new TelemetryDataFactory();

const contentActionMessageCreator = new ContentActionMessageCreator(
    chromeAdapter.sendMessageToFrames,
    tabId,
    telemetryFactory,
    TelemetryEventSource.ContentPage,
);

const store = new StoreProxy<UserConfigurationStoreData>(StoreNames[StoreNames.UserConfigurationStore], chromeAdapter);
const storesHub = new BaseClientStoresHub<any>([store]);
const storeActionMessageCreatorFactory = new StoreActionMessageCreatorFactory(chromeAdapter.sendMessageToFrames, tabId);
const storeActionCreator = storeActionMessageCreatorFactory.forDetailsView();

export const rendererDependencies: RendererDeps = {
    dom: document,
    render: ReactDOM.render,
    initializeFabricIcons,
    contentProvider: contentPages,
    contentActionMessageCreator,
    chromeAdapter,
    tabId,
    storesHub,
    storeActionCreator,
};
