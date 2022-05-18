// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapterFactory } from 'common/browser-adapters/browser-adapter-factory';
import { BrowserEventManager } from 'common/browser-adapters/browser-event-manager';
import { BrowserEventProvider } from 'common/browser-adapters/browser-event-provider';
import { createDefaultLogger } from 'common/logging/default-logger';
import { createDefaultPromiseFactory } from 'common/promises/promise-factory';
import { TargetPageInspector } from 'Devtools/target-page-inspector';
import * as UAParser from 'ua-parser-js';
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

const targetPageInspector = new TargetPageInspector(chrome.devtools.inspectedWindow);

const devToolInitializer: DevToolInitializer = new DevToolInitializer(
    browserAdapter,
    targetPageInspector,
);
devToolInitializer.initialize();
