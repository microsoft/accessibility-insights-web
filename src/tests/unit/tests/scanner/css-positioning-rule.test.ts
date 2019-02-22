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
    const windowMock = GlobalMock.ofInstance(window.getComputedStyle, 'getComputedStyle', window, MockBehavior.Strict);
    beforeEach(() => {
        windowMock.reset();
    });

    it('position absolute', () => {
        const node = {
            position: 'absolute',
            float: 'none',
        };

        testMeaningfulSequence(node, windowMock, true);
    });

    it('float right', () => {
        const node = {
            position: 'none',
            float: 'right',
        };

        testMeaningfulSequence(node, windowMock, true);
    });

    it('does not match', () => {
        const node = {
            position: 'none',
            float: 'none',
        };

        testMeaningfulSequence(node, windowMock, false);
    });
});

function testMeaningfulSequence(
    node: IDictionaryStringTo<string>,
    windowMock: IGlobalMock<typeof window.getComputedStyle>,
    expectedResult: boolean,
): void {
    windowMock
        .setup(m => m(It.isAny()))
        .returns(style => ({ getPropertyValue: property => style[property] } as CSSStyleDeclaration))
        .verifiable(Times.once());

    let result: boolean;
    GlobalScope.using(windowMock).with(() => {
        result = cssPositioningConfiguration.rule.matches(node, null);
    });
    expect(result).toBe(expectedResult);
    windowMock.verifyAll();
}
