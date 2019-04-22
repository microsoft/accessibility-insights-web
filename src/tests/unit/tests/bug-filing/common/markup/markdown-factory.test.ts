// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { repeat } from 'lodash';
import { MarkdownFactory } from '../../../../../../bug-filing/common/markup/markdown-factory';

describe('MarkdownFactory', () => {
    const testSubject = MarkdownFactory;

    it('applies bold to text', () => {
        const result = testSubject.bold('text');

        expect(result).toEqual('**text**');
    });

    it('returns section separator', () => {
        expect(testSubject.sectionSeparator()).toEqual('');
    });

    it('returns how to fix section', () => {
        const failureSummary = 'fix\n1\n2\n3\n4';

        const result = testSubject.howToFixSection(failureSummary);

        expect(result).toEqual('    fix\n    1\n    2\n    3\n    4');
    });

    describe('creates snippet', () => {
        it('handles short snippet text', () => {
            const result = testSubject.snippet('this is code');

            expect(result).toEqual(`\`this is code\``);
        });

        it('handles long snippet text', () => {
            const text = repeat('a', 257);

            const result = testSubject.snippet(text);

            let expected = repeat('a', 256);
            expected = expected + '...';
            expected = `\`${expected}\``;

            expect(result).toEqual(expected);
        });
    });

    describe('creates link', () => {
        it('handles href only', () => {
            const result = testSubject.link('test-href');

            expect(result).toEqual(`[test-href](test-href)`);
        });

        it('handles href and text', () => {
            const result = testSubject.link('test-href', 'test-text');

            expect(result).toEqual('[test-text](test-href)');
        });
    });
});
