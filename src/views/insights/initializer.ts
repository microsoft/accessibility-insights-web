// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapterFactory } from 'common/browser-adapters/browser-adapter-factory';
import { DocumentManipulator } from 'common/document-manipulator';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { initializeFabricIcons } from 'common/fabric-icons';
import { HTMLElementUtils } from 'common/html-element-utils';
import { createDefaultLogger } from 'common/logging/default-logger';
import { ContentActionMessageCreator } from 'common/message-creators/content-action-message-creator';
import { RemoteActionMessageDispatcher } from 'common/message-creators/remote-action-message-dispatcher';
import { getNarrowModeThresholdsForWeb } from 'common/narrow-mode-thresholds';
import { SelfFastPass, SelfFastPassContainer } from 'common/self-fast-pass';
import { StoreProxy } from 'common/store-proxy';
import { StoreUpdateMessageHub } from 'common/store-update-message-hub';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { StoreNames } from 'common/stores/store-names';
import { ExceptionTelemetryListener } from 'common/telemetry/exception-telemetry-listener';
import { ExceptionTelemetrySanitizer } from 'common/telemetry/exception-telemetry-sanitizer';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { contentPages } from 'content';
import { textContent } from 'content/strings/text-content';
import { ScannerUtils } from 'injected/scanner-utils';
import { createRoot } from 'react-dom/client';
import { scan } from 'scanner/exposed-apis';
import UAParser from 'ua-parser-js';
import { Content } from 'views/content/content';
import { renderer, RendererDeps } from './renderer';

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

const telemetryFactory = new TelemetryDataFactory();

const contentActionMessageCreator = new ContentActionMessageCreator(
    telemetryFactory,
    TelemetryEventSource.ContentPage,
    actionMessageDispatcher,
);

const storeUpdateMessageHub = new StoreUpdateMessageHub(actionMessageDispatcher);
browserAdapter.addListenerOnRuntimeMessage(storeUpdateMessageHub.handleBrowserMessage);

const userConfigurationStore = new StoreProxy<UserConfigurationStoreData>(
    StoreNames[StoreNames.UserConfigurationStore],
    storeUpdateMessageHub,
);
const storesHub = new ClientStoresHub<any>([userConfigurationStore]);
const documentManipulator = new DocumentManipulator(document);

const rendererDependencies: RendererDeps = {
    textContent,
    dom: document,
    createRoot,
    initializeFabricIcons,
    contentProvider: contentPages,
    contentActionMessageCreator,
    storesHub,
    documentManipulator,
    getNarrowModeThresholds: getNarrowModeThresholdsForWeb,
    ContentRootComponent: Content,
};

renderer(rendererDependencies);

const selfFastPass = new SelfFastPass(
    new ScannerUtils(scan, logger),
    new HTMLElementUtils(),
    logger,
);
window.selfFastPass = selfFastPass;
