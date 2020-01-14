// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    CSS_MODULE_HASH_REPLACEMENT,
    formatHtmlForSnapshot,
    normalizeCssModuleClassNames,
    normalizeOfficeFabricGeneratedClassNames,
} from 'tests/common/element-snapshot-formatter';

describe('element-snapshot-formatter', () => {
    describe('normalize office fabric generated class names', () => {
        describe.each`
            actualClassName              | expectedClassName
            ${'thumb-123'}               | ${'thumb-000'}
            ${'ms-Panel-234'}            | ${'ms-Panel-000'}
            ${'thumb-321 ms-Panel-432'}  | ${'thumb-000 ms-Panel-000'}
            ${'no-numbers'}              | ${'no-numbers'}
            ${'no-numbers thumb-543'}    | ${'no-numbers thumb-000'}
            ${'Panel765-word'}           | ${'Panel000-word'}
            ${'Panel765-word thumb-123'} | ${'Panel000-word thumb-000'}
        `('normalize $actualClassName to $expectedClassName', ({ actualClassName, expectedClassName }) => {
            it('when in the class property', () => {
                const actualHtml = buildSimpleHtmlFragment('class', actualClassName);

                const result = normalizeOfficeFabricGeneratedClassNames(actualHtml);

                const expected = buildSimpleHtmlFragment('class', expectedClassName);

                expect(result).toEqual(expected);
            });

            it('when in the id property', () => {
                const actualHtml = buildSimpleHtmlFragment('id', actualClassName);

                const result = normalizeOfficeFabricGeneratedClassNames(actualHtml);

                const expected = buildSimpleHtmlFragment('id', expectedClassName);

                expect(result).toEqual(expected);
            });
        });
    });

    describe('normalize css module class names', () => {
        it.each`
            actualClassName      | expectedClassName
            ${'my-class--Fs0Df'} | ${`my-class--${CSS_MODULE_HASH_REPLACEMENT}`}
            ${'no-css-hash'}     | ${'no-css-hash'}
        `('normalize $actualClassName to $expectedClassName', ({ actualClassName, expectedClassName }) => {
            const actualHtml = buildSimpleHtmlFragment('class', actualClassName);

            const result = normalizeCssModuleClassNames(actualHtml);

            const expected = buildSimpleHtmlFragment('class', expectedClassName);

            expect(result).toEqual(expected);
        });
    });

    describe('format html for snapshot', () => {
        it.each`
            actualClassName
            ${'test-class-one test-class-two'}
            ${'ms-Panel-headerText header-text--0nPhV headerText-198'}
        `('normalizing $actualClassName', ({ actualClassName }) => {
            const actualHtml = buildSimpleHtmlFragment('class', actualClassName);

            const result = formatHtmlForSnapshot(actualHtml);

            expect(result).toMatchSnapshot();
        });
    });

    const buildSimpleHtmlFragment = (propertyName: string, propertyValue: string) => {
        return `<div><div ${propertyName}="${propertyValue}">Hello world!</div></div>`;
    };
});
