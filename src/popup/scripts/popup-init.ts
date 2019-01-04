// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { initializeFabricIcons } from '../../common/fabric-icons';
import { UrlValidator } from '../../common/url-validator';
import { ChromeAdapter } from './../../background/browser-adapter';
import { PopupInitializer } from './popup-initializer';

initializeFabricIcons();
const browserAdapter = new ChromeAdapter();
const urlValidator = new UrlValidator();
const popupInitializer: PopupInitializer = new PopupInitializer(browserAdapter, urlValidator);
popupInitializer.initialize();
