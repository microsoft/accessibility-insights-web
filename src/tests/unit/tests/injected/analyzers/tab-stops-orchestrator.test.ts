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
    let elementStub: HTMLElement;
    let newElementStub: HTMLElement;
    let tabStopRequirementResultStub: TabStopRequirementResult;

    let focusInCallback: (event: Event) => void;
    let keydownCallback: (event: Event) => void;

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
        setupStartTabStopsOrchestrator();

        focusableElementsStub = [
            {
                innerText: 'some focusable element',
            },
        ] as FocusableElement[];
        elementStub = {
            innerText: 'some element',
        } as HTMLElement;
        newElementStub = {
            innerText: 'some new element',
        } as HTMLElement;
        tabStopRequirementResultStub = {
            html: 'some html',
        } as TabStopRequirementResult;
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

    test('addNewTabStop new and unique tabstop gets non-null result and reports it', () => {
        const eventStub = {
            target: elementStub as EventTarget,
        } as Event;
        const newEventStub = {
            target: newElementStub as EventTarget,
        } as Event;

        tabStopsRequirementEvaluatorMock
            .setup(m => m.getFocusOrderResult(elementStub, newElementStub))
            .returns(() => tabStopRequirementResultStub);
        reportResultsMock.setup(m => m(tabStopRequirementResultStub)).verifiable(Times.once());

        testSubject.setResultCallback(reportResultsMock.object);
        testSubject.start();
        focusInCallback(eventStub);
        focusInCallback(newEventStub);

        reportResultsMock.verifyAll();
    });

    test('addNewTabStop new and unique tabstop gets null result and does not report it', () => {
        tabStopRequirementResultStub = null;
        const eventStub = {
            target: elementStub as EventTarget,
        } as Event;
        const newEventStub = {
            target: newElementStub as EventTarget,
        } as Event;

        tabStopsRequirementEvaluatorMock
            .setup(m => m.getFocusOrderResult(elementStub, newElementStub))
            .returns(() => tabStopRequirementResultStub);
        reportResultsMock.setup(m => m(tabStopRequirementResultStub)).verifiable(Times.never());

        testSubject.setResultCallback(reportResultsMock.object);
        testSubject.start();
        focusInCallback(eventStub);
        focusInCallback(newEventStub);

        reportResultsMock.verifyAll();
    });

    test('start: addNewTabStop tab stop already seen, does nothing', () => {
        const eventStub = {
            target: elementStub as EventTarget,
        } as Event;

        tabStopsRequirementEvaluatorMock
            .setup(m => m.getFocusOrderResult(It.isAny(), It.isAny()))
            .returns(() => tabStopRequirementResultStub);
        reportResultsMock.setup(m => m(tabStopRequirementResultStub)).verifiable(Times.never());

        testSubject.setResultCallback(reportResultsMock.object);
        testSubject.start();
        focusInCallback(eventStub);
        focusInCallback(eventStub);

        reportResultsMock.verifyAll();
    });

    test('stop removes event listeners and sends keyboard navigation results', () => {
        const keyboardNavigationResultsStub = getTabStopRequirementResultStubs();

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

    test('stop does not resend stale events when called twice', () => {
        const keyboardNavigationResultsStub = getTabStopRequirementResultStubs();
        testSubject.setResultCallback(reportResultsMock.object);
        testSubject.start();

        domMock
            .setup(m => m.removeEventListener('focusin', focusInCallback))
            .verifiable(Times.exactly(2));
        domMock
            .setup(m => m.removeEventListener('keydown', keydownCallback))
            .verifiable(Times.exactly(2));
        tabStopsRequirementEvaluatorMock
            .setup(m =>
                m.getKeyboardNavigationResults(focusableElementsStub, It.isValue(new Set())),
            )
            .returns(() => keyboardNavigationResultsStub);
        keyboardNavigationResultsStub.forEach(result => {
            reportResultsMock.setup(m => m(result)).verifiable(Times.once());
        });

        testSubject.stop();

        tabStopsRequirementEvaluatorMock.reset();
        tabStopsRequirementEvaluatorMock
            .setup(m => m.getKeyboardNavigationResults([], It.isValue(new Set())))
            .returns(() => [])
            .verifiable(Times.once());
        testSubject.stop();
        tabStopsRequirementEvaluatorMock.verifyAll();

        domMock.verifyAll();
        reportResultsMock.verifyAll();
    });

    test('start: onKeydownForFocusTraps tab event with a non-null result is reported', () => {
        testOnkeydownForFocusTrapsWithResult(tabStopRequirementResultStub, Times.once());
    });

    test('start: onKeydownForFocusTraps tab event with a null result and is not reported', () => {
        testOnkeydownForFocusTrapsWithResult(null, Times.never());
    });

    function testOnkeydownForFocusTrapsWithResult(
        givenTabStopRequirementResult: TabStopRequirementResult,
        givenTimes: Times,
    ) {
        const eventStub = {
            key: 'Tab',
        } as KeyboardEvent;
        let windowUtilsCallback: () => void;

        domMock.setup(m => m.activeElement).returns(() => elementStub);
        windowUtilsMock
            .setup(m => m.setTimeout(It.isAny(), 500))
            .callback(callback => {
                windowUtilsCallback = callback;
            });

        testSubject.setResultCallback(reportResultsMock.object);
        testSubject.start();
        keydownCallback(eventStub);

        domMock.reset();
        domMock.setup(m => m.activeElement).returns(() => newElementStub);
        tabStopsRequirementEvaluatorMock
            .setup(m => m.getKeyboardTrapResults(newElementStub, elementStub))
            .returns(() => givenTabStopRequirementResult);
        reportResultsMock.setup(m => m(givenTabStopRequirementResult)).verifiable(givenTimes);

        windowUtilsCallback();

        reportResultsMock.verifyAll();
    }

    test('start: onKeydownForFocusTraps event is not tab so do nothing', () => {
        const eventStub = {
            key: 'Enter',
        } as KeyboardEvent;

        reportResultsMock.setup(m => m(tabStopRequirementResultStub)).verifiable(Times.never());

        testSubject.setResultCallback(reportResultsMock.object);
        testSubject.start();
        keydownCallback(eventStub);

        reportResultsMock.verifyAll();
    });

    function setupStartTabStopsOrchestrator() {
        prepareTabbableFocusOrderResults();
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
    }

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
