// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// This must be the first import, otherwise importing webextension-polyfill from within
// adapter implementations will fail
import 'tests/unit/common/webextension-polyfill-setup';

import { BrowserAdapterFactory } from 'common/browser-adapters/browser-adapter-factory';
import { BrowserEventManager } from 'common/browser-adapters/browser-event-manager';
import { ChromiumAdapter } from 'common/browser-adapters/chromium-adapter';
import { FirefoxAdapter } from 'common/browser-adapters/firefox-adapter';
import { IMock, Mock } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';
import * as UAParser from 'ua-parser-js';
import { Events } from 'webextension-polyfill';

describe('BrowserAdapterFactory', () => {
    describe('makeFromUserAgent', () => {
        let mockUAParser: IMock<UAParser>;
        let mockBrowserEventManager: IMock<BrowserEventManager>;
        let testSubject: BrowserAdapterFactory;
        let browserEvents: DictionaryStringTo<Events.Event<any>>;

        beforeEach(() => {
            mockBrowserEventManager = Mock.ofType<BrowserEventManager>();
            mockUAParser = Mock.ofType<UAParser>();
            browserEvents = {};

            testSubject = new BrowserAdapterFactory(mockUAParser.object);
        });

        it('produces a FirefoxAdapter for a Gecko-engine user agent', () => {
            setupMockEngine('Gecko');
            expect(
                testSubject.makeFromUserAgent(mockBrowserEventManager.object, browserEvents, false),
            ).toBeInstanceOf(FirefoxAdapter);
        });

        it('produces a ChromiumAdapter for a WebKit-engine user agent (Chrome, new Edge)', () => {
            setupMockEngine('WebKit');
            expect(
                testSubject.makeFromUserAgent(mockBrowserEventManager.object, browserEvents, false),
            ).toBeInstanceOf(ChromiumAdapter);
        });

        it('produces a ChromiumAdapter as a fallback for an unrecognized user agent', () => {
            setupMockEngine('some unrecognized engine name');
            expect(
                testSubject.makeFromUserAgent(mockBrowserEventManager.object, browserEvents, false),
            ).toBeInstanceOf(ChromiumAdapter);
        });

        function setupMockEngine(engineName: string): void {
            mockUAParser
                .setup(m => m.getEngine())
                .returns(() => ({
                    name: engineName,
                    version: '0.0.0',
                }));
        }
    });
});
