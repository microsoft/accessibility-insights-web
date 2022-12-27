// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FocusTrapsHandler } from 'injected/analyzers/focus-traps-handler';
import { TabStopsHandler } from 'injected/analyzers/tab-stops-handler';
import { TabStopRequirementOrchestrator } from 'injected/analyzers/tab-stops-orchestrator';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import { IMock, It, Mock, Times } from 'typemoq';

describe('TabStopRequirementOrchestrator', () => {
    let domMock: IMock<Document>;
    let tabStopsHandlerMock: IMock<TabStopsHandler>;
    let focusTrapsHandlerMock: IMock<FocusTrapsHandler>;
    let getUniqueSelectorMock: IMock<(e: HTMLElement) => string>;
    let reportResultsMock: IMock<(payload: AutomatedTabStopRequirementResult[]) => Promise<void>>;

    let tabStopRequirementResultStub: AutomatedTabStopRequirementResult;

    let focusInCallback: (event: Event) => void | Promise<void>;
    let keydownCallback: (event: Event) => void | Promise<void>;
    let resultCount: number;
    const focusedElement = { innerText: 'focused element' } as HTMLElement;

    let testSubject: TabStopRequirementOrchestrator;

    beforeEach(async () => {
        resultCount = 0;
        domMock = Mock.ofType<Document>();
        tabStopsHandlerMock = Mock.ofType<TabStopsHandler>();
        focusTrapsHandlerMock = Mock.ofType<FocusTrapsHandler>();
        getUniqueSelectorMock = Mock.ofType<(e: HTMLElement) => string>();
        reportResultsMock =
            Mock.ofType<(payload: AutomatedTabStopRequirementResult[]) => Promise<void>>();
        tabStopRequirementResultStub = {
            html: 'some html',
        } as AutomatedTabStopRequirementResult;

        testSubject = new TabStopRequirementOrchestrator(
            domMock.object,
            tabStopsHandlerMock.object,
            focusTrapsHandlerMock.object,
            getUniqueSelectorMock.object,
        );
    });

    afterEach(() => {
        domMock.verifyAll();
        tabStopsHandlerMock.verifyAll();
        focusTrapsHandlerMock.verifyAll();
        getUniqueSelectorMock.verifyAll();
        reportResultsMock.verifyAll();
    });

    test('start() initializes handlers, registers event listeners, and reports focus order results', async () => {
        setupStartTabStopsOrchestrator();

        await testSubject.start();
    });

    test('start() does not report results when there are none', async () => {
        tabStopsHandlerMock
            .setup(t => t.getTabbableFocusOrderResults())
            .returns(() => [])
            .verifiable();
        reportResultsMock.setup(m => m(It.isAny())).verifiable(Times.never());
        testSubject.setResultCallback(reportResultsMock.object);

        await testSubject.start();
    });

    test('transformChildResultForParent', () => {
        const frameStub = {} as HTMLIFrameElement;
        const frameSelectorStub = 'some selector';
        const selectorStub1 = 'selector 1';
        const selectorStub2 = 'selector 2';

        const results = [
            {
                selector: [selectorStub1],
            },
            {
                selector: [selectorStub2],
            },
        ] as AutomatedTabStopRequirementResult[];

        const expectedResults = [
            {
                selector: [frameSelectorStub, selectorStub1],
            },
            {
                selector: [frameSelectorStub, selectorStub2],
            },
        ];

        getUniqueSelectorMock
            .setup(m => m(frameStub))
            .returns(() => frameSelectorStub)
            .verifiable(Times.once());

        expect(testSubject.transformChildResultForParent(results, frameStub)).toEqual(
            expectedResults,
        );
    });

    test('stop removes event listeners and sends keyboard navigation results', async () => {
        setupStartTabStopsOrchestrator();
        const keyboardNavigationResultsStub = getTabStopRequirementResultStubs();

        await testSubject.start();

        domMock.setup(m => m.removeEventListener('focusin', focusInCallback)).verifiable();
        domMock.setup(m => m.removeEventListener('keydown', keydownCallback)).verifiable();
        tabStopsHandlerMock
            .setup(m => m.getKeyboardNavigationResults())
            .returns(() => keyboardNavigationResultsStub);
        reportResultsMock.setup(m => m(keyboardNavigationResultsStub)).verifiable(Times.once());

        await testSubject.stop();
    });

    test('stop() does not report results if there are none', async () => {
        setupStartTabStopsOrchestrator();
        await testSubject.start();

        tabStopsHandlerMock.setup(m => m.getKeyboardNavigationResults()).returns(() => []);
        reportResultsMock.reset();
        reportResultsMock.setup(m => m(It.isAny())).verifiable(Times.never());

        await testSubject.stop();
    });

    test('start: focus event with a non-null result is reported', async () => {
        await testOnFocusInWithResult(tabStopRequirementResultStub);
    });

    test('start: focus event with a null result is not reported', async () => {
        await testOnFocusInWithResult(null);
    });

    test('start: onKeydown tab event with a non-null result is reported', async () => {
        await testOnkeydownForFocusTrapsWithResult(tabStopRequirementResultStub);
    });

    test('start: onKeydown tab event with a null result and is not reported', async () => {
        await testOnkeydownForFocusTrapsWithResult(null);
    });

    test('onKeydown Does nothing if a key other than tab was pressed', async () => {
        const eventStub = { key: 'Enter' } as KeyboardEvent;

        setupStartTabStopsOrchestrator();
        focusTrapsHandlerMock.setup(k => k.handleTabPressed(It.isAny())).verifiable(Times.never());

        await testSubject.start();
        await keydownCallback(eventStub);
    });

    async function testOnFocusInWithResult(result: AutomatedTabStopRequirementResult | null) {
        const eventStub = {
            target: focusedElement as EventTarget,
        } as FocusEvent;

        setupStartTabStopsOrchestrator();
        tabStopsHandlerMock
            .setup(t => t.handleNewTabStop(focusedElement))
            .returns(() => Promise.resolve(result))
            .verifiable();
        reportResultsMock.setup(m => m([result])).verifiable(result ? Times.once() : Times.never());

        await testSubject.start();
        await focusInCallback(eventStub);
    }

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
        reportResultsMock.setup(m => m([result])).verifiable(result ? Times.once() : Times.never());

        await testSubject.start();
        await keydownCallback(eventStub);
    }

    function setupStartTabStopsOrchestrator() {
        focusTrapsHandlerMock.setup(f => f.initialize()).verifiable(Times.once());
        tabStopsHandlerMock.setup(t => t.initialize()).verifiable(Times.once());
        domMock
            .setup(m => m.addEventListener('keydown', It.isAny()))
            .callback((_, callback) => {
                keydownCallback = callback;
            })
            .verifiable();
        domMock
            .setup(m => m.addEventListener('focusin', It.isAny()))
            .callback((_, callback) => {
                focusInCallback = callback;
            })
            .verifiable();
        prepareTabbableFocusOrderResults();

        testSubject.setResultCallback(reportResultsMock.object);
    }

    function prepareTabbableFocusOrderResults() {
        const tabbableFocusOrderResults = getTabStopRequirementResultStubs();
        tabStopsHandlerMock
            .setup(t => t.getTabbableFocusOrderResults())
            .returns(() => tabbableFocusOrderResults)
            .verifiable();
        reportResultsMock.setup(m => m(tabbableFocusOrderResults)).verifiable(Times.once());
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
