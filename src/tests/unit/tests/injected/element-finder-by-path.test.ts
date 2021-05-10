// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import {
    CommandMessage,
    CommandMessageResponse,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { isFunction } from 'lodash';
import { IMock, It, Mock } from 'typemoq';
import { HTMLElementUtils } from '../../../../common/html-element-utils';
import {
    ElementFinderByPath,
    ElementFinderByPathMessage,
} from '../../../../injected/element-finder-by-path';

class TestablePathElementFinder extends ElementFinderByPath {
    public getOnfindElementByPath(): (
        commandMessage: CommandMessage,
        sourceWin: Window,
    ) => Promise<CommandMessageResponse | null> {
        return this.onFindElementByPath;
    }
}
describe('ElementFinderByPositionTest', () => {
    let testSubject: TestablePathElementFinder;
    let frameMessengerMock: IMock<FrameMessenger>;
    let querySelectorMock: IMock<(path: string) => Element>;
    let htmlElementUtilsStub: HTMLElementUtils;

    beforeEach(() => {
        frameMessengerMock = Mock.ofType(FrameMessenger);
        querySelectorMock = Mock.ofInstance((path: string) => {
            return null;
        });
        htmlElementUtilsStub = {
            querySelector: querySelectorMock.object,
        } as HTMLElementUtils;

        testSubject = new TestablePathElementFinder(
            htmlElementUtilsStub,
            frameMessengerMock.object,
        );
    });

    test('initialize registers the expected listeners', () => {
        frameMessengerMock
            .setup(fm =>
                fm.addMessageListener(
                    ElementFinderByPath.findElementByPathCommand,
                    It.is(isFunction),
                ),
            )
            .verifiable();

        testSubject.initialize();
        frameMessengerMock.verifyAll();
    });

    test('process request when path begins with invalid char', async () => {
        const messageStub = {
            path: [',bad path'],
        } as ElementFinderByPathMessage;

        await expect(testSubject.processRequest(messageStub)).rejects.toThrowError(
            'Syntax error in specified path',
        );
    });

    test('process request when element is null', async () => {
        const messageStub = {
            path: ['invalid path'],
        } as ElementFinderByPathMessage;

        setupQuerySelectorMock(messageStub, null);
        await expect(testSubject.processRequest(messageStub)).rejects.toThrowError(
            'Element not found for specified path',
        );
    });

    test('process request when path is invalid', async () => {
        const messageStub = {
            path: ['not an iframe', 'second path element'],
        } as ElementFinderByPathMessage;

        const elementStub = { tagName: 'test' } as HTMLElement;

        setupQuerySelectorMock(messageStub, elementStub);
        await expect(testSubject.processRequest(messageStub)).rejects.toThrowError(
            'Multiple paths specified but expected one',
        );
    });

    test('process request when element is not iframe', async () => {
        const messageStub = {
            path: ['valid path'],
        };
        const snippet = 'valid snippet';
        const expectedResponse = { payload: snippet };
        const elementStub = { tagName: 'test', outerHTML: snippet } as HTMLElement;

        setupQuerySelectorMock(messageStub, elementStub);

        const response = await testSubject.processRequest(messageStub);
        expect(response).toEqual(expectedResponse);
    });

    test('process request when element is in iframe', async () => {
        const messageStub = {
            path: ['iframe', 'test path'],
        };
        const snippet = 'test snippet';
        const elementStub = { tagName: 'iframe' } as HTMLElement;
        setupQuerySelectorMock(messageStub, elementStub);

        const targetFrameStub = elementStub as HTMLIFrameElement;
        const commandMessage = {
            command: ElementFinderByPath.findElementByPathCommand,
            payload: {
                path: [messageStub.path[1]],
            } as ElementFinderByPathMessage,
        };

        const expectedResponse = { payload: snippet };

        frameMessengerMock
            .setup(fcm =>
                fcm.sendMessageToFrame(It.isValue(targetFrameStub), It.isValue(commandMessage)),
            )
            .returns(() => Promise.resolve(expectedResponse));

        const response = await testSubject.processRequest(messageStub);
        expect(response).toEqual(expectedResponse);
    });

    function setupQuerySelectorMock(
        messageStub: ElementFinderByPathMessage,
        element: HTMLElement,
    ): void {
        querySelectorMock.setup(em => em(messageStub.path[0])).returns(() => element);
    }
});
