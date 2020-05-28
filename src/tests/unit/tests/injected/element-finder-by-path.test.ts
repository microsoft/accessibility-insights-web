// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock } from 'typemoq';

import { HTMLElementUtils } from '../../../../common/html-element-utils';
import {
    ElementFinderByPath,
    ElementFinderByPathMessage,
} from '../../../../injected/element-finder-by-path';
import { ErrorMessageContent } from '../../../../injected/frameCommunicators/error-message-content';
import { FrameCommunicator } from '../../../../injected/frameCommunicators/frame-communicator';
import { FrameMessageResponseCallback } from '../../../../injected/frameCommunicators/window-message-handler';

class TestablePathElementFinder extends ElementFinderByPath {
    public getOnfindElementByPath(): (
        message: ElementFinderByPathMessage,
        error: ErrorMessageContent,
        sourceWin: Window,
        responder?: FrameMessageResponseCallback,
    ) => void {
        return this.onFindElementByPath;
    }
}
describe('ElementFinderByPositionTest', () => {
    let testSubject: TestablePathElementFinder;
    let frameCommunicatorMock: IMock<FrameCommunicator>;
    let querySelectorMock: IMock<(path: string) => Element>;
    let htmlElementUtilsStub: HTMLElementUtils;

    beforeEach(() => {
        frameCommunicatorMock = Mock.ofType(FrameCommunicator);
        querySelectorMock = Mock.ofInstance((path: string) => {
            return null;
        });
        htmlElementUtilsStub = {
            querySelector: querySelectorMock.object,
        } as HTMLElementUtils;

        testSubject = new TestablePathElementFinder(
            htmlElementUtilsStub,
            frameCommunicatorMock.object,
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
        const subscribeCallback = testSubject.getOnfindElementByPath();
        let successCallback;
        let errorCallback;
        const messageStub = {} as ElementFinderByPathMessage;
        const resultsStub = {} as string;
        const errorStub = {} as ErrorMessageContent;
        const windowStub = {} as Window;

        const processRequestReturnStub = {
            then: processRequestPromiseHandlerMock.object,
        } as Promise<string>;

        frameCommunicatorMock
            .setup(fcm =>
                fcm.subscribe(ElementFinderByPath.findElementByPathCommand, subscribeCallback),
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

    test('process request when path begins with invalid char', async () => {
        const messageStub = {
            path: [',bad path'],
        } as ElementFinderByPathMessage;

        return expect(testSubject.processRequest(messageStub)).rejects.toBeUndefined();
    });

    test('process request when element is null', async () => {
        const messageStub = {
            path: ['invalid path'],
        } as ElementFinderByPathMessage;

        setupQuerySelectorMock(messageStub, null);
        return expect(testSubject.processRequest(messageStub)).rejects.toBeUndefined();
    });

    test('process request when path is invalid', async () => {
        const messageStub = {
            path: ['not an iframe', 'second path element'],
        } as ElementFinderByPathMessage;

        const elementStub = { tagName: 'test' } as HTMLElement;

        setupQuerySelectorMock(messageStub, elementStub);
        return expect(testSubject.processRequest(messageStub)).rejects.toBeUndefined();
    });

    test('process request when element is not iframe', async () => {
        const messageStub = {
            path: ['valid path'],
        };
        const snippet = 'valid snippet';
        const elementStub = { tagName: 'test', outerHTML: snippet } as HTMLElement;

        setupQuerySelectorMock(messageStub, elementStub);

        const response = await testSubject.processRequest(messageStub);
        expect(response).toEqual(snippet);
    });

    test('process request when element is in iframe', async () => {
        const messageStub = {
            path: ['iframe', 'test path'],
        };
        const snippet = 'test snippet';
        const elementStub = { tagName: 'iframe' } as HTMLElement;
        setupQuerySelectorMock(messageStub, elementStub);

        const expectedFrameCommunicatorMessage = {
            command: ElementFinderByPath.findElementByPathCommand,
            frame: elementStub as HTMLIFrameElement,
            message: {
                path: [messageStub.path[1]],
            } as ElementFinderByPathMessage,
        };

        frameCommunicatorMock
            .setup(fcm => fcm.sendMessage(It.isValue(expectedFrameCommunicatorMessage)))
            .returns(() => Promise.resolve(snippet));

        const response = await testSubject.processRequest(messageStub);
        expect(response).toEqual(snippet);
    });

    function setupQuerySelectorMock(
        messageStub: ElementFinderByPathMessage,
        element: HTMLElement,
    ): void {
        querySelectorMock.setup(em => em(messageStub.path[0])).returns(() => element);
    }

    function verifyAll(): void {
        frameCommunicatorMock.verifyAll();
        querySelectorMock.verifyAll();
    }
});
