// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { NavigatorUtils } from 'common/navigator-utils';
import { It, Mock, Times } from 'typemoq';

describe('NavigatorUtils', () => {
    describe('getEnvironmentInfo', () => {
        it('understands Chrome user agents', () => {
            validateBrowserSpecReturnedWithUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                'Chrome version 65.0.3325.181',
            );
        });

        it('understands Edge user agents', () => {
            validateBrowserSpecReturnedWithUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3763.0 Safari/537.36 Edg/75.0.131.0',
                'Microsoft Edge version 75.0.131.0',
            );
        });

        it("uses treats non-chromium user agents' original user agent strings as browser specs", () => {
            const userAgent =
                'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1';
            validateBrowserSpecReturnedWithUserAgent(userAgent, userAgent);
        });

        function validateBrowserSpecReturnedWithUserAgent(
            userAgent: string,
            expected: string,
        ): void {
            const navigatorInfo = {
                userAgent: userAgent,
            };
            const loggerMock = Mock.ofType<Logger>();
            const testSubject = new NavigatorUtils(navigatorInfo as Navigator, loggerMock.object);
            const actual = testSubject.getBrowserSpec();
            expect(actual).toEqual(expected);
        }
    });

    describe('copyToClipboard', () => {
        it('logs an error and rethrows on underlying exception', async () => {
            const loggerMock = Mock.ofType<Logger>();
            const clipboardMock = Mock.ofType<Clipboard>();
            const mockNavigatorInfo = {
                clipboard: clipboardMock.object,
            } as Navigator;
            const testSubject = new NavigatorUtils(mockNavigatorInfo, loggerMock.object);

            const testError = new Error('test text');
            clipboardMock
                .setup(m => m.writeText(It.isAny()))
                .returns(() => Promise.reject(testError))
                .verifiable(Times.once());

            loggerMock
                .setup(l => l.error('Error during copyToClipboard: Error: test text', It.isAny()))
                .verifiable(Times.once());

            await expect(testSubject.copyToClipboard('irrelevant')).rejects.toBe(testError);

            clipboardMock.verifyAll();
            loggerMock.verifyAll();
        });

        it('passes through to the underlying Clipboard in the happy path', async () => {
            const loggerMock = Mock.ofType<Logger>();
            const clipboardMock = Mock.ofType<Clipboard>();
            const mockNavigatorInfo = {
                clipboard: clipboardMock.object,
            } as Navigator;
            const testSubject = new NavigatorUtils(mockNavigatorInfo, loggerMock.object);

            const testText = 'test text';
            clipboardMock
                .setup(m => m.writeText(testText))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            await testSubject.copyToClipboard(testText);

            clipboardMock.verifyAll();
        });
    });
});
