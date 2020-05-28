// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { repeat } from 'lodash';
import {
    HTTPQueryBuilder,
    QueryParam,
} from '../../../../../issue-filing/common/http-query-builder';

describe('HTTPQueryBuilder', () => {
    const testUrl = 'https://some-test-url';

    let testSubject: HTTPQueryBuilder;

    beforeEach(() => {
        testSubject = new HTTPQueryBuilder();
    });

    it('builds with just base url', () => {
        const result = testSubject.withBaseUrl(testUrl).build();

        expect(result).toEqual(testUrl);
    });

    it('builds with params', () => {
        const result = testSubject
            .withBaseUrl(testUrl)
            .withParam('a', '1')
            .withParam('b', '2')
            .build();

        expect(result).toEqual(`${testUrl}?a=1&b=2`);
    });

    describe('encodes', () => {
        const testCases: QueryParam[] = [
            { name: 'a param', value: 'value&' },
            { name: '[param]', value: '(value)' },
            { name: 'name?', value: 'value"' },
        ];

        it.each(testCases)('%p', param => {
            const result = testSubject
                .withBaseUrl(testUrl)
                .withParam(param.name, param.value)
                .build();

            expect(result).toMatchSnapshot();
        });
    });

    describe('truncate urls', () => {
        const actualUrl1 = repeat('<-10->', 199);
        const actualUrl2 = actualUrl1 + '<-10->';
        const actualUrl3 = actualUrl1 + '<-11!->';
        const actualUrlNoHtmlTags = repeat('1', HTTPQueryBuilder.maxUrlLength);

        const expectedUrl1 = repeat('%3C-10-%3E', 199);
        const expectedUrl2 = expectedUrl1;
        const expectedUrl3 = expectedUrl1;
        const expectedUrlNoHtmlTags = actualUrlNoHtmlTags.substr(0, actualUrlNoHtmlTags.length - 3);

        const testCases = [
            [
                `length ${HTTPQueryBuilder.maxUrlLength - 1}, with html tags`,
                actualUrl1,
                expectedUrl1,
            ],
            [`length ${HTTPQueryBuilder.maxUrlLength}, with html tags`, actualUrl2, expectedUrl2],
            [
                `length ${HTTPQueryBuilder.maxUrlLength + 1}, with html tags`,
                actualUrl3,
                expectedUrl3,
            ],
            ['no html tags', actualUrlNoHtmlTags, expectedUrlNoHtmlTags],
        ];

        it.each(testCases)('of length %s', (name, actual, expected) => {
            const result = testSubject.withBaseUrl('').withParam('a', actual).build();

            expect(result).toEqual('?a=' + expected);
        });
    });
});
