// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { repeat } from 'lodash';
import { HTTPQueryBuilder, QueryParam } from '../../../../../bug-filing/common/http-query-builder';

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

        it.each(testCases)('%o', param => {
            const result = testSubject
                .withBaseUrl(testUrl)
                .withParam(param.name, param.value)
                .build();

            expect(result).toMatchSnapshot();
        });
    });

    describe('truncate urls', () => {
        const actualUrl2990 = repeat('<-10->', 149);
        const actualUrl3000 = actualUrl2990 + '<-10->';
        const actualUrl3001 = actualUrl2990 + '<-11!->';
        const actualUrlNoHtmlTags = repeat('1', HTTPQueryBuilder.maxUrlLength);

        const expectedUrl2990 = repeat('%3C-10-%3E', 149);
        const expectedUrl3000 = expectedUrl2990;
        const expectedUrl3001 = expectedUrl2990;
        const expectedUrlNoHtmlTags = actualUrlNoHtmlTags.substr(0, actualUrlNoHtmlTags.length - 3);

        const testCases = [
            [`length ${HTTPQueryBuilder.maxUrlLength - 1}, with html tags`, actualUrl2990, expectedUrl2990],
            [`length ${HTTPQueryBuilder.maxUrlLength}, with html tags`, actualUrl3000, expectedUrl3000],
            [`length ${HTTPQueryBuilder.maxUrlLength + 1}, with html tags`, actualUrl3001, expectedUrl3001],
            ['no html tags', actualUrlNoHtmlTags, expectedUrlNoHtmlTags],
        ];

        it.each(testCases)('of length %s', (name, actual, expected) => {
            const result = testSubject
                .withBaseUrl('')
                .withParam('a', actual)
                .build();

            expect(result).toEqual('?a=' + expected);
        });
    });
});
