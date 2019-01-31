// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ChromeAdapter } from '../../background/browser-adapter';
import { initializeFabricIcons } from '../../common/fabric-icons';
import { ContentActionMessageCreator } from '../../common/message-creators/content-action-message-creator';
import { StoreProxy } from '../../common/store-proxy';
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

const userConfigurationStore = new StoreProxy<UserConfigurationStoreData>(
    StoreNames[StoreNames.UserConfigurationStore],
    chromeAdapter,
);

export const rendererDependencies: RendererDeps = {
    dom: document,
    render: ReactDOM.render,
    initializeFabricIcons,
    contentProvider: contentPages,
    contentActionMessageCreator,
    userConfigurationStore,
};
