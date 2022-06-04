// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapterFactory } from 'common/browser-adapters/browser-adapter-factory';
import { TargetPageInspector } from 'Devtools/target-page-inspector';
import UAParser from 'ua-parser-js';
import { DevToolInitializer } from './dev-tool-initializer';

const userAgentParser = new UAParser(window.navigator.userAgent);
const browserAdapterFactory = new BrowserAdapterFactory(userAgentParser);
const browserAdapter = browserAdapterFactory.makeFromUserAgent();

const targetPageInspector = new TargetPageInspector(chrome.devtools.inspectedWindow);

const devToolInitializer: DevToolInitializer = new DevToolInitializer(
    browserAdapter,
    targetPageInspector,
);
void devToolInitializer.initialize();
