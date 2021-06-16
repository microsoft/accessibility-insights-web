// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapterFactory } from 'common/browser-adapters/browser-adapter-factory';
import { HTMLElementUtils } from 'common/html-element-utils';
import { createDefaultLogger } from 'common/logging/default-logger';
import { SelfFastPass, SelfFastPassContainer } from 'common/self-fast-pass';
import { ScannerUtils } from 'injected/scanner-utils';
import { scan } from 'scanner/exposed-apis';
import * as UAParser from 'ua-parser-js';
import { rendererDependencies } from './dependencies';
import { renderer } from './renderer';

declare const window: SelfFastPassContainer & Window;

const userAgentParser = new UAParser(window.navigator.userAgent);
const browserAdapterFactory = new BrowserAdapterFactory(userAgentParser);
const browserAdapter = browserAdapterFactory.makeFromUserAgent();

const logger = createDefaultLogger();
renderer(rendererDependencies(browserAdapter, logger));

const selfFastPass = new SelfFastPass(
    new ScannerUtils(scan, logger),
    new HTMLElementUtils(),
    logger,
);
window.selfFastPass = selfFastPass;
