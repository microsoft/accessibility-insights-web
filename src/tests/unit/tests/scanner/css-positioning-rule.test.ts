// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as axe from 'axe-core';
import { GlobalMock, GlobalScope, It, MockBehavior, Times } from 'typemoq';

import { cssPositioningConfiguration } from '../../../../scanner/custom-rules/css-positioning-rule';
import { DictionaryStringTo } from '../../../../types/common-types';

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
    const axeVisibilityMock = GlobalMock.ofInstance(axe.commons.dom.isVisible, 'isVisible', axe.commons.dom, MockBehavior.Strict);

    beforeEach(() => {
        getComputedStyleMock.reset();
        axeVisibilityMock.reset();
    });

    afterEach(() => {
        getComputedStyleMock.verifyAll();
        axeVisibilityMock.verifyAll();
    });

    const testFixture = [
        {
            nodeStyleStub: {
                position: 'absolute',
                float: 'none',
            },
            isVisible: true,
            expectedResult: true,
        },
        {
            nodeStyleStub: {
                position: 'none',
                float: 'right',
            },
            isVisible: true,
            expectedResult: true,
        },
        {
            nodeStyleStub: {
                position: 'none',
                float: 'none',
            },
            isVisible: true,
            expectedResult: false,
        },
        {
            nodeStyleStub: {
                position: 'none',
                float: 'right',
            },
            isVisible: false,
            expectedResult: false,
        },
        {
            nodeStyleStub: {
                position: 'absolute',
                float: 'none',
            },
            isVisible: false,
            expectedResult: false,
        },
    ];

    it.each(testFixture)('check for different combinations of nodeStyleStub and visibility %o', testStub => {
        testMeaningfulSequence(testStub.nodeStyleStub, testStub.isVisible, testStub.expectedResult);
    });

    function testMeaningfulSequence(nodeStyleStub: DictionaryStringTo<string>, isVisibleParam: boolean, expectedResult: boolean): void {
        axeVisibilityMock
            .setup(isVisible => isVisible(nodeStyleStub))
            .returns(() => isVisibleParam)
            .verifiable();
        getComputedStyleMock
            .setup(m => m(It.isAny()))
            .returns(style => ({ getPropertyValue: property => style[property] } as CSSStyleDeclaration))
            .verifiable(Times.once());

        let result: boolean;
        GlobalScope.using(getComputedStyleMock, axeVisibilityMock).with(() => {
            result = cssPositioningConfiguration.rule.matches(nodeStyleStub, null);
        });
        expect(result).toBe(expectedResult);
    }
});
