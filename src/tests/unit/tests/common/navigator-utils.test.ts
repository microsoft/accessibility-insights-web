// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NavigatorUtils } from '../../../../common/navigator-utils';

describe('NavigatorUtilsTest', () => {
    test('getEnvironmentInfo: chrome', () => {
        validateBrowserSpecReturnedWithUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
            'Chrome version 65.0.3325.181',
        );
    });

    test('getEnvironmentInfo: edge', () => {
        validateBrowserSpecReturnedWithUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3763.0 Safari/537.36 Edg/75.0.131.0',
            'Edge version 75.0.131.0',
        );
    });

    test('getEnvironmentInfo: non-chrome environment', () => {
        const userAgent =
            'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1';
        validateBrowserSpecReturnedWithUserAgent(userAgent, userAgent);
    });

    function validateBrowserSpecReturnedWithUserAgent(userAgent: string, expected: string): void {
        const navigatorInfo = {
            userAgent: userAgent,
        };
        const testSubject = new NavigatorUtils(navigatorInfo as Navigator);
        const actual = testSubject.getBrowserSpec();
        expect(actual).toEqual(expected);
    }
});
