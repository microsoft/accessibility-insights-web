// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopsHandler } from 'injected/analyzers/tab-stops-handler';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import { TabStopsRequirementEvaluator } from 'injected/tab-stops-requirement-evaluator';
import { TabbableElementGetter } from 'injected/tabbable-element-getter';
import { IMock, Mock } from 'typemoq';

describe(TabStopsHandler, () => {
    let tabbableElementGetterMock: IMock<TabbableElementGetter>;
    let requirementEvaluatorMock: IMock<TabStopsRequirementEvaluator>;

    const firstTabStop = { innerText: 'first tab stop' } as HTMLElement;
    const currentTabStop = { innerText: 'new tab stop' } as HTMLElement;
    const anotherTabStop = { innerText: 'another tab stop' } as HTMLElement;
    let tabbableElementsStub: HTMLElement[];
    const resultStub: AutomatedTabStopRequirementResult = {
        selector: [' selector'],
    } as AutomatedTabStopRequirementResult;

    let testSubject: TabStopsHandler;

    beforeEach(() => {
        tabbableElementsStub = [
            { innerText: 'tabbabble element 1' },
            { innerText: 'tabbabble element 2' },
        ] as HTMLElement[];
        tabbableElementGetterMock = Mock.ofType<TabbableElementGetter>();
        requirementEvaluatorMock = Mock.ofType<TabStopsRequirementEvaluator>();

        tabbableElementGetterMock
            .setup(t => t.getRawElements())
            .returns(() => tabbableElementsStub);

        testSubject = new TabStopsHandler(
            requirementEvaluatorMock.object,
            tabbableElementGetterMock.object,
        );
        testSubject.initialize();
    });

    afterEach(() => {
        requirementEvaluatorMock.verifyAll();
        tabbableElementGetterMock.verifyAll();
    });

    it('getTabbabbleFocusOrderResults() calls requirement evaluator with tabbabble elements', () => {
        requirementEvaluatorMock
            .setup(r => r.getTabbableFocusOrderResults(tabbableElementsStub))
            .returns(() => [resultStub]);

        const results = testSubject.getTabbableFocusOrderResults();

        expect(results).toEqual([resultStub]);
    });

    it('First tab stop returns null', async () => {
        await testTabStopSequence([firstTabStop], [null]);
    });

    it('Handling a new tab stop after first tab stop returns expected result', async () => {
        requirementEvaluatorMock
            .setup(r => r.getFocusOrderResult(firstTabStop, currentTabStop))
            .returns(() => resultStub);

        await testTabStopSequence([firstTabStop, currentTabStop], [null, resultStub]);
    });

    it('Handling a previously-visited tab stop returns null', async () => {
        requirementEvaluatorMock
            .setup(r => r.getFocusOrderResult(firstTabStop, anotherTabStop))
            .returns(() => resultStub);

        await testTabStopSequence(
            [firstTabStop, anotherTabStop, firstTabStop],
            [null, resultStub, null],
        );
    });

    it('Handling a new tab stop after a previously-visited tab stop returns expected results', async () => {
        requirementEvaluatorMock
            .setup(r => r.getFocusOrderResult(firstTabStop, currentTabStop))
            .returns(() => resultStub);

        await testTabStopSequence(
            [firstTabStop, firstTabStop, currentTabStop],
            [null, null, resultStub],
        );
    });

    it('Handling a new tab stop after another new tab stop returns expected results', async () => {
        const previousResultStub: AutomatedTabStopRequirementResult = {
            selector: ['another selector'],
        } as AutomatedTabStopRequirementResult;

        requirementEvaluatorMock
            .setup(r => r.getFocusOrderResult(firstTabStop, anotherTabStop))
            .returns(() => previousResultStub);

        requirementEvaluatorMock
            .setup(r => r.getFocusOrderResult(anotherTabStop, currentTabStop))
            .returns(() => resultStub);

        await testTabStopSequence(
            [firstTabStop, anotherTabStop, currentTabStop],
            [null, previousResultStub, resultStub],
        );
    });

    it('initialize() after handling tab stops gets tabbabble elements again and resets state', async () => {
        await testSubject.handleNewTabStop(firstTabStop);
        await testSubject.handleNewTabStop(anotherTabStop);

        tabbableElementsStub = [
            { innerText: 'tabbabble element 3' } as HTMLElement,
            { innerText: 'tabbabble element 4' } as HTMLElement,
        ];
        requirementEvaluatorMock.reset();
        requirementEvaluatorMock
            .setup(r => r.getTabbableFocusOrderResults(tabbableElementsStub))
            .returns(() => [resultStub]);

        testSubject.initialize();

        expect(testSubject.getTabbableFocusOrderResults()).toEqual([resultStub]);

        requirementEvaluatorMock
            .setup(r => r.getFocusOrderResult(firstTabStop, currentTabStop))
            .returns(() => resultStub)
            .verifiable();

        await testTabStopSequence([firstTabStop, currentTabStop], [null, resultStub]);
    });

    it('getKeyboardNavigationResults() calls tabStopsRequirementEvaluator with expected arguments', () => {
        requirementEvaluatorMock
            .setup(r => r.getKeyboardNavigationResults(tabbableElementsStub, new Set()))
            .returns(() => [resultStub])
            .verifiable();

        const results = testSubject.getKeyboardNavigationResults();
        expect(results).toEqual([resultStub]);
    });

    async function testTabStopSequence(
        tabStopSequence: HTMLElement[],
        expectedResults: (AutomatedTabStopRequirementResult | null)[],
    ): Promise<void> {
        for (let i = 0; i < tabStopSequence.length; i++) {
            const tabStop = tabStopSequence[i];
            const expectedResult = expectedResults[i];

            expect(await testSubject.handleNewTabStop(tabStop)).toBe(expectedResult);
        }

        verifyKeyboardNavigationResults(tabStopSequence);
    }

    function verifyKeyboardNavigationResults(expectedVisitedTabStops: HTMLElement[]): void {
        requirementEvaluatorMock
            .setup(r =>
                r.getKeyboardNavigationResults(
                    tabbableElementsStub,
                    new Set(expectedVisitedTabStops),
                ),
            )
            .returns(() => [resultStub])
            .verifiable();

        const results = testSubject.getKeyboardNavigationResults();
        expect(results).toEqual([resultStub]);
    }
});
