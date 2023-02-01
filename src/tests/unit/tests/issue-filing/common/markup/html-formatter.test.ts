// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior } from 'typemoq';

import { createFormatter } from '../../../../../../issue-filing/common/markup/html-formatter';
import { MarkupFormatter } from '../../../../../../issue-filing/common/markup/markup-formatter';

describe('HTMLFormatter', () => {
    let truncateMock: IMock<(text: string) => string>;
    let testSubject: MarkupFormatter;

    beforeEach(() => {
        truncateMock = Mock.ofInstance((text: string) => text, MockBehavior.Strict);
        testSubject = createFormatter(truncateMock.object);
    });

    it('returns section header', () => {
        expect(testSubject.sectionHeader('test-header')).toEqual('<h4>test-header</h4>');
    });

    it('returns how to fix section', () => {
        const failureSummary = 'fix\n  1\n 2\n3\n4';

        const result = testSubject.howToFixSection(failureSummary);

        expect(result).toEqual('fix<br>- 1<br> 2<br>3<br>4');
    });

    it('returns section header separator', () => {
        expect(testSubject.sectionHeaderSeparator()).toBe(null);
    });

    it('returns footer separator', () => {
        expect(testSubject.footerSeparator()).toBe(null);
    });

    it('return new line', () => {
        expect(testSubject.sectionSeparator()).toBe('\n');
    });

    describe('creates snippet', () => {
        beforeEach(() => {
            truncateMock.setup(truncate => truncate(It.isAnyString())).returns(text => text);
        });

        it('no need to escape', () => {
            const result = testSubject.snippet('this is code');

            expect(result).toEqual('<code>this is code</code>');
        });

        it('escapes properly', () => {
            const result = testSubject.snippet('<div>text</div>');

            const expected = '<code>&lt;div&gt;text&lt;/div&gt;</code>';
            expect(result).toEqual(expected);
        });
    });

    describe('relatedPaths', () => {
        it('returns as an HTML list', () => {
            expect(testSubject.relatedPaths(['#path-a', '#path-b'])).toEqual(
                '<ul><li>#path-a</li><li>#path-b</li></ul>',
            );
        });

        it('escapes properly', () => {
            expect(testSubject.relatedPaths(['[attr="<script>"]'])).toEqual(
                '<ul><li>[attr=&quot;&lt;script&gt;&quot;]</li></ul>',
            );
        });
    });

    describe('creates link', () => {
        it('handles href only', () => {
            const result = testSubject.link('test-href');

            expect(result).toEqual('<a href="test-href">test-href</a>');
        });

        it('handles href and text', () => {
            const result = testSubject.link('test-href', 'test-text');

            expect(result).toEqual('<a href="test-href">test-text</a>');
        });
    });
});
