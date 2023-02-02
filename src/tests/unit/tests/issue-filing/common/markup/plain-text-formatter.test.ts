// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MarkupFormatter } from '../../../../../../issue-filing/common/markup/markup-formatter';
import { PlainTextFormatter } from '../../../../../../issue-filing/common/markup/plain-text-formatter';

describe('PlainTextFormatter', () => {
    let testSubject: MarkupFormatter;

    beforeEach(() => {
        testSubject = PlainTextFormatter;
    });

    it('returns section header', () => {
        expect(testSubject.sectionHeader('test-section-header')).toEqual('test-section-header');
    });

    it('returns how to fix section', () => {
        expect(testSubject.howToFixSection('test-failure-summary')).toEqual(
            '\ntest-failure-summary',
        );
    });

    it('returns section header separator', () => {
        expect(testSubject.sectionHeaderSeparator()).toEqual(': ');
    });

    it('returns footer separator', () => {
        expect(testSubject.footerSeparator()).toEqual('====\n\n');
    });

    it('returns snippet', () => {
        expect(testSubject.snippet('   snippet with      spaces  ')).toEqual('snippet with spaces');
    });

    it('returns relatedPaths as separate indented lines', () => {
        expect(testSubject.relatedPaths(['#path-a', '#path-b'])).toEqual('\n  #path-a\n  #path-b');
    });

    it('return new line', () => {
        expect(testSubject.sectionSeparator()).toBe('\n\n');
    });

    describe('creates link', () => {
        it('handles href only', () => {
            expect(testSubject.link('test-href')).toEqual('test-href');
        });

        it('handles href and text', () => {
            expect(testSubject.link('test-href', 'test-text')).toEqual('test-text - test-href');
        });
    });
});
