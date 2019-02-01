// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ChromeAdapter } from '../../background/browser-adapter';
import { initializeFabricIcons } from '../../common/fabric-icons';
import { ContentActionMessageCreator } from '../../common/message-creators/content-action-message-creator';
import { TelemetryDataFactory } from '../../common/telemetry-data-factory';
import { TelemetryEventSource } from '../../common/telemetry-events';
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

export const rendererDependencies: RendererDeps = {
    dom: document,
    render: ReactDOM.render,
    initializeFabricIcons,
    contentProvider: contentPages,
    contentActionMessageCreator,
    chromeAdapter,
};
