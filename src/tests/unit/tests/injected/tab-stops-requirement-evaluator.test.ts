// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HTMLElementUtils } from 'common/html-element-utils';
import { DefaultTabStopsRequirementEvaluator } from 'injected/tab-stops-requirement-evaluator';
import { getUniqueSelector } from 'scanner/axe-utils';
import { FocusableElement } from 'tabbable';
import { IMock, It, Mock } from 'typemoq';

describe('TabStopsRequirementEvaluator', () => {
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    let generateSelectorMock: IMock<typeof getUniqueSelector>;
    let testSubject: DefaultTabStopsRequirementEvaluator;

    const tabStopElement1: HTMLElement = { tagName: 'element1' } as HTMLElement;
    const tabStopElement2: HTMLElement = { tagName: 'element2' } as HTMLElement;

    beforeEach(() => {
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);
        generateSelectorMock = Mock.ofType<typeof getUniqueSelector>();
        generateSelectorMock.setup(m => m(It.isAny())).returns(element => element.tagName);
        testSubject = new DefaultTabStopsRequirementEvaluator(
            htmlElementUtilsMock.object,
            generateSelectorMock.object,
        );
    });

    test('addKeyboardNavigationResults', () => {
        const tabbableTabStops = [
            tabStopElement1 as FocusableElement,
            tabStopElement2 as FocusableElement,
        ];
        const incorrectTabStops = new Set<HTMLElement>([tabStopElement2]);
        expect(
            testSubject.getKeyboardNavigationResults(tabbableTabStops, incorrectTabStops),
        ).toEqual([
            {
                description: testSubject.keyboardNavigationDescription('element1'),
            },
        ]);

        const correctTabStops = new Set<HTMLElement>([tabStopElement1, tabStopElement2]);
        expect(testSubject.getKeyboardNavigationResults(tabbableTabStops, correctTabStops)).toEqual(
            [],
        );
    });

    test('addFocusOrderResults', () => {
        htmlElementUtilsMock
            .setup(m => m.precedesInDOM(It.isAny(), It.isAny()))
            .returns(() => true);
        expect(testSubject.getFocusOrderResult(tabStopElement2, tabStopElement1)).toEqual([
            {
                description: testSubject.focusOrderDescription('element1', 'element2'),
            },
        ]);

        htmlElementUtilsMock
            .setup(m => m.precedesInDOM(It.isAny(), It.isAny()))
            .returns(() => false);
        expect(testSubject.getFocusOrderResult(tabStopElement1, tabStopElement2)).toEqual([]);
    });

    test('onKeydownForFocusTraps', async () => {
        expect(await testSubject.getKeyboardTrapResults(tabStopElement1, tabStopElement2)).toEqual(
            [],
        );

        expect(await testSubject.getKeyboardTrapResults(tabStopElement1, tabStopElement1)).toEqual([
            {
                description: testSubject.focusTrapsDescription('element1'),
            },
        ]);
    });
});
