// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CSS_MODULE_HASH_REPLACEMENT,
    formatHtmlForSnapshot,
    normalizeClassName,
    normalizeCssModuleClassName,
    normalizeId,
    normalizeOfficeFabricClassName,
} from 'tests/common/element-snapshot-formatter';

describe('element-snapshot-formatter', () => {
    describe('normalize office fabric id', () => {
        it.each`
            actualId               | expectedId
            ${'custom-id'}         | ${'custom-id'}
            ${'element1'}          | ${'element000'}
            ${'element2-label'}    | ${'element000-label'}
            ${'element-id3'}       | ${'element-id000'}
            ${'element-id4-label'} | ${'element-id000-label'}
        `('from id="$actualId" to id="${expectedId}"', ({ actualId, expectedId }) => {
            const actualHtml = buildSimpleHtmlFragment('id', actualId);

            const result = normalizeId(actualHtml);

            const expected = buildSimpleHtmlFragment('id', expectedId);

            expect(result).toEqual(expected);
        });

        it.each`
            actualId               | expectedId
            ${'custom-id'}         | ${'custom-id'}
            ${'element1'}          | ${'element000'}
            ${'element2-label'}    | ${'element000-label'}
            ${'element-id3'}       | ${'element-id000'}
            ${'element-id4-label'} | ${'element-id000-label'}
        `('from for="$actualId" to for="${expectedId}"', ({ actualId, expectedId }) => {
            const actualHtml = buildSimpleHtmlFragment('for', actualId);

            const result = normalizeId(actualHtml);

            const expected = buildSimpleHtmlFragment('for', expectedId);

            expect(result).toEqual(expected);
        });
    });

    describe('normalize office fabric class names', () => {
        it.each`
            actualClassName                               | expectedClassName
            ${'no-numbers'}                               | ${'no-numbers'}
            ${'first'}                                    | ${'first'}
            ${'thumb-123'}                                | ${'thumb-000'}
            ${'ms-Panel-234'}                             | ${'ms-Panel-000'}
            ${'Panel765-word'}                            | ${'Panel000-word'}
            ${`my-class--${CSS_MODULE_HASH_REPLACEMENT}`} | ${`my-class--${CSS_MODULE_HASH_REPLACEMENT}`}
        `(
            'from "$actualClassName" to "$expectedClassName"',
            ({ actualClassName, expectedClassName }) => {
                const result = normalizeOfficeFabricClassName(actualClassName);

                expect(result).toEqual(expectedClassName);
            },
        );
    });

    describe('normalize css module class names', () => {
        it.each`
            actualClassName      | expectedClassName
            ${'no-numbers'}      | ${'no-numbers'}
            ${'first'}           | ${'first'}
            ${'my-class--Fs0Df'} | ${`my-class--${CSS_MODULE_HASH_REPLACEMENT}`}
            ${'my-class--Fs_Df'} | ${`my-class--${CSS_MODULE_HASH_REPLACEMENT}`}
            ${'my-class--Fs-Df'} | ${`my-class--${CSS_MODULE_HASH_REPLACEMENT}`}
            ${'my-class-Fs0Df'}  | ${'my-class-Fs0Df'}
        `(
            'from "$actualClassName" to "$expectedClassName"',
            ({ actualClassName, expectedClassName }) => {
                const result = normalizeCssModuleClassName(actualClassName);

                expect(result).toEqual(expectedClassName);
            },
        );
    });

    describe('normalize class names', () => {
        it.each`
            actualClassName                                     | expectedClassName
            ${'first Panel765-word thumb-123 last'}             | ${`first Panel000-word thumb-000 last`}
            ${'first Panel765-word css-module--Fs0Df last'}     | ${`first Panel000-word css-module--${CSS_MODULE_HASH_REPLACEMENT} last`}
            ${'first css-module--Fs0Df last'}                   | ${`first css-module--${CSS_MODULE_HASH_REPLACEMENT} last`}
            ${'first css-module--Fs0Df css-module--Ax9Ea last'} | ${`first css-module--${CSS_MODULE_HASH_REPLACEMENT} css-module--${CSS_MODULE_HASH_REPLACEMENT} last`}
        `(
            'from "$actualClassName" to "$expectedClassName"',
            ({ actualClassName, expectedClassName }) => {
                const actualHtml = buildSimpleHtmlFragment('class', actualClassName);

                const result = normalizeClassName(actualHtml);

                const expected = buildSimpleHtmlFragment('class', expectedClassName);

                expect(result).toEqual(expected);
            },
        );
    });

    describe('format html for snapshot', () => {
        it.each`
            actualClassName                                                                                                      | actualId
            ${'test-class-one test-class-two'}                                                                                   | ${'custom-id'}
            ${'ms-Panel is-open ms-Panel--hasCloseButton ms-Panel--custom generic-panel--4CjX1 preview-features-panel root-127'} | ${'custom-id123'}
        `(
            'normalizing class = "$actualClassName" and id = "$actualId"',
            ({ actualClassName, actualId }) => {
                const htmlFragmentWithClass = buildSimpleHtmlFragment('class', actualClassName);
                const htmlFragmentWithId = buildSimpleHtmlFragment('id', actualId);

                const actualHtml = `<div>${htmlFragmentWithClass}${htmlFragmentWithId}</div>`;

                const result = formatHtmlForSnapshot(actualHtml);

                expect(result).toMatchSnapshot();
            },
        );
    });

    const buildSimpleHtmlFragment = (propertyName: string, propertyValue: string) => {
        return `<div><div ${propertyName}="${propertyValue}">Hello world!</div></div>`;
    };
});
