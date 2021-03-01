// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { A11YSelfValidator } from 'common/a11y-self-validator';
import { BrowserAdapterFactory } from 'common/browser-adapters/browser-adapter-factory';
import { HTMLElementUtils } from 'common/html-element-utils';
import { createDefaultLogger } from 'common/logging/default-logger';
import { ScannerUtils } from 'injected/scanner-utils';
import { scan } from 'scanner/exposed-apis';
import * as UAParser from 'ua-parser-js';
import { rendererDependencies } from './dependencies';
import { renderer } from './renderer';

const userAgentParser = new UAParser(window.navigator.userAgent);
const browserAdapterFactory = new BrowserAdapterFactory(userAgentParser);
const browserAdapter = browserAdapterFactory.makeFromUserAgent();

const logger = createDefaultLogger();
renderer(rendererDependencies(browserAdapter, logger));

const a11ySelfValidator = new A11YSelfValidator(
    new ScannerUtils(scan, logger),
    new HTMLElementUtils(),
    logger,
);
(window as any).A11YSelfValidator = a11ySelfValidator;
