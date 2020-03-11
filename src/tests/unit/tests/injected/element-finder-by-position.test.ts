// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Q from 'q';
import { IMock, It, Mock, MockBehavior } from 'typemoq';

import { SingleElementSelector } from '../../../../common/types/store-data/scoping-store-data';
import { ClientUtils } from '../../../../injected/client-utils';
import {
    ElementFinderByPosition,
    ElementFinderByPositionMessage,
} from '../../../../injected/element-finder-by-position';
import { ErrorMessageContent } from '../../../../injected/frameCommunicators/error-message-content';
import { FrameCommunicator } from '../../../../injected/frameCommunicators/frame-communicator';
import { FrameMessageResponseCallback } from '../../../../injected/frameCommunicators/window-message-handler';
import { ScannerUtils } from '../../../../injected/scanner-utils';
import { QStub } from '../../stubs/q-stub';

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
    let mockQ: IMock<typeof Q>;
    let elementsFromPointMock: IMock<(x: number, y: number) => Element[]>;
    let domStub: Document;
    let resolveMock;
    let rejectMock;
    let promiseStub;
    let deferredObjectStub: Q.Deferred<string[]>;
    let promiseHandlerMock: IMock<(callback: Function) => void>;

    beforeEach(() => {
        frameCommunicatorMock = Mock.ofType(FrameCommunicator);
        clientUtilsMock = Mock.ofType(ClientUtils);
        scannerUtils = Mock.ofType(ScannerUtils);
        mockQ = Mock.ofType(QStub, MockBehavior.Strict) as any;
        elementsFromPointMock = Mock.ofInstance((x: number, y: number) => {
            return null;
        });
        domStub = {
            elementsFromPoint: elementsFromPointMock.object,
        } as Document;
        resolveMock = Mock.ofInstance(value => {});
        rejectMock = Mock.ofInstance(value => {});
        promiseHandlerMock = Mock.ofInstance(callback => {});
        deferredObjectStub = {
            promise: promiseStub,
            resolve: resolveMock.object,
            reject: rejectMock.object,
        } as Q.Deferred<SingleElementSelector>;
        promiseStub = {
            then: promiseHandlerMock.object,
        };

        testSubject = new TestableElementFinder(
            frameCommunicatorMock.object,
            clientUtilsMock.object,
            scannerUtils.object,
            mockQ.object,
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

    test('process request when element is null', () => {
        const messageStub = {
            x: 1,
            y: 2,
        };

        setupElementsFromPointMock(messageStub, []);

        mockQ.setup(q => q.defer()).returns(() => deferredObjectStub);

        setupResolveMock([]);

        testSubject.processRequest(messageStub);
    });

    test('process request when element is not iframe', () => {
        const messageStub = {
            x: 1,
            y: 2,
        };
        const elementStub = { tagName: 'test' } as HTMLElement;
        const selector = 'selectorTest';

        setupElementsFromPointMock(messageStub, [elementStub]);
        setupGetUniqueSelector(elementStub, selector);

        mockQ.setup(q => q.defer()).returns(() => deferredObjectStub);

        setupResolveMock([selector]);

        testSubject.processRequest(messageStub);
    });

    test('process request when element is in iframe', () => {
        let successCallback;
        let errorCallback;
        const sendMessagePromiseHandlerMock = Mock.ofInstance((successCb, errorCb) => {});
        const sendMessageReturnStub = {
            then: sendMessagePromiseHandlerMock.object,
        } as Q.IPromise<string[]>;
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
            .returns(() => sendMessageReturnStub)
            .verifiable();

        clientUtilsMock
            .setup(cu => cu.getOffset(elementStub))
            .returns(() => elementRectStub)
            .verifiable();

        mockQ.setup(q => q.defer()).returns(() => deferredObjectStub);

        sendMessagePromiseHandlerMock
            .setup(prp => prp(It.isAny(), It.isAny()))
            .callback((success, error) => {
                successCallback = success;
                errorCallback = error;
            });

        setupResolveMock([iframeSelector, selector]);
        setupRejectMock();

        testSubject.processRequest(messageStub);
        successCallback(selector);
        errorCallback(null);

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

    function setupResolveMock(selectors: string[]): void {
        resolveMock.setup(rm => rm(It.isValue(selectors))).verifiable();
    }
    function setupRejectMock(): void {
        rejectMock.setup(rm => rm(null)).verifiable();
    }

    function verifyAll(): void {
        frameCommunicatorMock.verifyAll();
        clientUtilsMock.verifyAll();
        scannerUtils.verifyAll();
        resolveMock.verifyAll();
        rejectMock.verifyAll();
    }
});
