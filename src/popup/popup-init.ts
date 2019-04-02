// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChromeAdapter } from '../background/browser-adapter';
import { initializeFabricIcons } from '../common/fabric-icons';
import { UrlParser } from '../common/url-parser';
import { UrlValidator } from '../common/url-validator';
import { PopupInitializer } from './popup-initializer';
import { TargetTabFinder } from './target-tab-finder';

initializeFabricIcons();
const browserAdapter = new ChromeAdapter();
const urlValidator = new UrlValidator();
const targetTabFinder = new TargetTabFinder(window, browserAdapter, urlValidator, new UrlParser());
const popupInitializer: PopupInitializer = new PopupInitializer(browserAdapter, targetTabFinder);

// tslint:disable-next-line:no-floating-promises - top-level entry points are intentionally floating promises
popupInitializer.initialize();
