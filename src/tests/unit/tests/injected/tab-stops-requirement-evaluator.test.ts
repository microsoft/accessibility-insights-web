// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HTMLElementUtils } from 'common/html-element-utils';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import { DefaultTabStopsRequirementEvaluator } from 'injected/tab-stops-requirement-evaluator';
import { getAllUniqueSelectors, getUniqueSelector } from 'scanner/axe-utils';
import { IMock, It, Mock } from 'typemoq';

describe('TabStopsRequirementEvaluator', () => {
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    let generateSelectorMock: IMock<typeof getUniqueSelector>;
    let generateAllSelectorsMock: IMock<typeof getAllUniqueSelectors>;
    let testSubject: DefaultTabStopsRequirementEvaluator;

    const tabStopElement1: HTMLElement = { tagName: 'element1', outerHTML: 'html1' } as HTMLElement;
    const tabStopElement2: HTMLElement = { tagName: 'element2', outerHTML: 'html2' } as HTMLElement;

    beforeEach(() => {
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);
        generateSelectorMock = Mock.ofType<typeof getUniqueSelector>();
        generateAllSelectorsMock = Mock.ofType<typeof getAllUniqueSelectors>();
        generateAllSelectorsMock
            .setup(m => m(It.isAny()))
            .returns(elementArray => elementArray.map(e => e.tagName));
        generateSelectorMock.setup(m => m(It.isAny())).returns(element => element.tagName);
        testSubject = new DefaultTabStopsRequirementEvaluator(
            htmlElementUtilsMock.object,
            generateSelectorMock.object,
            generateAllSelectorsMock.object,
        );
    });

    test('addKeyboardNavigationResults returns violations', () => {
        const tabbableTabStops = [tabStopElement1, tabStopElement2];
        const incorrectTabStops = new Set<HTMLElement>([tabStopElement2]);
        const expectedResult: AutomatedTabStopRequirementResult = {
            description: '[Automatically detected, needs review] Unreachable element: element1.',
            selector: ['element1'],
            html: 'html1',
            requirementId: 'keyboard-navigation',
        };
        expect(
            testSubject.getKeyboardNavigationResults(tabbableTabStops, incorrectTabStops),
        ).toEqual([expectedResult]);
    });

    test('addKeyboardNavigationResults returns empty set with no tabbed elements', () => {
        expect(testSubject.getKeyboardNavigationResults(null, null)).toEqual([]);
    });

    test('addKeyboardNavigationResults returns empty set with no violations', () => {
        const tabbableTabStops = [tabStopElement1, tabStopElement2];
        const correctTabStops = new Set<HTMLElement>([tabStopElement1, tabStopElement2]);
        expect(testSubject.getKeyboardNavigationResults(tabbableTabStops, correctTabStops)).toEqual(
            [],
        );
    });

    test('addFocusOrderResults returns violations', () => {
        const expectedResult: AutomatedTabStopRequirementResult = {
            description:
                '[Automatically detected, needs review] Inconsistent tab order between elements. Starts at element2 and goes to element1.',
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
        const expectedResult: AutomatedTabStopRequirementResult = {
            description:
                '[Automatically detected, needs review] Inconsistent tab order between elements. Starts at element2 and goes to element1.',
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
        const expectedResult: AutomatedTabStopRequirementResult = {
            description:
                '[Automatically detected, needs review] Focus is still on element element1 500ms after pressing tab',
            selector: ['element1'],
            html: 'html1',
            requirementId: 'keyboard-traps',
        };

        expect(testSubject.getKeyboardTrapResults(tabStopElement1, tabStopElement1)).toEqual(
            expectedResult,
        );
    });
});
