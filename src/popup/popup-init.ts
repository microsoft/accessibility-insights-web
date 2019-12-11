// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createDefaultLogger } from 'common/logging/default-logger';
import { UAParser } from 'ua-parser-js';
import { ChromeAdapter } from '../common/browser-adapters/chrome-adapter';
import { initializeFabricIcons } from '../common/fabric-icons';
import { createSupportedBrowserChecker } from '../common/is-supported-browser';
import { UrlParser } from '../common/url-parser';
import { UrlValidator } from '../common/url-validator';
import { PopupInitializer } from './popup-initializer';
import { TargetTabFinder } from './target-tab-finder';

initializeFabricIcons();
const browserAdapter = new ChromeAdapter();
const urlValidator = new UrlValidator(browserAdapter);
const targetTabFinder = new TargetTabFinder(window, browserAdapter, urlValidator, new UrlParser());
const userAgentParser = new UAParser(window.navigator.userAgent);
const isSupportedBrowser = createSupportedBrowserChecker(userAgentParser);
const popupInitializer: PopupInitializer = new PopupInitializer(
    browserAdapter,
    targetTabFinder,
    isSupportedBrowser,
    createDefaultLogger(),
);

// tslint:disable-next-line:no-floating-promises - top-level entry points are intentionally floating promises
popupInitializer.initialize();
