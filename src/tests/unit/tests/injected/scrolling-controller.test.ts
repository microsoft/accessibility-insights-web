// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CommandMessage,
    CommandMessageResponse,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { SingleFrameMessenger } from 'injected/frameCommunicators/single-frame-messenger';
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

import { HTMLElementUtils } from '../../../../common/html-element-utils';
import {
    ScrollingController,
    ScrollingWindowMessage,
} from '../../../../injected/frameCommunicators/scrolling-controller';

describe('ScrollingControllerTest', () => {
    let frameMessengerMock: IMock<SingleFrameMessenger>;
    let HTMLElementUtilsMock: IMock<HTMLElementUtils>;

    beforeEach(() => {
        frameMessengerMock = Mock.ofType(SingleFrameMessenger);
        HTMLElementUtilsMock = Mock.ofType(HTMLElementUtils);
    });

    test('scroll in current frame', async () => {
        let addMessageCallback: (message: CommandMessage) => Promise<CommandMessageResponse>;

        frameMessengerMock
            .setup(fm =>
                fm.addMessageListener(
                    ScrollingController.triggerScrollingCommand,
                    It.is(isFunction),
                ),
            )
            .returns((cmd, func) => {
                addMessageCallback = func;
            })
            .verifiable();

        const message: ScrollingWindowMessage = {
            focusedTarget: ['a'],
        };
        const commandMessage: CommandMessage = {
            command: ScrollingController.triggerScrollingCommand,
            payload: message,
        };
        const targetElementStub = {};

        HTMLElementUtilsMock.setup(dm => dm.querySelector(It.isValue('a')))
            .returns(() => {
                return targetElementStub as any;
            })
            .verifiable(Times.once());

        HTMLElementUtilsMock.setup(h =>
            h.scrollInToView(It.isValue(targetElementStub as any)),
        ).verifiable(Times.once());

        const testObject = new ScrollingController(
            frameMessengerMock.object,
            HTMLElementUtilsMock.object,
        );

        testObject.initialize();
        await addMessageCallback(commandMessage);

        frameMessengerMock.verifyAll();
        HTMLElementUtilsMock.verifyAll();
    });

    test('scroll to nonexistent element is a noop', async () => {
        let addMessageCallback: (message: CommandMessage) => Promise<CommandMessageResponse>;

        frameMessengerMock
            .setup(fm =>
                fm.addMessageListener(
                    ScrollingController.triggerScrollingCommand,
                    It.is(isFunction),
                ),
            )
            .returns((cmd, func) => {
                addMessageCallback = func;
            })
            .verifiable();

        const message: ScrollingWindowMessage = {
            focusedTarget: ['a'],
        };

        const commandMessage: CommandMessage = {
            command: ScrollingController.triggerScrollingCommand,
            payload: message,
        };

        HTMLElementUtilsMock.setup(dm => dm.querySelector(It.isValue('a')))
            .returns(() => null)
            .verifiable(Times.once());

        HTMLElementUtilsMock.setup(h => h.scrollInToView(It.isAny())).verifiable(Times.never());

        const testObject = new ScrollingController(
            frameMessengerMock.object,
            HTMLElementUtilsMock.object,
        );

        testObject.initialize();
        await addMessageCallback(commandMessage);

        frameMessengerMock.verifyAll();
        HTMLElementUtilsMock.verifyAll();
    });

    test('scroll in other frames', async () => {
        let addMessageCallback: (message: CommandMessage) => Promise<CommandMessageResponse>;

        frameMessengerMock
            .setup(fm =>
                fm.addMessageListener(
                    ScrollingController.triggerScrollingCommand,
                    It.is(isFunction),
                ),
            )
            .returns((cmd, func) => {
                addMessageCallback = func;
            })
            .verifiable();

        const commandMessageToProcess: CommandMessage = {
            command: ScrollingController.triggerScrollingCommand,
            payload: {
                focusedTarget: ['a', 'b'],
            },
        };

        const frameStub = {} as HTMLIFrameElement;

        HTMLElementUtilsMock.setup(dm => dm.querySelector(It.isValue('a')))
            .returns(() => {
                return frameStub as any;
            })
            .verifiable(Times.once());

        const commandMessageToSend: CommandMessage = {
            command: ScrollingController.triggerScrollingCommand,
            payload: {
                focusedTarget: ['b'],
            },
        } as CommandMessage;

        frameMessengerMock.setup(fm =>
            fm.sendMessageToFrame(frameStub, It.isValue(commandMessageToSend)),
        );

        const testObject = new ScrollingController(
            frameMessengerMock.object,
            HTMLElementUtilsMock.object,
        );

        testObject.initialize();
        await addMessageCallback(commandMessageToProcess);

        frameMessengerMock.verifyAll();
        HTMLElementUtilsMock.verifyAll();
    });
});
