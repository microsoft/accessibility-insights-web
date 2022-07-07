// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FocusTrapsHandler } from 'injected/analyzers/focus-traps-handler';
import { TabStopRequirementOrchestrator } from 'injected/analyzers/tab-stops-orchestrator';
import { TabStopsStateManager } from 'injected/analyzers/tab-stops-state-manager';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import { IMock, It, Mock, Times } from 'typemoq';

describe('TabStopRequirementOrchestrator', () => {
    let domMock: IMock<Document>;
    let tabStopsStateManagerMock: IMock<TabStopsStateManager>;
    let focusTrapsHandlerMock: IMock<FocusTrapsHandler>;
    let getUniqueSelectorMock: IMock<(e: HTMLElement) => string>;
    let reportResultsMock: IMock<(payload: AutomatedTabStopRequirementResult) => Promise<void>>;

    // let focusableElementsStub: FocusableElement[];
    let tabStopRequirementResultStub: AutomatedTabStopRequirementResult;

    let focusInCallback: (event: Event) => void | Promise<void>;
    let keydownCallback: (event: Event) => void | Promise<void>;
    let resultCount: number;

    let testSubject: TabStopRequirementOrchestrator;

    beforeEach(async () => {
        resultCount = 0;
        domMock = Mock.ofType<Document>();
        tabStopsStateManagerMock = Mock.ofType<TabStopsStateManager>();
        focusTrapsHandlerMock = Mock.ofType<FocusTrapsHandler>();
        getUniqueSelectorMock = Mock.ofType<(e: HTMLElement) => string>();
        reportResultsMock =
            Mock.ofType<(payload: AutomatedTabStopRequirementResult) => Promise<void>>();

        testSubject = new TabStopRequirementOrchestrator(
            domMock.object,
            tabStopsStateManagerMock.object,
            focusTrapsHandlerMock.object,
            getUniqueSelectorMock.object,
        );

        // focusableElementsStub = [
        //     {
        //         innerText: 'some focusable element',
        //     },
        // ] as FocusableElement[];
        tabStopRequirementResultStub = {
            html: 'some html',
        } as AutomatedTabStopRequirementResult;
    });

    afterEach(() => {
        domMock.verifyAll();
        tabStopsStateManagerMock.verifyAll();
        focusTrapsHandlerMock.verifyAll();
        getUniqueSelectorMock.verifyAll();
        reportResultsMock.verifyAll();
    });

    test('transformChildResultForParent', () => {
        const frameStub = {} as HTMLIFrameElement;
        const selectorStub = 'some selector';
        const anotherSelectorStub = 'some other selector';
        const result = {
            selector: [anotherSelectorStub],
        } as AutomatedTabStopRequirementResult;
        const expectedResult = {
            selector: [selectorStub, anotherSelectorStub],
        };

        getUniqueSelectorMock.setup(m => m(frameStub)).returns(() => selectorStub);

        expect(testSubject.transformChildResultForParent(result, frameStub)).toEqual(
            expectedResult,
        );
    });

    // test('addNewTabStop new and unique tabstop gets non-null result and reports it', async () => {
    //     const eventStub = {
    //         target: elementStub as EventTarget,
    //     } as Event;
    //     const newEventStub = {
    //         target: newElementStub as EventTarget,
    //     } as Event;

    //     tabStopsRequirementEvaluatorMock
    //         .setup(m => m.getFocusOrderResult(elementStub, newElementStub))
    //         .returns(() => tabStopRequirementResultStub);
    //     reportResultsMock.setup(m => m(tabStopRequirementResultStub)).verifiable(Times.once());

    //     testSubject.setResultCallback(reportResultsMock.object);
    //     await testSubject.start();
    //     await focusInCallback(eventStub);
    //     await focusInCallback(newEventStub);

    //     reportResultsMock.verifyAll();
    // });

    // test('addNewTabStop new and unique tabstop gets null result and does not report it', async () => {
    //     tabStopRequirementResultStub = null;
    //     const eventStub = {
    //         target: elementStub as EventTarget,
    //     } as Event;
    //     const newEventStub = {
    //         target: newElementStub as EventTarget,
    //     } as Event;

    //     tabStopsRequirementEvaluatorMock
    //         .setup(m => m.getFocusOrderResult(elementStub, newElementStub))
    //         .returns(() => tabStopRequirementResultStub);
    //     reportResultsMock.setup(m => m(tabStopRequirementResultStub)).verifiable(Times.never());

    //     testSubject.setResultCallback(reportResultsMock.object);
    //     await testSubject.start();
    //     await focusInCallback(eventStub);
    //     await focusInCallback(newEventStub);

    //     reportResultsMock.verifyAll();
    // });

    // test('start: addNewTabStop tab stop already seen, does nothing', async () => {
    //     const eventStub = {
    //         target: elementStub as EventTarget,
    //     } as Event;

    //     tabStopsRequirementEvaluatorMock
    //         .setup(m => m.getFocusOrderResult(It.isAny(), It.isAny()))
    //         .returns(() => tabStopRequirementResultStub);
    //     reportResultsMock.setup(m => m(tabStopRequirementResultStub)).verifiable(Times.never());

    //     testSubject.setResultCallback(reportResultsMock.object);
    //     await testSubject.start();
    //     await focusInCallback(eventStub);
    //     await focusInCallback(eventStub);

    //     reportResultsMock.verifyAll();
    // });

    test('stop removes event listeners and sends keyboard navigation results', async () => {
        setupStartTabStopsOrchestrator();
        const keyboardNavigationResultsStub = getTabStopRequirementResultStubs();

        testSubject.setResultCallback(reportResultsMock.object);
        await testSubject.start();

        domMock.setup(m => m.removeEventListener('focusin', focusInCallback)).verifiable();
        domMock.setup(m => m.removeEventListener('keydown', keydownCallback)).verifiable();
        tabStopsStateManagerMock
            .setup(m => m.getKeyboardNavigationResults())
            .returns(() => keyboardNavigationResultsStub);
        keyboardNavigationResultsStub.forEach(result => {
            reportResultsMock.setup(m => m(result)).verifiable(Times.once());
        });

        await testSubject.stop();
    });

    // test('stop does not resend stale events when called twice', async () => {
    //     const keyboardNavigationResultsStub = getTabStopRequirementResultStubs();
    //     testSubject.setResultCallback(reportResultsMock.object);
    //     await testSubject.start();

    //     domMock
    //         .setup(m => m.removeEventListener('focusin', focusInCallback))
    //         .verifiable(Times.exactly(2));
    //     domMock
    //         .setup(m => m.removeEventListener('keydown', keydownCallback))
    //         .verifiable(Times.exactly(2));
    //     tabStopsRequirementEvaluatorMock
    //         .setup(m =>
    //             m.getKeyboardNavigationResults(focusableElementsStub, It.isValue(new Set())),
    //         )
    //         .returns(() => keyboardNavigationResultsStub);
    //     keyboardNavigationResultsStub.forEach(result => {
    //         reportResultsMock.setup(m => m(result)).verifiable(Times.once());
    //     });

    //     await testSubject.stop();

    //     tabStopsRequirementEvaluatorMock.reset();
    //     tabStopsRequirementEvaluatorMock
    //         .setup(m => m.getKeyboardNavigationResults([], It.isValue(new Set())))
    //         .returns(() => [])
    //         .verifiable(Times.once());
    //     await testSubject.stop();
    //     tabStopsRequirementEvaluatorMock.verifyAll();

    //     domMock.verifyAll();
    //     reportResultsMock.verifyAll();
    // });

    test('start: onKeydownForFocusTraps tab event with a non-null result is reported', async () => {
        await testOnkeydownForFocusTrapsWithResult(tabStopRequirementResultStub);
    });

    test('start: onKeydownForFocusTraps tab event with a null result and is not reported', async () => {
        await testOnkeydownForFocusTrapsWithResult(null);
    });

    test('Does nothing if a key other than tab was pressed', async () => {
        const eventStub = { key: 'Enter' } as KeyboardEvent;

        setupStartTabStopsOrchestrator();
        focusTrapsHandlerMock.setup(k => k.handleTabPressed(It.isAny())).verifiable(Times.never());

        testSubject.setResultCallback(reportResultsMock.object);
        await testSubject.start();
        await keydownCallback(eventStub);
    });

    async function testOnkeydownForFocusTrapsWithResult(
        result: AutomatedTabStopRequirementResult | null,
    ) {
        const eventStub = {
            key: 'Tab',
        } as KeyboardEvent;

        setupStartTabStopsOrchestrator();
        focusTrapsHandlerMock
            .setup(k => k.handleTabPressed(domMock.object))
            .returns(async () => result)
            .verifiable();
        reportResultsMock.setup(m => m(result)).verifiable(result ? Times.once() : Times.never());

        testSubject.setResultCallback(reportResultsMock.object);
        await testSubject.start();
        await keydownCallback(eventStub);
    }

    function setupStartTabStopsOrchestrator() {
        focusTrapsHandlerMock.setup(f => f.initialize()).verifiable(Times.once());
        tabStopsStateManagerMock.setup(t => t.initialize()).verifiable(Times.once());
        domMock
            .setup(m => m.addEventListener('keydown', It.isAny()))
            .callback((_, callback) => {
                keydownCallback = callback;
            });
        domMock
            .setup(m => m.addEventListener('focusin', It.isAny()))
            .callback((_, callback) => {
                focusInCallback = callback;
            });
        prepareTabbableFocusOrderResults();
    }

    function prepareTabbableFocusOrderResults() {
        const tabbableFocusOrderResults = getTabStopRequirementResultStubs();
        tabStopsStateManagerMock
            .setup(t => t.getTabbableFocusOrderResults())
            .returns(() => tabbableFocusOrderResults);
        tabbableFocusOrderResults.forEach(result => {
            reportResultsMock.setup(m => m(result)).verifiable(Times.once());
        });
    }

    function getTabStopRequirementResultStubs(): AutomatedTabStopRequirementResult[] {
        const results = [
            {
                html: `result ${resultCount}`,
            },
            {
                html: `result ${resultCount + 1}`,
            },
        ] as AutomatedTabStopRequirementResult[];

        resultCount += 2;

        return results;
    }
});
