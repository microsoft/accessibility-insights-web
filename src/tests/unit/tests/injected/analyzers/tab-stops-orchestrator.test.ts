// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { WindowUtils } from 'common/window-utils';
import { TabStopRequirementOrchestrator } from 'injected/analyzers/tab-stops-orchestrator';
import {
    TabStopRequirementResult,
    TabStopsRequirementEvaluator,
} from 'injected/tab-stops-requirement-evaluator';
import { TabbableElementGetter } from 'injected/tabbable-element-getter';
import { FocusableElement } from 'tabbable';
import { IMock, It, Mock, Times } from 'typemoq';

describe('TabStopRequirementOrchestrator', () => {
    let domMock: IMock<Document>;
    let tabbabbleElementGetterMock: IMock<TabbableElementGetter>;
    let windowUtilsMock: IMock<WindowUtils>;
    let tabStopsRequirementEvaluatorMock: IMock<TabStopsRequirementEvaluator>;
    let getUniqueSelectorMock: IMock<(e: HTMLElement) => string>;
    let reportResultsMock: IMock<(payload: TabStopRequirementResult) => Promise<void>>;

    let focusableElementsStub: FocusableElement[];

    let testSubject: TabStopRequirementOrchestrator;
    beforeEach(() => {
        domMock = Mock.ofType<Document>();
        tabbabbleElementGetterMock = Mock.ofType<TabbableElementGetter>();
        windowUtilsMock = Mock.ofType<WindowUtils>();
        tabStopsRequirementEvaluatorMock = Mock.ofType<TabStopsRequirementEvaluator>();
        getUniqueSelectorMock = Mock.ofType<(e: HTMLElement) => string>();
        reportResultsMock = Mock.ofType<(payload: TabStopRequirementResult) => Promise<void>>();

        testSubject = new TabStopRequirementOrchestrator(
            domMock.object,
            tabbabbleElementGetterMock.object,
            windowUtilsMock.object,
            tabStopsRequirementEvaluatorMock.object,
            getUniqueSelectorMock.object,
        );

        focusableElementsStub = [
            {
                innerText: 'some focusable element',
            },
        ] as FocusableElement[];
    });

    test('transformChildResultForParent', () => {
        const frameStub = {} as HTMLIFrameElement;
        const selectorStub = 'some selector';
        const anotherSelectorStub = 'some other selector';
        const result = {
            selector: [anotherSelectorStub],
        } as TabStopRequirementResult;
        const expectedResult = {
            selector: [selectorStub, anotherSelectorStub],
        };

        getUniqueSelectorMock.setup(m => m(frameStub)).returns(() => selectorStub);

        expect(testSubject.transformChildResultForParent(result, frameStub)).toEqual(
            expectedResult,
        );
    });

    test('start: addNewTabStop gets non-null result and reports it', () => {
        const tabStopRequirementResultStub = {
            html: 'some html',
        } as TabStopRequirementResult;
        testAddNewStopWithResult(tabStopRequirementResultStub, Times.once());
    });

    test('start: addNewTabStop gets null result and does not report it', () => {
        testAddNewStopWithResult(null, Times.never());
    });

    function testAddNewStopWithResult(
        tabStopRequirementResultStub: TabStopRequirementResult,
        givenTimes: Times,
    ) {
        const elementStub = {
            innerText: 'some element',
        } as HTMLElement;
        const eventStub = {
            target: elementStub as EventTarget,
        } as Event;

        prepareTabbableFocusOrderResults();
        domMock
            .setup(m => m.addEventListener('focusin', It.isAny()))
            .callback((_, callback) => {
                callback(eventStub);
            });

        tabStopsRequirementEvaluatorMock
            .setup(m => m.getFocusOrderResult(elementStub, elementStub))
            .returns(() => tabStopRequirementResultStub);
        reportResultsMock.setup(m => m(tabStopRequirementResultStub)).verifiable(givenTimes);

        testSubject.setResultCallback(reportResultsMock.object);
        testSubject.start();

        reportResultsMock.verifyAll();
    }

    test('start: addNewTabStop tab stop already seen, does nothing', () => {
        const elementStub = {
            innerText: 'some element',
        } as HTMLElement;
        const eventStub = {
            target: elementStub as EventTarget,
        } as Event;
        const tabStopRequirementResultStub = {
            html: 'some html',
        } as TabStopRequirementResult;
        let focusInCallback: (event: Event) => void;

        prepareTabbableFocusOrderResults();
        domMock
            .setup(m => m.addEventListener('focusin', It.isAny()))
            .callback((_, callback) => {
                focusInCallback = callback;
            });

        tabStopsRequirementEvaluatorMock
            .setup(m => m.getFocusOrderResult(elementStub, elementStub))
            .returns(() => tabStopRequirementResultStub);
        reportResultsMock.setup(m => m(tabStopRequirementResultStub)).verifiable(Times.once());

        testSubject.setResultCallback(reportResultsMock.object);
        testSubject.start();

        focusInCallback(eventStub);

        reportResultsMock.verifyAll();
        reportResultsMock.reset();
        reportResultsMock.setup(m => m(tabStopRequirementResultStub)).verifiable(Times.never());

        focusInCallback(eventStub);

        reportResultsMock.verifyAll();
    });

    test('stop removes event listeners and sends keyboard navigation results', () => {
        let focusInCallback: (event: Event) => void;
        let keydownCallback: (event: Event) => void;
        const keyboardNavigationResultsStub = getTabStopRequirementResultStubs();

        domMock
            .setup(m => m.addEventListener('focusin', It.isAny()))
            .callback((_, callback) => {
                focusInCallback = callback;
            });
        domMock
            .setup(m => m.addEventListener('keydown', It.isAny()))
            .callback((_, callback) => {
                keydownCallback = callback;
            });
        prepareTabbableFocusOrderResults();

        testSubject.setResultCallback(reportResultsMock.object);
        testSubject.start();

        domMock.setup(m => m.removeEventListener('focusin', focusInCallback)).verifiable();
        domMock.setup(m => m.removeEventListener('keydown', keydownCallback)).verifiable();
        tabStopsRequirementEvaluatorMock
            .setup(m =>
                m.getKeyboardNavigationResults(focusableElementsStub, It.isValue(new Set())),
            )
            .returns(() => keyboardNavigationResultsStub);
        keyboardNavigationResultsStub.forEach(result => {
            reportResultsMock.setup(m => m(result)).verifiable(Times.once());
        });

        testSubject.stop();

        domMock.verifyAll();
        reportResultsMock.verifyAll();
    });

    test('start: onKeydownForFocusTraps tab event with a non-null result is reported', () => {
        const tabStopRequirementResultStub = {
            html: 'some html',
        } as TabStopRequirementResult;
        testOnkeydownForFocusTrapsWithResult(tabStopRequirementResultStub, Times.once());
    });

    test('start: onKeydownForFocusTraps tab event with a null result and is not reported', () => {
        testOnkeydownForFocusTrapsWithResult(null, Times.never());
    });

    function testOnkeydownForFocusTrapsWithResult(
        tabStopRequirementResultStub: TabStopRequirementResult,
        givenTimes: Times,
    ) {
        const elementStub = {
            innerText: 'some element 1 ',
        } as HTMLElement;
        const newElementStub = {
            innerText: 'some element 2',
        } as HTMLElement;
        const eventStub = {
            key: 'Tab',
        } as KeyboardEvent;
        let windowUtilsCallback: () => void;

        prepareTabbableFocusOrderResults();
        domMock
            .setup(m => m.addEventListener('keydown', It.isAny()))
            .callback((_, callback) => {
                callback(eventStub);
            });
        domMock.setup(m => m.activeElement).returns(() => elementStub);
        windowUtilsMock
            .setup(m => m.setTimeout(It.isAny(), 500))
            .callback(callback => {
                windowUtilsCallback = callback;
            });

        testSubject.setResultCallback(reportResultsMock.object);
        testSubject.start();

        domMock.reset();
        domMock.setup(m => m.activeElement).returns(() => newElementStub);
        tabStopsRequirementEvaluatorMock
            .setup(m => m.getKeyboardTrapResults(newElementStub, elementStub))
            .returns(() => tabStopRequirementResultStub);
        reportResultsMock.setup(m => m(tabStopRequirementResultStub)).verifiable(givenTimes);

        windowUtilsCallback();

        reportResultsMock.verifyAll();
    }

    test('start: onKeydownForFocusTraps event is not tab so do nothing', () => {
        const eventStub = {
            key: 'Enter',
        } as KeyboardEvent;
        const tabStopRequirementResultStub = {
            html: 'some html',
        } as TabStopRequirementResult;

        prepareTabbableFocusOrderResults();
        domMock
            .setup(m => m.addEventListener('keydown', It.isAny()))
            .callback((_, callback) => {
                callback(eventStub);
            });

        reportResultsMock.setup(m => m(tabStopRequirementResultStub)).verifiable(Times.never());

        testSubject.setResultCallback(reportResultsMock.object);
        testSubject.start();

        reportResultsMock.verifyAll();
    });

    function prepareTabbableFocusOrderResults() {
        const tabbableFocusOrderResults = getTabStopRequirementResultStubs();
        tabbabbleElementGetterMock
            .setup(m => m.getRawElements())
            .returns(() => focusableElementsStub);
        tabStopsRequirementEvaluatorMock
            .setup(m => m.getTabbableFocusOrderResults(focusableElementsStub))
            .returns(() => tabbableFocusOrderResults);
        tabbableFocusOrderResults.forEach(result => {
            reportResultsMock.setup(m => m(result)).verifiable(Times.once());
        });
    }

    function getTabStopRequirementResultStubs(): TabStopRequirementResult[] {
        return [
            {
                html: 'result 1',
            },
            {
                html: 'result 2',
            },
        ] as TabStopRequirementResult[];
    }
});
