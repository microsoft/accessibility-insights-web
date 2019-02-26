// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalMock, GlobalScope, IGlobalMock, It, MockBehavior, Times } from 'typemoq';

import { cssContentConfiguration } from '../../../../scanner/css-content-rule';

describe('verify meaningful semantic configs', () => {
    it('should have correct props', () => {
        expect(cssContentConfiguration.rule.id).toBe('css-content');
        expect(cssContentConfiguration.rule.selector).toBe('body');
        expect(cssContentConfiguration.rule.any[0]).toBe('css-content');
        expect(cssContentConfiguration.rule.any.length).toBe(1);
        expect(cssContentConfiguration.checks[0].id).toBe('css-content');
        expect(cssContentConfiguration.checks[0].evaluate(null, null, null, null)).toBe(true);
    });
});

describe('verify matches', () => {
    const windowMock = GlobalMock.ofInstance(window.getComputedStyle, 'getComputedStyle', window, MockBehavior.Strict);
    beforeEach(() => {
        windowMock.reset();
    });

    it('does not have any pseudoSelector', () => {
        const node = {
            content: 'none',
        };

        testSemantics(node, windowMock, false);
    });

    it('has before pseudoSelector and matches correctly identifies it', () => {
        const node = {
            content: 'test',
        };
        testSemantics(node, windowMock, true);
    });
});

function testSemantics(
    node: IDictionaryStringTo<string>,
    windowMock: IGlobalMock<typeof window.getComputedStyle>,
    expectedResult: boolean,
): void {
    let result: boolean;
    windowMock
        .setup(m => m(It.isAny(), It.isAny()))
        .returns(style => ({ getPropertyValue: property => style[property] } as CSSStyleDeclaration))
        .verifiable(Times.atLeastOnce());

    GlobalScope.using(windowMock).with(() => {
        result = cssContentConfiguration.rule.matches(node, null);
    });
    expect(result).toBe(expectedResult);
    windowMock.verifyAll();
}
