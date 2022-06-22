// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapterFactory } from 'common/browser-adapters/browser-adapter-factory';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { createDefaultLogger } from 'common/logging/default-logger';
import { RemoteActionMessageDispatcher } from 'common/message-creators/remote-action-message-dispatcher';
import { ExceptionTelemetryListener } from 'common/telemetry/exception-telemetry-listener';
import { ExceptionTelemetrySanitizer } from 'common/telemetry/exception-telemetry-sanitizer';
import { TargetPageInspector } from 'Devtools/target-page-inspector';
import UAParser from 'ua-parser-js';
import { DevToolInitializer } from './dev-tool-initializer';

const logger = createDefaultLogger();

const userAgentParser = new UAParser(window.navigator.userAgent);
const browserAdapterFactory = new BrowserAdapterFactory(userAgentParser);
const browserAdapter = browserAdapterFactory.makeFromUserAgent();

const actionMessageDispatcher = new RemoteActionMessageDispatcher(
    browserAdapter.sendMessageToFrames,
    null,
    logger,
);
const telemetrySanitizer = new ExceptionTelemetrySanitizer(browserAdapter.getExtensionId()!);
const exceptionTelemetryListener = new ExceptionTelemetryListener(
    TelemetryEventSource.DevTools,
    actionMessageDispatcher.sendTelemetry,
    telemetrySanitizer,
);
exceptionTelemetryListener.initialize(logger);

const targetPageInspector = new TargetPageInspector(chrome.devtools.inspectedWindow);

const devToolInitializer: DevToolInitializer = new DevToolInitializer(
    browserAdapter,
    targetPageInspector,
);
void devToolInitializer.initialize();
