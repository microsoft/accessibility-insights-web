// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTTPQueryBuilder, QueryParam } from '../../../../../bug-filing/common/http-query-builder';
import { repeat } from 'lodash';

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

    it('truncates long urls', () => {
        const result = testSubject
            .withBaseUrl(testUrl)
            .withParam('a', repeat('1', HTTPQueryBuilder.maxUrlLength))
            .build();

        expect(result).toHaveLength(HTTPQueryBuilder.maxUrlLength);
    });
});
