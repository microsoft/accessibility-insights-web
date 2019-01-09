// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { initializeFabricIcons } from '../../common/fabric-icons';
import { UrlParser } from '../../common/url-parser';
import { UrlValidator } from '../../common/url-validator';
import { ChromeAdapter } from './../../background/browser-adapter';
import { PopupInitializer } from './popup-initializer';
import { TargetTabFinder } from './target-tab-finder';

initializeFabricIcons();
const browserAdapter = new ChromeAdapter();
const urlValidator = new UrlValidator();
const targetTabFinder = new TargetTabFinder(window, browserAdapter, urlValidator, new UrlParser());
const popupInitializer: PopupInitializer = new PopupInitializer(browserAdapter, targetTabFinder);
popupInitializer.initialize();
