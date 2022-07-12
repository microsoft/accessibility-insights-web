// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DelayCreator, PromiseFactory } from 'common/promises/promise-factory';
import { FocusTrapsHandler } from 'injected/analyzers/focus-traps-handler';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import {
    DefaultTabStopsRequirementEvaluator,
    TabStopsRequirementEvaluator,
} from 'injected/tab-stops-requirement-evaluator';
import { IMock, It, Mock, Times } from 'typemoq';

class TestableFocusTrapsKeydownHandler extends FocusTrapsHandler {
    public lastFocusedElement: HTMLElement;
}

describe(FocusTrapsHandler, () => {
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

    it('initialize() sets lastFocusedElement to null', () => {
        testSubject.lastFocusedElement = {} as HTMLElement;

        testSubject.initialize();

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

        beforeEach(() => {
            setupDOM();
            testSubject.lastFocusedElement = lastFocusedElementStub;
        });

        it('Does nothing if focused element is body', async () => {
            setupDOM(bodyElementStub);

            evaluatorMock
                .setup(e => e.getFocusOrderResult(It.isAny(), It.isAny()))
                .verifiable(Times.never());
            delayMock.setup(d => d(It.isAny(), It.isAny())).verifiable(Times.never());

            const result = await testSubject.handleTabPressed(domMock.object);

            expect(result).toBeNull();
            expect(testSubject.lastFocusedElement).toBe(lastFocusedElementStub);
        });

        it('Returns null if there was no last focused element', async () => {
            testSubject.lastFocusedElement = null;

            evaluatorMock
                .setup(e => e.getFocusOrderResult(It.isAny(), It.isAny()))
                .verifiable(Times.never());
            delayMock.setup(d => d(It.isAny(), focusTrapTimeout)).verifiable(Times.once());

            const result = await testSubject.handleTabPressed(domMock.object);

            expect(result).toBeNull();
            expect(testSubject.lastFocusedElement).toBe(focusedElementStub);
        });

        it('Returns null if no element is focused after delay', async () => {
            setupDOM(null);

            evaluatorMock
                .setup(e => e.getFocusOrderResult(It.isAny(), It.isAny()))
                .verifiable(Times.never());
            delayMock.setup(d => d(It.isAny(), focusTrapTimeout)).verifiable(Times.once());

            const result = await testSubject.handleTabPressed(domMock.object);

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

            const result = await testSubject.handleTabPressed(domMock.object);

            expect(result).toBe(expectedResult);
            expect(testSubject.lastFocusedElement).toBe(focusedElementStub);
        });

        it('Tab press during delay does not create a false positive', async () => {
            const expectedResult = {
                selector: ['selector'],
                html: 'html',
            } as AutomatedTabStopRequirementResult;
            const newActiveElement = { innerText: 'new active element' } as HTMLElement;
            let isFirstDelay = true;

            evaluatorMock
                .setup(e => e.getKeyboardTrapResults(lastFocusedElementStub, newActiveElement))
                .returns(() => expectedResult)
                .verifiable(Times.once());
            evaluatorMock
                .setup(e => e.getKeyboardTrapResults(focusedElementStub, newActiveElement))
                .returns(() => expectedResult)
                .verifiable(Times.once());
            delayMock
                .setup(d => d(It.isAny(), focusTrapTimeout))
                .returns(async () => {
                    if (isFirstDelay) {
                        setupDOM(newActiveElement);
                        isFirstDelay = false;

                        await testSubject.handleTabPressed(domMock.object);

                        expect(testSubject.lastFocusedElement).toBe(newActiveElement);
                    }
                })
                .verifiable(Times.exactly(2));

            await testSubject.handleTabPressed(domMock.object);

            expect(testSubject.lastFocusedElement).toBe(newActiveElement);
        });

        function setupDOM(focusedElement: HTMLElement = focusedElementStub): void {
            domMock.reset();
            domMock.setup(d => d.body).returns(() => bodyElementStub);
            domMock.setup(d => d.activeElement).returns(() => focusedElement);
        }
    });
});
