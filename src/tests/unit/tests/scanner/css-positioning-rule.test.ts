// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalMock, GlobalScope, IGlobalMock, It, MockBehavior, Times } from 'typemoq';

import { cssPositioningConfiguration } from '../../../../scanner/css-positioning-rule';
import { IDictionaryStringTo } from '../../../../scanner/dictionary-types';

describe('verify meaningful sequence configs', () => {
    it('should have correct props', () => {
        expect(cssPositioningConfiguration.rule.id).toBe('css-positioning');
        expect(cssPositioningConfiguration.rule.selector).toBe('*');
        expect(cssPositioningConfiguration.rule.any[0]).toBe('css-positioning');
        expect(cssPositioningConfiguration.rule.any.length).toBe(1);
        expect(cssPositioningConfiguration.checks[0].id).toBe('css-positioning');
        expect(cssPositioningConfiguration.checks[0].evaluate(null, null, null, null)).toBe(true);
    });
});

describe('verify evaluate', () => {
    const getComputedStyleMock = GlobalMock.ofInstance(window.getComputedStyle, 'getComputedStyle', window, MockBehavior.Strict);
    beforeEach(() => {
        getComputedStyleMock.reset();
    });

    it('position absolute', () => {
        const nodeStyleStub = {
            position: 'absolute',
            float: 'none',
        };

        testMeaningfulSequence(nodeStyleStub, getComputedStyleMock, true);
    });

    it('float right', () => {
        const nodeStyleStub = {
            position: 'none',
            float: 'right',
        };

        testMeaningfulSequence(nodeStyleStub, getComputedStyleMock, true);
    });

    it('does not match', () => {
        const nodeStyleStub = {
            position: 'none',
            float: 'none',
        };

        testMeaningfulSequence(nodeStyleStub, getComputedStyleMock, false);
    });
});

function testMeaningfulSequence(
    nodeStyleStub: IDictionaryStringTo<string>,
    windowMock: IGlobalMock<typeof window.getComputedStyle>,
    expectedResult: boolean,
): void {
    windowMock
        .setup(m => m(It.isAny()))
        .returns(style => ({ getPropertyValue: property => style[property] } as CSSStyleDeclaration))
        .verifiable(Times.once());

    let result: boolean;
    GlobalScope.using(windowMock).with(() => {
        result = cssPositioningConfiguration.rule.matches(nodeStyleStub, null);
    });
    expect(result).toBe(expectedResult);
    windowMock.verifyAll();
}
