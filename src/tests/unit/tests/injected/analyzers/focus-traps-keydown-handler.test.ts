// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DelayCreator, PromiseFactory } from 'common/promises/promise-factory';
import { FocusTrapsKeydownHandler } from 'injected/analyzers/focus-traps-keydown-handler';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import {
    DefaultTabStopsRequirementEvaluator,
    TabStopsRequirementEvaluator,
} from 'injected/tab-stops-requirement-evaluator';
import { IMock, It, Mock, Times } from 'typemoq';

class TestableFocusTrapsKeydownHandler extends FocusTrapsKeydownHandler {
    public lastFocusedElement: HTMLElement;
}

describe(FocusTrapsKeydownHandler, () => {
    let evaluatorMock: IMock<TabStopsRequirementEvaluator>;
    let delayMock: IMock<DelayCreator>;
    let promiseFactoryStub: PromiseFactory;
    let domMock: IMock<Document>;
    const focusTrapTimeout = 20;

    let testSubject: TestableFocusTrapsKeydownHandler;

    beforeEach(() => {
        evaluatorMock = Mock.ofType<DefaultTabStopsRequirementEvaluator>();
        delayMock = Mock.ofType<DelayCreator>();
        promiseFactoryStub = { delay: delayMock.object } as PromiseFactory;
        domMock = Mock.ofType<Document>();

        testSubject = new TestableFocusTrapsKeydownHandler(
            evaluatorMock.object,
            promiseFactoryStub,
            focusTrapTimeout,
        );
    });

    afterEach(() => {
        evaluatorMock.verifyAll();
        delayMock.verifyAll();
    });

    it('constructor sets lastFocusedElement to null', () => {
        expect(testSubject.lastFocusedElement).toBeNull();
    });

    it('reset() sets lastFocusedElement to null', () => {
        testSubject.lastFocusedElement = {} as HTMLElement;

        testSubject.reset();

        expect(testSubject.lastFocusedElement).toBeNull();
    });

    describe('getResultOnKeydown', () => {
        const bodyElementStub = {
            innerText: 'body element',
        } as HTMLElement;
        const focusedElementStub = {
            innerText: 'currently focused element',
        } as HTMLElement;
        const lastFocusedElementStub = { innerText: 'last focused element' } as HTMLElement;
        const tabEvent: KeyboardEvent = { key: 'Tab' } as KeyboardEvent;

        beforeEach(() => {
            setupDOM();
            testSubject.lastFocusedElement = lastFocusedElementStub;
        });

        it('Does nothing if key was not tab', async () => {
            const keyboardEvent = { key: 'Enter' } as KeyboardEvent;

            setupIgnoreKeydown();

            const result = await testSubject.getResultOnKeydown(keyboardEvent, domMock.object);

            expect(result).toBeNull();
            expect(testSubject.lastFocusedElement).toBe(lastFocusedElementStub);
        });

        it('Does nothing if focused element is body', async () => {
            setupDOM(bodyElementStub);

            setupIgnoreKeydown();

            const result = await testSubject.getResultOnKeydown(tabEvent, domMock.object);

            expect(result).toBeNull();
            expect(testSubject.lastFocusedElement).toBe(lastFocusedElementStub);
        });

        it('Returns null if there was no last focused element', async () => {
            testSubject.lastFocusedElement = null;

            evaluatorMock
                .setup(e => e.getFocusOrderResult(It.isAny(), It.isAny()))
                .verifiable(Times.never());
            delayMock.setup(d => d(It.isAny(), focusTrapTimeout)).verifiable(Times.once());

            const result = await testSubject.getResultOnKeydown(tabEvent, domMock.object);

            expect(result).toBeNull();
            expect(testSubject.lastFocusedElement).toBe(focusedElementStub);
        });

        it('Returns null if no element is focused after delay', async () => {
            setupDOM(null);

            evaluatorMock
                .setup(e => e.getFocusOrderResult(It.isAny(), It.isAny()))
                .verifiable(Times.never());
            delayMock.setup(d => d(It.isAny(), focusTrapTimeout)).verifiable(Times.once());

            const result = await testSubject.getResultOnKeydown(tabEvent, domMock.object);

            expect(result).toBeNull();
            expect(testSubject.lastFocusedElement).toBeNull();
        });

        it('Returns result of getKeyboardTrapResults if an element is focused after delay', async () => {
            const expectedResult = {
                selector: ['selector'],
                html: 'html',
            } as AutomatedTabStopRequirementResult;

            evaluatorMock
                .setup(e => e.getKeyboardTrapResults(lastFocusedElementStub, focusedElementStub))
                .returns(() => expectedResult)
                .verifiable(Times.once());
            delayMock.setup(d => d(It.isAny(), focusTrapTimeout)).verifiable(Times.once());

            const result = await testSubject.getResultOnKeydown(tabEvent, domMock.object);

            expect(result).toBe(expectedResult);
            expect(testSubject.lastFocusedElement).toBe(focusedElementStub);
        });

        function setupDOM(focusedElement: HTMLElement = focusedElementStub): void {
            domMock.reset();
            domMock.setup(d => d.body).returns(() => bodyElementStub);
            domMock.setup(d => d.activeElement).returns(() => focusedElement);
        }

        function setupIgnoreKeydown(): void {
            evaluatorMock
                .setup(e => e.getFocusOrderResult(It.isAny(), It.isAny()))
                .verifiable(Times.never());
            delayMock.setup(d => d(It.isAny(), It.isAny())).verifiable(Times.never());
        }
    });
});
