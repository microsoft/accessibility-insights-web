// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior } from 'typemoq';

import { createFormatter } from '../../../../../../issue-filing/common/markup/markdown-formatter';
import { MarkupFormatter } from '../../../../../../issue-filing/common/markup/markup-formatter';

describe('MarkdownFormatter', () => {
    let truncateMock: IMock<(text: string) => string>;
    let testSubject: MarkupFormatter;

    beforeEach(() => {
        truncateMock = Mock.ofInstance((text: string) => text, MockBehavior.Strict);
        testSubject = createFormatter(truncateMock.object);
    });

    it('returns section header', () => {
        expect(testSubject.sectionHeader('test-header')).toEqual('#### test-header');
    });

    it('returns how to fix section', () => {
        const failureSummary = 'fix\n1\n2\n3\n4';

        const result = testSubject.howToFixSection(failureSummary);

        expect(result).toEqual('    fix\n    1\n    2\n    3\n    4');
    });

    it('returns section header separator', () => {
        expect(testSubject.sectionHeaderSeparator()).toBe('\n');
    });

    it('return footer separator', () => {
        expect(testSubject.footerSeparator()).toBe(null);
    });

    it('creates snippet', () => {
        truncateMock.setup(truncate => truncate(It.isAnyString())).returns(text => text);

        const result = testSubject.snippet('this is code');

        expect(result).toEqual(`\`this is code\``);
    });

    it('returns relatedPaths as a markdown list', () => {
        expect(testSubject.relatedPaths(['#path-a', '#path-b'])).toEqual('- #path-a\n- #path-b');
    });

    it('return new line', () => {
        expect(testSubject.sectionSeparator()).toBe('\n');
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
