// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ClientUtils } from 'injected/client-utils';
import {
    ElementFinderByPosition,
    ElementFinderByPositionMessage,
} from 'injected/element-finder-by-position';
import { ErrorMessageContent } from 'injected/frameCommunicators/error-message-content';
import { FrameCommunicator } from 'injected/frameCommunicators/frame-communicator';
import { FrameMessageResponseCallback } from 'injected/frameCommunicators/window-message-handler';
import { ScannerUtils } from 'injected/scanner-utils';
import { IMock, It, Mock } from 'typemoq';

class TestableElementFinder extends ElementFinderByPosition {
    public getOnfindElementByPosition(): (
        message: ElementFinderByPositionMessage,
        error: ErrorMessageContent,
        sourceWin: Window,
        responder?: FrameMessageResponseCallback,
    ) => void {
        return this.onfindElementByPosition;
    }
}
describe('ElementFinderByPositionTest', () => {
    let testSubject: TestableElementFinder;
    let frameCommunicatorMock: IMock<FrameCommunicator>;
    let clientUtilsMock: IMock<ClientUtils>;
    let scannerUtils: IMock<ScannerUtils>;
    let elementsFromPointMock: IMock<(x: number, y: number) => Element[]>;
    let domStub: Document;

    beforeEach(() => {
        frameCommunicatorMock = Mock.ofType(FrameCommunicator);
        clientUtilsMock = Mock.ofType(ClientUtils);
        scannerUtils = Mock.ofType(ScannerUtils);
        elementsFromPointMock = Mock.ofInstance((x: number, y: number) => {
            return null;
        });
        domStub = {
            elementsFromPoint: elementsFromPointMock.object,
        } as Document;

        testSubject = new TestableElementFinder(
            frameCommunicatorMock.object,
            clientUtilsMock.object,
            scannerUtils.object,
            domStub,
        );
    });

    test('initialize', () => {
        const responderMock = Mock.ofInstance(
            (result: any, error: ErrorMessageContent, messageSourceWindow: Window) => {},
        );
        const processRequestPromiseHandlerMock = Mock.ofInstance((successCb, errorCb) => {});
        const processRequestMock = Mock.ofInstance(message => {
            return null;
        });
        const subscribeCallback = testSubject.getOnfindElementByPosition();
        let successCallback;
        let errorCallback;
        const messageStub = {} as ElementFinderByPositionMessage;
        const resultsStub = [];
        const errorStub = {} as ErrorMessageContent;
        const windowStub = {} as Window;

        const processRequestReturnStub = {
            then: processRequestPromiseHandlerMock.object,
        } as Q.IPromise<string[]>;

        frameCommunicatorMock
            .setup(fcm =>
                fcm.subscribe(
                    ElementFinderByPosition.findElementByPositionCommand,
                    subscribeCallback,
                ),
            )
            .verifiable();

        processRequestMock
            .setup(prm => prm(messageStub))
            .returns(() => processRequestReturnStub)
            .verifiable();

        processRequestPromiseHandlerMock
            .setup(prp => prp(It.isAny(), It.isAny()))
            .callback((success, error) => {
                successCallback = success;
                errorCallback = error;
            });

        responderMock.setup(rm => rm(resultsStub, null, windowStub)).verifiable();

        responderMock.setup(rm => rm(null, errorStub, windowStub)).verifiable();

        testSubject.initialize();
        testSubject.processRequest = processRequestMock.object;

        subscribeCallback(messageStub, null, windowStub, responderMock.object);
        successCallback(resultsStub);
        errorCallback(errorStub);

        verifyAll();
        responderMock.verifyAll();
        processRequestMock.verifyAll();
    });

    test('process request when element is null', async () => {
        const messageStub = {
            x: 1,
            y: 2,
        };

        setupElementsFromPointMock(messageStub, []);

        expect(await testSubject.processRequest(messageStub)).toEqual([]);
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

        expect(await testSubject.processRequest(messageStub)).toEqual([selector]);
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
        const expectedFrameCommunicatorMessage = {
            command: ElementFinderByPosition.findElementByPositionCommand,
            frame: elementStub as HTMLIFrameElement,
            message: {
                x: messageStub.x + window.scrollX - elementRectStub.left,
                y: messageStub.y + window.scrollY - elementRectStub.top,
            } as ElementFinderByPositionMessage,
        };

        setupElementsFromPointMock(messageStub, [elementStub]);
        setupGetUniqueSelector(elementStub, iframeSelector);

        frameCommunicatorMock
            .setup(fcm => fcm.sendMessage(It.isValue(expectedFrameCommunicatorMessage)))
            .returns(() => Promise.resolve(selector))
            .verifiable();

        clientUtilsMock
            .setup(cu => cu.getOffset(elementStub))
            .returns(() => elementRectStub)
            .verifiable();

        expect(await testSubject.processRequest(messageStub)).toEqual([iframeSelector, selector]);

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
        scannerUtils
            .setup(ksm => ksm.getUniqueSelector(element))
            .returns(() => selector)
            .verifiable();
    }

    function verifyAll(): void {
        frameCommunicatorMock.verifyAll();
        clientUtilsMock.verifyAll();
        scannerUtils.verifyAll();
    }
});
