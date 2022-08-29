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
            expect(testSubject.getIntParam(testCase.url, testCase.key)).toBe(
                testCase.expectedValue,
            );
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
            expect(testSubject.getIntParam(testCase.url, testCase.key)).toBeNull();
        });
    });

    describe('areURLsEqual', () => {
        it('should return false as the host names are not the same', () => {
            const urlA = 'http://test.com';
            const urlB = 'http://notsame.com';
            expect(testSubject.areURLsEqual(urlA, urlB)).toEqual(false);
        });
        it('should return true as the host names are the same', () => {
            const urlA = 'http://same.com';
            const urlB = 'http://same.com/randompath&someparam=true';
            expect(testSubject.areURLsEqual(urlA, urlB)).toEqual(true);
        });

        it('should return false it anything changes for a file url', () => {
            const urlA = 'file://same.com';
            const urlB = 'file://same2.com';

            expect(testSubject.areURLsEqual(urlA, urlB)).toEqual(false);
        });

        it('should return false when only protocol differs', () => {
            const urlA = 'http://same.com';
            const urlB = 'file://same.com';

            expect(testSubject.areURLsEqual(urlA, urlB)).toEqual(false);
        });
        it('should only return true when urls match exactly', () => {
            const urlA = 'file://same.com';
            const urlB = 'file://same.com';

            expect(testSubject.areURLsEqual(urlA, urlB)).toEqual(true);
        });

        it('should return false on any change', () => {
            const urlA = 'file://same.com';
            const urlB = 'file://same.com/randompath&someparam=true';

            expect(testSubject.areURLsEqual(urlA, urlB)).toEqual(false);
        });
    });

    describe('areURLsSameOrigin', () => {
        it.each`
            urlA                     | urlB
            ${'http://foo/bar'}      | ${'http://foo/bar'}
            ${'http://foo/bar'}      | ${'http://foo/baz'}
            ${'https://foo/bar'}     | ${'https://foo/baz'}
            ${'https://foo:123/bar'} | ${'https://foo:123/baz'}
            ${null}                  | ${null}
            ${undefined}             | ${undefined}
            ${'same invalid url!'}   | ${'same invalid url!'}
        `('returns true for same-origin urls $urlA and $urlB', ({ urlA, urlB }) => {
            expect(testSubject.areURLsSameOrigin(urlA, urlB)).toBe(true);
        });

        it.each`
            urlA                            | urlB
            ${'http://foo/bar'}             | ${'http://bar/bar'}
            ${'http://foo/bar'}             | ${'https://foo/bar'}
            ${'http://foo/bar'}             | ${'https://foo/baz'}
            ${'https://foo:123/'}           | ${'https://foo:456/'}
            ${'file:///any/file'}           | ${'file:///any/other-file'}
            ${'strange-protocol://foo'}     | ${'strange-protocol://bar'}
            ${'strange-protocol://foo/bar'} | ${'strange-protocol://foo/baz'}
            ${'https://foo:123/bar'}        | ${'http://foo:123/baz'}
            ${null}                         | ${undefined}
            ${null}                         | ${'invalid url!'}
            ${null}                         | ${'http://foo'}
            ${'invalid url!'}               | ${'http://foo'}
            ${'invalid url!'}               | ${'different invalid url!'}
        `('returns false for different-origin urls $urlA and $urlB', ({ urlA, urlB }) => {
            expect(testSubject.areURLsSameOrigin(urlA, urlB)).toBe(false);
        });
    });
});
