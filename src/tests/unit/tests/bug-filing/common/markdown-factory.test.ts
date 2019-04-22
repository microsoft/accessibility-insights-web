// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MarkdownFactory } from '../../../../../bug-filing/common/markdown-factory';

describe('MarkdownFactory', () => {
    const testSubject = MarkdownFactory;

    it('applies bold to text', () => {
        const result = testSubject.bold('text');

        expect(result).toEqual('**text**');
    });

    describe('creates snippet', () => {
        const testCases = ['this is code', 'this    is code', 'this is code    ', '    this is code'];

        it.each(testCases)('%#', text => {
            const result = testSubject.snippet(text);

            expect(result).toEqual(`\`this is code\``);
        });
    });

    describe('create link', () => {
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
