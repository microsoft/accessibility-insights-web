// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock, MockBehavior } from 'typemoq';
import { createFormatter } from '../../../../../../bug-filing/common/markup/markdown-formatter';

describe('MarkdownFormatter', () => {
    const truncateMock = Mock.ofInstance((text: string) => text, MockBehavior.Strict);
    const testSubject = createFormatter(truncateMock.object);

    it('returns section header', () => {
        expect(testSubject.sectionHeader('test-header')).toEqual('#### test-header');
    });

    it('returns how to fix section', () => {
        const failureSummary = 'fix\n1\n2\n3\n4';

        const result = testSubject.howToFixSection(failureSummary);

        expect(result).toEqual('    fix\n    1\n    2\n    3\n    4');
    });

    it('creates snippet', () => {
        truncateMock.setup(truncate => truncate(It.isAnyString())).returns(text => text);

        const result = testSubject.snippet('this is code');

        expect(result).toEqual(`\`this is code\``);
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
