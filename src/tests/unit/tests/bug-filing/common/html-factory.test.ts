// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { repeat } from 'lodash';
import { HTMLFactory } from '../../../../../bug-filing/common/html-factory';

describe('HTMLFactory', () => {
    const testSubject = HTMLFactory;

    it('applies bold to text', () => {
        const result = testSubject.bold('text');

        expect(result).toEqual('<b>text</b>');
    });

    it('returns section separator', () => {
        expect(testSubject.sectionSeparator()).toEqual('<br><br>');
    });

    it('returns how to fix section', () => {
        const failureSummary = 'fix\n  1\n 2\n3\n4';

        const result = testSubject.howToFixSection(failureSummary);

        expect(result).toEqual('fix<br>- 1<br> 2<br>3<br>4');
    });

    describe('creates snippet', () => {
        it('handles short snippet text', () => {
            const result = testSubject.snippet('this is code');

            expect(result).toEqual('<code>this is code</code>');
        });

        it('handles long snippet text', () => {
            const text = repeat('a', 257);

            const result = testSubject.snippet(text);

            let expected = repeat('a', 256);
            expected = expected + '...';
            expected = `<code>${expected}</code>`;

            expect(result).toEqual(expected);
        });

        it('escapes properly', () => {
            const result = testSubject.snippet('<div>text</div>');

            const expected = '<code>&lt;div&gt;text&lt;/div&gt;</code>';
            expect(result).toEqual(expected);
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
