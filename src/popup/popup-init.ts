// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapterFactory } from 'common/browser-adapters/browser-adapter-factory';
import { createDefaultLogger } from 'common/logging/default-logger';
import UAParser from 'ua-parser-js';
import { initializeFabricIcons } from '../common/fabric-icons';
import { createSupportedBrowserChecker } from '../common/is-supported-browser';
import { UrlParser } from '../common/url-parser';
import { UrlValidator } from '../common/url-validator';
import { PopupInitializer } from './popup-initializer';
import { TargetTabFinder } from './target-tab-finder';

initializeFabricIcons();
const userAgentParser = new UAParser(window.navigator.userAgent);
const browserAdapterFactory = new BrowserAdapterFactory(userAgentParser);
const logger = createDefaultLogger();
const browserAdapter = browserAdapterFactory.makeFromUserAgent();
const urlValidator = new UrlValidator(browserAdapter);
const targetTabFinder = new TargetTabFinder(window, browserAdapter, urlValidator, new UrlParser());

const isSupportedBrowser = createSupportedBrowserChecker(userAgentParser);
const popupInitializer: PopupInitializer = new PopupInitializer(
    browserAdapter,
    targetTabFinder,
    isSupportedBrowser,
    logger,
);

popupInitializer.initialize().catch(logger.error);
