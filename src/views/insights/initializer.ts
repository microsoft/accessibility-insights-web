// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapterFactory } from 'common/browser-adapters/browser-adapter-factory';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { HTMLElementUtils } from 'common/html-element-utils';
import { createDefaultLogger } from 'common/logging/default-logger';
import { RemoteActionMessageDispatcher } from 'common/message-creators/remote-action-message-dispatcher';
import { SelfFastPass, SelfFastPassContainer } from 'common/self-fast-pass';
import { ExceptionTelemetryListener } from 'common/telemetry/exception-telemetry-listener';
import { ExceptionTelemetrySanitizer } from 'common/telemetry/exception-telemetry-sanitizer';
import { ScannerUtils } from 'injected/scanner-utils';
import { scan } from 'scanner/exposed-apis';
import UAParser from 'ua-parser-js';
import { rendererDependencies } from './dependencies';
import { renderer } from './renderer';

declare const window: SelfFastPassContainer & Window;

const userAgentParser = new UAParser(window.navigator.userAgent);
const browserAdapterFactory = new BrowserAdapterFactory(userAgentParser);
const logger = createDefaultLogger();
const browserAdapter = browserAdapterFactory.makeFromUserAgent();

const actionMessageDispatcher = new RemoteActionMessageDispatcher(
    browserAdapter.sendMessageToFrames,
    null,
    logger,
);
const telemetrySanitizer = new ExceptionTelemetrySanitizer(browserAdapter.getExtensionId());
const exceptionTelemetryListener = new ExceptionTelemetryListener(
    TelemetryEventSource.Insights,
    actionMessageDispatcher.sendTelemetry,
    telemetrySanitizer,
);
exceptionTelemetryListener.initialize(logger);

renderer(rendererDependencies(browserAdapter, logger));

const selfFastPass = new SelfFastPass(
    new ScannerUtils(scan, logger),
    new HTMLElementUtils(),
    logger,
);
window.selfFastPass = selfFastPass;
