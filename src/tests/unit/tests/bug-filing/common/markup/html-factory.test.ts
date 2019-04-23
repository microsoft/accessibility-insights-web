// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock, MockBehavior } from 'typemoq';
import { createFactory } from '../../../../../../bug-filing/common/markup/html-factory';

describe('HTMLFactory', () => {
    const truncateMock = Mock.ofInstance((text: string) => text, MockBehavior.Strict);
    const testSubject = createFactory(truncateMock.object);

    it('applies bold to text', () => {
        const result = testSubject.bold('text');

        expect(result).toEqual('<b>text</b>');
    });

    it('returns section separator', () => {
        expect(testSubject.sectionSeparator()).toEqual('<br><br>');
    });

    it('returns new line', () => {
        expect(testSubject.newLine()).toEqual('<br>');
    });

    it('returns how to fix section', () => {
        const failureSummary = 'fix\n  1\n 2\n3\n4';

        const result = testSubject.howToFixSection(failureSummary);

        expect(result).toEqual('fix<br>- 1<br> 2<br>3<br>4');
    });

    describe('creates snippet', () => {
        truncateMock.setup(truncate => truncate(It.isAnyString())).returns(text => text);
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
