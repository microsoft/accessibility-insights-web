// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapterFactory } from 'common/browser-adapters/browser-adapter-factory';
import { BrowserEventManager } from 'common/browser-adapters/browser-event-manager';
import { BrowserEventProvider } from 'common/browser-adapters/browser-event-provider';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { createDefaultLogger } from 'common/logging/default-logger';
import { RemoteActionMessageDispatcher } from 'common/message-creators/remote-action-message-dispatcher';
import { createDefaultPromiseFactory } from 'common/promises/promise-factory';
import { ForwardingExceptionTelemetryListener } from 'common/telemetry/forwarding-exception-telemetry-listener';
import { TargetPageInspector } from 'Devtools/target-page-inspector';
import UAParser from 'ua-parser-js';
import { DevToolInitializer } from './dev-tool-initializer';

const userAgentParser = new UAParser(window.navigator.userAgent);
const browserAdapterFactory = new BrowserAdapterFactory(userAgentParser);
const logger = createDefaultLogger();
const promiseFactory = createDefaultPromiseFactory();
const browserEventProvider = new BrowserEventProvider();
const browserEventManager = new BrowserEventManager(promiseFactory, logger);
const browserAdapter = browserAdapterFactory.makeFromUserAgent(
    browserEventManager,
    browserEventProvider.getMinimalBrowserEvents(),
);

const actionMessageDispatcher = new RemoteActionMessageDispatcher(
    browserAdapter.sendMessageToFrames,
    null,
    logger,
);
const exceptionTelemetryListener = new ForwardingExceptionTelemetryListener(
    actionMessageDispatcher,
    TelemetryEventSource.DevTools,
);
exceptionTelemetryListener.initialize(logger);

const targetPageInspector = new TargetPageInspector(chrome.devtools.inspectedWindow);

const devToolInitializer: DevToolInitializer = new DevToolInitializer(
    browserAdapter,
    targetPageInspector,
);
void devToolInitializer.initialize();
