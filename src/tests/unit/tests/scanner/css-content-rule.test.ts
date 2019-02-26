// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as axe from 'axe-core';
import { GlobalMock, GlobalScope, It, MockBehavior, Times } from 'typemoq';

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
    let divElementFixture: HTMLDivElement;
    let headingElementFixture: HTMLHeadingElement;

    const getComputedStyleMock = GlobalMock.ofInstance(window.getComputedStyle, 'getComputedStyle', window, MockBehavior.Strict);
    const axeVisibilityMock = GlobalMock.ofInstance(axe.commons.dom.isVisible, 'isVisible', axe.commons.dom, MockBehavior.Strict);

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

    it('element is visible and has pseudo selector', () => {
        axeVisibilityMock
            .setup(isVisible => isVisible(headingElementFixture))
            .returns(() => true)
            .verifiable();

        getComputedStyleMock
            .setup(getComputedStyle => getComputedStyle(headingElementFixture, It.is(checkIfSelectorIsValid)))
            .returns(style => ({ content: 'test' } as CSSStyleDeclaration))
            .verifiable(Times.atLeastOnce());

        testSemantics(divElementFixture, true);
    });

    it('element is not visible and has pseudo selector', () => {
        axeVisibilityMock
            .setup(isVisible => isVisible(headingElementFixture))
            .returns(() => false)
            .verifiable();

        getComputedStyleMock
            .setup(getComputedStyle => getComputedStyle(headingElementFixture, It.is(checkIfSelectorIsValid)))
            .returns(style => ({ content: 'test' } as CSSStyleDeclaration))
            .verifiable(Times.atLeastOnce());

        testSemantics(divElementFixture, false);
    });

    it("element is visible but doesn't have pseudo selectors", () => {
        axeVisibilityMock
            .setup(isVisible => isVisible(headingElementFixture))
            .returns(() => true)
            .verifiable();

        getComputedStyleMock
            .setup(getComputedStyle => getComputedStyle(headingElementFixture, It.is(checkIfSelectorIsValid)))
            .returns(style => ({ content: 'none' } as CSSStyleDeclaration))
            .verifiable(Times.atLeastOnce());

        testSemantics(divElementFixture, false);
    });

    it('element is visible & test for :after selector', () => {
        axeVisibilityMock
            .setup(isVisible => isVisible(headingElementFixture))
            .returns(() => true)
            .verifiable();

        getComputedStyleMock
            .setup(getComputedStyle => getComputedStyle(headingElementFixture, It.is(checkIfSelectorIsValid)))
            .returns(style => ({ content: 'test' } as CSSStyleDeclaration))
            .verifiable(Times.atLeastOnce());

        testSemantics(divElementFixture, true);
    });

    it('element is not visible & test for :after selector', () => {
        axeVisibilityMock
            .setup(isVisible => isVisible(headingElementFixture))
            .returns(() => false)
            .verifiable();

        getComputedStyleMock
            .setup(getComputedStyle => getComputedStyle(headingElementFixture, It.is(checkIfSelectorIsValid)))
            .returns(style => ({ content: 'test' } as CSSStyleDeclaration))
            .verifiable(Times.atLeastOnce());

        testSemantics(divElementFixture, false);
    });

    function testSemantics(elements: HTMLElement, expectedResult: boolean): void {
        let result: boolean;

        GlobalScope.using(getComputedStyleMock, axeVisibilityMock).with(() => {
            result = cssContentConfiguration.rule.matches(elements, null);
        });
        expect(result).toBe(expectedResult);
    }
});
