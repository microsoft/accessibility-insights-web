// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalMock, GlobalScope, IGlobalMock, It, MockBehavior, Times, Mock } from 'typemoq';

import { cssContentConfiguration } from '../../../../scanner/css-content-rule';
import * as axe from 'axe-core';

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
    const axeVisibilityMock = GlobalMock.ofInstance(axe.commons.dom.isVisible, 'isVisible', axe.commons.dom, MockBehavior.Strict);

    beforeEach(() => {
        windowMock.reset();
    });

    // it('does not have any pseudoSelector', () => {
    //     const node = {
    //         content: 'none',
    //     };

    //     testSemantics(node, windowMock, false);
    // });

    it('has before pseudoSelector and matches correctly identifies it', () => {
        const testFixture: HTMLDivElement = document.createElement('div');

        const b: HTMLHeadingElement = document.createElement('h1');
        testFixture.appendChild(b);
        testSemantics(testFixture, b, ':before', windowMock, axeVisibilityMock, true);
    });
});

function testSemantics(
    node: HTMLElement,
    node2: HTMLElement,
    pseudoSelector: string,
    windowMock: IGlobalMock<typeof window.getComputedStyle>,
    axeVisibilityMock: IGlobalMock<typeof axe.commons.dom.isVisible>,
    expectedResult: boolean,
): void {
    let result: boolean;
    axeVisibilityMock.setup(v => v(node2)).returns(() => true);

    windowMock
        .setup(m => m(node2, It.isAny()))
        .returns(style => ({ content: 'test' } as CSSStyleDeclaration))
        .verifiable(Times.atLeastOnce());

    GlobalScope.using(windowMock, axeVisibilityMock).with(() => {
        result = cssContentConfiguration.rule.matches(node, null);
    });
    expect(result).toBe(expectedResult);
    windowMock.verifyAll();
}
