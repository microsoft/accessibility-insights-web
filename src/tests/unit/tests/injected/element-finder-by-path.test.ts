// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Q from 'q';
import { IMock, It, Mock, MockBehavior } from 'typemoq';

import { HTMLElementUtils } from '../../../../common/html-element-utils';
import { SingleElementSelector } from '../../../../common/types/store-data/scoping-store-data';
import { ElementFinderByPath, ElementFinderByPathMessage } from '../../../../injected/element-finder-by-path';
import { ErrorMessageContent } from '../../../../injected/frameCommunicators/error-message-content';
import { FrameCommunicator } from '../../../../injected/frameCommunicators/frame-communicator';
import { FrameMessageResponseCallback } from '../../../../injected/frameCommunicators/window-message-handler';
import { QStub } from '../../stubs/q-stub';

class TestablePathElementFinder extends ElementFinderByPath {
    public getOnfindElementByPath(): (
        message: ElementFinderByPathMessage,
        error: ErrorMessageContent,
        sourceWin: Window,
        responder?: FrameMessageResponseCallback,
    ) => void {
        return this.onfindElementByPath;
    }
}
describe('ElementFinderByPositionTest', () => {
    let testSubject: TestablePathElementFinder;
    let frameCommunicatorMock: IMock<FrameCommunicator>;
    let querySelectorMock: IMock<(path: string) => Element>;
    let htmlElementUtilsStub: HTMLElementUtils;

    let mockQ: IMock<typeof Q>;
    let resolveMock;
    let rejectMock;
    let promiseStub;
    let deferredObjectStub: Q.Deferred<string[]>;
    let promiseHandlerMock: IMock<(callback: Function) => void>;

    beforeEach(() => {
        frameCommunicatorMock = Mock.ofType(FrameCommunicator);
        querySelectorMock = Mock.ofInstance((path: string) => {
            return null;
        });
        htmlElementUtilsStub = {
            querySelector: querySelectorMock.object,
        } as HTMLElementUtils;

        mockQ = Mock.ofType(QStub, MockBehavior.Strict) as any;
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

        testSubject = new TestablePathElementFinder(htmlElementUtilsStub, frameCommunicatorMock.object, mockQ.object);
    });

    test('initialize', () => {
        const responderMock = Mock.ofInstance((result: any, error: ErrorMessageContent, messageSourceWindow: Window) => {});
        const processRequestPromiseHandlerMock = Mock.ofInstance((successCb, errorCb) => {});
        const processRequestMock = Mock.ofInstance(message => {
            return null;
        });
        const subscribeCallback = testSubject.getOnfindElementByPath();
        let successCallback;
        let errorCallback;
        const messageStub = {} as ElementFinderByPathMessage;
        const resultsStub = {} as string;
        const errorStub = {} as ErrorMessageContent;
        const windowStub = {} as Window;

        const processRequestReturnStub = {
            then: processRequestPromiseHandlerMock.object,
        } as Q.IPromise<string>;

        frameCommunicatorMock.setup(fcm => fcm.subscribe(ElementFinderByPath.findElementByPathCommand, subscribeCallback)).verifiable();

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
            path: ['invalid path'],
        } as ElementFinderByPathMessage;

        setupQuerySelectorMock(messageStub, null);

        mockQ.setup(q => q.defer()).returns(() => deferredObjectStub);

        setupResolveMock('error');

        testSubject.processRequest(messageStub);
    });

    test('process request when path is invalid', () => {
        const messageStub = {
            path: ['invalid path', 'more invalid path'],
        } as ElementFinderByPathMessage;

        const elementStub = { tagName: 'test' } as HTMLElement;

        setupQuerySelectorMock(messageStub, elementStub);

        mockQ.setup(q => q.defer()).returns(() => deferredObjectStub);

        setupResolveMock('error');

        testSubject.processRequest(messageStub);
    });

    test('process request when element is not iframe', () => {
        const messageStub = {
            path: ['.test path'],
        };
        const snippet = 'test snippet';
        const elementStub = { tagName: 'test', outerHTML: snippet } as HTMLElement;

        setupQuerySelectorMock(messageStub, elementStub);

        mockQ.setup(q => q.defer()).returns(() => deferredObjectStub);

        setupResolveMock(snippet);

        testSubject.processRequest(messageStub);
    });

    test('process request when element is in iframe', () => {
        let successCallback;
        const sendMessagePromiseHandlerMock = Mock.ofInstance((successCb, errorCb) => {});
        const sendMessageReturnStub = {
            then: sendMessagePromiseHandlerMock.object,
        } as Q.IPromise<string[]>;
        const messageStub = {
            path: ['iframe', '.test path'],
        };
        const snippet = 'test snippet';
        const elementStub = { tagName: 'iframe' } as HTMLElement;

        const expectedFrameCommunicatorMessage = {
            command: ElementFinderByPath.findElementByPathCommand,
            frame: elementStub as HTMLIFrameElement,
            message: {
                path: [messageStub.path[1]],
            } as ElementFinderByPathMessage,
        };

        setupQuerySelectorMock(messageStub, elementStub);

        frameCommunicatorMock
            .setup(fcm => fcm.sendMessage(It.isValue(expectedFrameCommunicatorMessage)))
            .returns(() => sendMessageReturnStub)
            .verifiable();

        mockQ.setup(q => q.defer()).returns(() => deferredObjectStub);

        sendMessagePromiseHandlerMock
            .setup(prp => prp(It.isAny(), It.isAny()))
            .callback((success, error) => {
                successCallback = success;
            });

        setupResolveMock(snippet);

        testSubject.processRequest(messageStub);
        successCallback(snippet);

        verifyAll();
    });

    function setupQuerySelectorMock(messageStub: ElementFinderByPathMessage, element: HTMLElement): void {
        querySelectorMock
            .setup(em => em(messageStub.path[0]))
            .returns(() => element)
            .verifiable();
    }

    function setupResolveMock(selector: string): void {
        resolveMock.setup(rm => rm(It.isValue(selector))).verifiable();
    }

    function verifyAll(): void {
        frameCommunicatorMock.verifyAll();
        resolveMock.verifyAll();
        rejectMock.verifyAll();
    }
});
