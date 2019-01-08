// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UrlParser } from '../../../../common/url-parser';

describe('UrlParserTest', () => {
    let testSubject: UrlParser;

    beforeEach(() => {
        testSubject = new UrlParser();
    });

    describe('getIntParam', () => {
        interface ValidCase {
            url: string;
            key: string;
            expectedValue: number;
        }

        const validCases: ValidCase[] = [
            {
                url: 'http://test.com/?key1=10&key2=12',
                key: 'key1',
                expectedValue: 10,
            },
            {
                url: 'http://test.com?key1=10&key2=12',
                key: 'key2',
                expectedValue: 12,
            },
        ];

        test.each(validCases)('return valid value', (testCase: ValidCase) => {
            expect(testSubject.getIntParam(testCase.url, testCase.key)).toBe(testCase.expectedValue);
        });

        interface InvalidCase {
            url: string;
            key: string;
        }
        const invalidCases: InvalidCase[] = [
            {
                url: 'http://test.com/key1=10',
                key: 'key1',
            },
            {
                url: 'http://test.com?key1=10',
                key: 'key2',
            },
            {
                url: 'http://test.com',
                key: 'key1',
            },
        ];

        test.each(invalidCases)('return invalid value', (testCase: ValidCase) => {
            expect(testSubject.getIntParam(testCase.url, testCase.key)).toBeNaN();
        });
    });
});
