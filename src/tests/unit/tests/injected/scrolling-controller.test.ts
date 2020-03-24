// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { HTMLElementUtils } from '../../../../common/html-element-utils';
import {
    FrameCommunicator,
    MessageRequest,
} from '../../../../injected/frameCommunicators/frame-communicator';
import {
    ScrollingController,
    ScrollingWindowMessage,
} from '../../../../injected/frameCommunicators/scrolling-controller';

describe('ScrollingControllerTest', () => {
    let frameCommunicatorMock: IMock<FrameCommunicator>;
    let HTMLElementUtilsMock: IMock<HTMLElementUtils>;

    beforeEach(() => {
        frameCommunicatorMock = Mock.ofType(FrameCommunicator);
        HTMLElementUtilsMock = Mock.ofType(HTMLElementUtils);
    });

    test('scroll in current frame', () => {
        let subscribeCallback: (result: any, error: any, responder?: any) => void;

        frameCommunicatorMock
            .setup(fcm =>
                fcm.subscribe(It.isValue(ScrollingController.triggerScrollingCommand), It.isAny()),
            )
            .returns((cmd, func) => {
                subscribeCallback = func;
            })
            .verifiable(Times.once());

        const message: ScrollingWindowMessage = {
            focusedTarget: ['a'],
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
            frameCommunicatorMock.object,
            HTMLElementUtilsMock.object,
        );

        testObject.initialize();
        subscribeCallback(message, null);

        frameCommunicatorMock.verifyAll();
        HTMLElementUtilsMock.verifyAll();
    });

    test('scroll in other frames', () => {
        let subscribeCallback: (result: any, error: any, responder?: any) => void;

        frameCommunicatorMock
            .setup(fcm =>
                fcm.subscribe(It.isValue(ScrollingController.triggerScrollingCommand), It.isAny()),
            )
            .returns((cmd, func) => {
                subscribeCallback = func;
            })
            .verifiable(Times.once());

        const messageToProcess: ScrollingWindowMessage = {
            focusedTarget: ['a', 'b'],
        };

        const frameStub = {};

        HTMLElementUtilsMock.setup(dm => dm.querySelector(It.isValue('a')))
            .returns(() => {
                return frameStub as any;
            })
            .verifiable(Times.once());

        const messageToSend: MessageRequest<ScrollingWindowMessage> = {
            command: ScrollingController.triggerScrollingCommand,
            frame: frameStub,
            message: {
                focusedTarget: ['b'],
            },
        } as MessageRequest<ScrollingWindowMessage>;

        frameCommunicatorMock
            .setup(fcm => fcm.sendMessage(It.isValue(messageToSend)))
            .verifiable(Times.once());

        const testObject = new ScrollingController(
            frameCommunicatorMock.object,
            HTMLElementUtilsMock.object,
        );

        testObject.initialize();
        subscribeCallback(messageToProcess, null);

        frameCommunicatorMock.verifyAll();
        HTMLElementUtilsMock.verifyAll();
    });
});
