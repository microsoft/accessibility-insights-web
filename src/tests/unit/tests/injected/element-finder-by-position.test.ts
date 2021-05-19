// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ClientUtils } from 'injected/client-utils';
import {
    ElementFinderByPosition,
    ElementFinderByPositionMessage,
} from 'injected/element-finder-by-position';
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import {
    CommandMessage,
    CommandMessageResponse,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

class TestableElementFinder extends ElementFinderByPosition {
    public getOnfindElementByPosition(): (
        message: CommandMessage,
    ) => Promise<CommandMessageResponse> {
        return this.onfindElementByPosition;
    }
}
describe('ElementFinderByPositionTest', () => {
    let testSubject: TestableElementFinder;
    let frameMessengerMock: IMock<FrameMessenger>;
    let clientUtilsMock: IMock<ClientUtils>;
    let getUniqueSelectorMock: IMock<(element: HTMLElement) => string>;
    let elementsFromPointMock: IMock<(x: number, y: number) => Element[]>;
    let domStub: Document;

    beforeEach(() => {
        frameMessengerMock = Mock.ofType(FrameMessenger);
        clientUtilsMock = Mock.ofType(ClientUtils);
        getUniqueSelectorMock = Mock.ofInstance(e => null);
        elementsFromPointMock = Mock.ofInstance((x: number, y: number) => {
            return null;
        });
        domStub = {
            elementsFromPoint: elementsFromPointMock.object,
        } as Document;

        testSubject = new TestableElementFinder(
            frameMessengerMock.object,
            clientUtilsMock.object,
            getUniqueSelectorMock.object,
            domStub,
        );
    });

    test('initialize registers the expected listeners', () => {
        frameMessengerMock
            .setup(fm =>
                fm.addMessageListener(
                    ElementFinderByPosition.findElementByPositionCommand,
                    It.is(isFunction),
                ),
            )
            .verifiable();

        testSubject.initialize();

        frameMessengerMock.verifyAll();
    });

    test('process request when element is null', async () => {
        const messageStub = {
            x: 1,
            y: 2,
        };

        setupElementsFromPointMock(messageStub, []);
        clientUtilsMock.setup(cu => cu.getOffset(It.isAny())).verifiable(Times.never());
        getUniqueSelectorMock.setup(m => m(It.isAny())).verifiable(Times.never());

        expect(await testSubject.processRequest(messageStub)).toEqual({ payload: [] });
        verifyAll();
    });

    test('process request when element is not iframe', async () => {
        const messageStub = {
            x: 1,
            y: 2,
        };
        const elementStub = { tagName: 'test' } as HTMLElement;
        const selector = 'selectorTest';

        setupElementsFromPointMock(messageStub, [elementStub]);
        setupGetUniqueSelector(elementStub, selector);

        expect(await testSubject.processRequest(messageStub)).toEqual({ payload: [selector] });
    });

    test('process request when element is in iframe', async () => {
        const messageStub = {
            x: 1,
            y: 2,
        };
        const elementStub = { tagName: 'iframe' } as HTMLElement;
        const elementRectStub = {
            left: 50,
            top: 100,
        };
        const selector = 'selectorTest';
        const iframeSelector = 'iframe';
        const targetFrame = elementStub as HTMLIFrameElement;
        const commandMessage: CommandMessage = {
            command: ElementFinderByPosition.findElementByPositionCommand,
            payload: {
                x: messageStub.x + window.scrollX - elementRectStub.left,
                y: messageStub.y + window.scrollY - elementRectStub.top,
            },
        };

        setupElementsFromPointMock(messageStub, [elementStub]);
        setupGetUniqueSelector(elementStub, iframeSelector);

        frameMessengerMock
            .setup(fm => fm.sendMessageToFrame(targetFrame, commandMessage))
            .returns(() => Promise.resolve({ payload: selector }))
            .verifiable();

        clientUtilsMock
            .setup(cu => cu.getOffset(elementStub))
            .returns(() => elementRectStub)
            .verifiable();

        expect(await testSubject.processRequest(messageStub)).toEqual({
            payload: [iframeSelector, selector],
        });

        verifyAll();
    });

    function setupElementsFromPointMock(
        messageStub: ElementFinderByPositionMessage,
        elements: HTMLElement[],
    ): void {
        elementsFromPointMock
            .setup(em => em(messageStub.x, messageStub.y))
            .returns(() => elements)
            .verifiable();
    }

    function setupGetUniqueSelector(element: HTMLElement, selector: string): void {
        getUniqueSelectorMock
            .setup(m => m(element))
            .returns(() => selector)
            .verifiable();
    }

    function verifyAll(): void {
        frameMessengerMock.verifyAll();
        clientUtilsMock.verifyAll();
        getUniqueSelectorMock.verifyAll();
    }
});
