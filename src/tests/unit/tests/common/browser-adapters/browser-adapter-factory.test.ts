// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// This must be the first import, otherwise importing webextension-polyfill-ts from within
// adapter implementations will fail
import 'tests/unit/common/webextension-polyfill-ts-setup';

import { BrowserAdapterFactory } from 'common/browser-adapters/browser-adapter-factory';
import { ChromiumAdapter } from 'common/browser-adapters/chromium-adapter';
import { FirefoxAdapter } from 'common/browser-adapters/firefox-adapter';
import { IMock, Mock } from 'typemoq';
import * as UAParser from 'ua-parser-js';

describe('BrowserAdapterFactory', () => {
    describe('makeFromUserAgent', () => {
        let mockUAParser: IMock<UAParser>;

        it('produces a FirefoxAdapter for a Gecko-engine user agent', () => {
            setupMockEngine('Gecko');
            const testSubject = new BrowserAdapterFactory(mockUAParser.object);
            expect(testSubject.makeFromUserAgent()).toBeInstanceOf(FirefoxAdapter);
        });

        it('produces a ChromiumAdapter for a WebKit-engine user agent (Chrome, new Edge)', () => {
            setupMockEngine('WebKit');
            const testSubject = new BrowserAdapterFactory(mockUAParser.object);
            expect(testSubject.makeFromUserAgent()).toBeInstanceOf(ChromiumAdapter);
        });

        it('produces a ChromiumAdapter as a fallback for an unrecognized user agent', () => {
            setupMockEngine('some unrecognized engine name');
            const testSubject = new BrowserAdapterFactory(mockUAParser.object);
            expect(testSubject.makeFromUserAgent()).toBeInstanceOf(ChromiumAdapter);
        });

        beforeEach(() => {
            mockUAParser = Mock.ofType<UAParser>();
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
