// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { withAxeCommonsMocked } from 'tests/unit/tests/scanner/mock-axe-utils';
import { GlobalMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { cssContentConfiguration } from '../../../../../scanner/custom-rules/css-content-rule';

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
    let divElementFixture: HTMLDivElement;
    let headingElementFixture: HTMLHeadingElement;

    const getComputedStyleMock = GlobalMock.ofInstance(
        window.getComputedStyle,
        'getComputedStyle',
        window,
        MockBehavior.Strict,
    );
    const axeVisibilityMock = Mock.ofInstance(n => true, MockBehavior.Strict);

    beforeEach(() => {
        divElementFixture = document.createElement('div');
        headingElementFixture = document.createElement('h1');
        divElementFixture.appendChild(headingElementFixture);

        getComputedStyleMock.reset();
        axeVisibilityMock.reset();
    });

    afterEach(() => {
        axeVisibilityMock.verifyAll();
        getComputedStyleMock.verifyAll();
    });

    const selectors = [':before', ':after'];

    function checkIfSelectorIsValid(x): boolean {
        return selectors.indexOf(x) !== -1;
    }

    const isElementVisible = [true, false];

    test.each(isElementVisible)(
        'element has pseudo selector but isVisible is toggled: %s',
        isVisibleParam => {
            axeVisibilityMock
                .setup(isVisible => isVisible(headingElementFixture))
                .returns(() => isVisibleParam)
                .verifiable();

            getComputedStyleMock
                .setup(getComputedStyle =>
                    getComputedStyle(headingElementFixture, It.is(checkIfSelectorIsValid)),
                )
                .returns(style => ({ content: 'test' } as CSSStyleDeclaration))
                .verifiable(Times.atLeastOnce());

            withAxeCommonsMocked(
                'dom',
                {
                    isVisible: axeVisibilityMock.object,
                },
                () => {
                    const result = cssContentConfiguration.rule.matches(divElementFixture, null);
                    expect(result).toBe(isVisibleParam);
                },
                [getComputedStyleMock],
            );
        },
    );

    const contentSwitchParameters = [
        { pseudoSelectorContent: 'none', testExpectation: false },
        { pseudoSelectorContent: 'non-none', testExpectation: true },
    ];
    test.each(contentSwitchParameters)(
        'element isVisible but pseudo selector content is toggled: %p',
        testCaseParameters => {
            axeVisibilityMock
                .setup(isVisible => isVisible(headingElementFixture))
                .returns(() => true)
                .verifiable();

            getComputedStyleMock
                .setup(getComputedStyle =>
                    getComputedStyle(headingElementFixture, It.is(checkIfSelectorIsValid)),
                )
                .returns(
                    style =>
                        ({
                            content: testCaseParameters.pseudoSelectorContent,
                        } as CSSStyleDeclaration),
                )
                .verifiable(Times.atLeastOnce());

            withAxeCommonsMocked(
                'dom',
                {
                    isVisible: axeVisibilityMock.object,
                },
                () => {
                    const result = cssContentConfiguration.rule.matches(divElementFixture, null);
                    expect(result).toBe(testCaseParameters.testExpectation);
                },
                [getComputedStyleMock],
            );
        },
    );
});
