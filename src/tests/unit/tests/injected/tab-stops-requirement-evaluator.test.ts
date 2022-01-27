// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HTMLElementUtils } from 'common/html-element-utils';
import {
    DefaultTabStopsRequirementEvaluator,
    TabStopRequirementResult,
} from 'injected/tab-stops-requirement-evaluator';
import { getUniqueSelector } from 'scanner/axe-utils';
import { FocusableElement } from 'tabbable';
import { IMock, It, Mock } from 'typemoq';

describe('TabStopsRequirementEvaluator', () => {
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    let generateSelectorMock: IMock<typeof getUniqueSelector>;
    let testSubject: DefaultTabStopsRequirementEvaluator;

    const tabStopElement1: HTMLElement = { tagName: 'element1', outerHTML: 'html1' } as HTMLElement;
    const tabStopElement2: HTMLElement = { tagName: 'element2', outerHTML: 'html2' } as HTMLElement;

    beforeEach(() => {
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);
        generateSelectorMock = Mock.ofType<typeof getUniqueSelector>();
        generateSelectorMock.setup(m => m(It.isAny())).returns(element => element.tagName);
        testSubject = new DefaultTabStopsRequirementEvaluator(
            htmlElementUtilsMock.object,
            generateSelectorMock.object,
        );
    });

    test('addKeyboardNavigationResults returns violations', () => {
        const tabbableTabStops = [
            tabStopElement1 as FocusableElement,
            tabStopElement2 as FocusableElement,
        ];
        const incorrectTabStops = new Set<HTMLElement>([tabStopElement2]);
        const expectedResult: TabStopRequirementResult = {
            description: 'Element element1 was expected, but not reached in tab order',
            selector: ['element1'],
            html: 'html1',
            requirementId: 'keyboard-navigation',
        };
        expect(
            testSubject.getKeyboardNavigationResults(tabbableTabStops, incorrectTabStops),
        ).toEqual([expectedResult]);
    });

    test('addKeyboardNavigationResults returns empty set with no violations', () => {
        const tabbableTabStops = [
            tabStopElement1 as FocusableElement,
            tabStopElement2 as FocusableElement,
        ];
        const correctTabStops = new Set<HTMLElement>([tabStopElement1, tabStopElement2]);
        expect(testSubject.getKeyboardNavigationResults(tabbableTabStops, correctTabStops)).toEqual(
            [],
        );
    });

    test('addFocusOrderResults returns violations', () => {
        const expectedResult: TabStopRequirementResult = {
            description:
                'Element element1 precedes element2 but element2 was visited first in tab order',
            selector: ['element1'],
            html: 'html1',
            requirementId: 'tab-order',
        };

        htmlElementUtilsMock
            .setup(m => m.precedesInDOM(It.isAny(), It.isAny()))
            .returns(() => true);

        expect(testSubject.getFocusOrderResult(tabStopElement2, tabStopElement1)).toEqual(
            expectedResult,
        );
    });

    test('addFocusOrderResults returns null with no violations', () => {
        htmlElementUtilsMock
            .setup(m => m.precedesInDOM(It.isAny(), It.isAny()))
            .returns(() => false);
        expect(testSubject.getFocusOrderResult(tabStopElement1, tabStopElement2)).toEqual(null);
    });

    test('addTabbableFocusOrderResults returns empty with single tab element', () => {
        expect(testSubject.getTabbableFocusOrderResults([tabStopElement1])).toEqual([]);
    });

    test('addTabbableFocusOrderResults returns violations', () => {
        const expectedResult: TabStopRequirementResult = {
            description:
                'Element element1 precedes element2 but element2 was visited first in tab order',
            selector: ['element1'],
            html: 'html1',
            requirementId: 'tab-order',
        };

        htmlElementUtilsMock
            .setup(m => m.precedesInDOM(It.isAny(), It.isAny()))
            .returns(() => true);

        expect(
            testSubject.getTabbableFocusOrderResults([tabStopElement2, tabStopElement1]),
        ).toEqual([expectedResult]);
    });

    test('addTabbableFocusOrderResults returns empty set with no violations', () => {
        htmlElementUtilsMock
            .setup(m => m.precedesInDOM(It.isAny(), It.isAny()))
            .returns(() => false);
        expect(
            testSubject.getTabbableFocusOrderResults([tabStopElement1, tabStopElement2]),
        ).toEqual([]);
    });

    test('onKeydownForFocusTraps returns null with no violations', () => {
        expect(testSubject.getKeyboardTrapResults(tabStopElement1, tabStopElement2)).toEqual(null);
    });

    test('onKeydownForFocusTraps returns violations', () => {
        const expectedResult: TabStopRequirementResult = {
            description: 'Focus is still on element element1 500ms after pressing tab',
            selector: ['element1'],
            html: 'html1',
            requirementId: 'keyboard-traps',
        };

        expect(testSubject.getKeyboardTrapResults(tabStopElement1, tabStopElement1)).toEqual(
            expectedResult,
        );
    });
});
