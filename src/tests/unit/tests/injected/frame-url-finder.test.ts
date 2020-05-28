// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock, MockBehavior } from 'typemoq';

import { HTMLElementUtils } from '../../../../common/html-element-utils';
import { WindowUtils } from '../../../../common/window-utils';
import {
    FrameUrlFinder,
    FrameUrlMessage,
    TargetMessage,
} from '../../../../injected/frame-url-finder';
import {
    FrameCommunicator,
    MessageRequest,
} from '../../../../injected/frameCommunicators/frame-communicator';

describe('frameUrlFinderTest', () => {
    test('constructor', () => {
        expect(new FrameUrlFinder(null, null, null)).toBeDefined();
    });

    test('initialize', () => {
        const frameCommunicatorMock = Mock.ofType(FrameCommunicator, MockBehavior.Strict);
        const testSubject = new FrameUrlFinder(frameCommunicatorMock.object, null, null);

        frameCommunicatorMock
            .setup(mfc =>
                mfc.subscribe(FrameUrlFinder.GetTargetFrameUrlCommand, testSubject.processRequest),
            )
            .verifiable();

        testSubject.initialize();

        frameCommunicatorMock.verifyAll();
    });

    test('processRequest: at target level', () => {
        const frameCommunicatorMock = Mock.ofType(FrameCommunicator, MockBehavior.Strict);
        const windowUtilsMock = Mock.ofType(WindowUtils, MockBehavior.Strict);
        const topWindowStub: any = {};
        const currentWindowStub: any = {
            location: { href: 'testURL' },
        };

        const processRequestMessageStub: TargetMessage = {
            target: ['abc'],
        };
        const sentMessageStub: MessageRequest<FrameUrlMessage> = {
            command: FrameUrlFinder.SetFrameUrlCommand,
            win: topWindowStub,
            message: {
                frameUrl: 'testURL',
            },
        };

        frameCommunicatorMock
            .setup(mfc => mfc.sendMessage(It.isValue(sentMessageStub)))
            .verifiable();

        windowUtilsMock
            .setup(mwu => mwu.getTopWindow())
            .returns(() => {
                return topWindowStub;
            })
            .verifiable();

        windowUtilsMock
            .setup(mwu => mwu.getWindow())
            .returns(() => {
                return currentWindowStub;
            })
            .verifiable();

        const testSubject = new FrameUrlFinder(
            frameCommunicatorMock.object,
            windowUtilsMock.object,
            null,
        );
        testSubject.processRequest(processRequestMessageStub);

        windowUtilsMock.verifyAll();
        frameCommunicatorMock.verifyAll();
    });

    test('processRequest: not at target level', () => {
        const frameCommunicatorMock = Mock.ofType(FrameCommunicator, MockBehavior.Strict);
        const htmlUtilsMock = Mock.ofType(HTMLElementUtils, MockBehavior.Strict);
        const frameStub = {} as any;

        const processRequestMessageMock: TargetMessage = {
            target: ['abc', 'def'],
        };
        const sentMessageMock: MessageRequest<TargetMessage> = {
            command: FrameUrlFinder.GetTargetFrameUrlCommand,
            frame: frameStub,
            message: {
                target: ['def'],
            },
        };

        frameCommunicatorMock
            .setup(mfc => mfc.sendMessage(It.isValue(sentMessageMock)))
            .verifiable();

        htmlUtilsMock
            .setup(mhu => mhu.querySelector('abc'))
            .returns(() => {
                return frameStub;
            })
            .verifiable();

        const testSubject = new FrameUrlFinder(
            frameCommunicatorMock.object,
            null,
            htmlUtilsMock.object,
        );
        testSubject.processRequest(processRequestMessageMock);

        htmlUtilsMock.verifyAll();
        frameCommunicatorMock.verifyAll();
    });
});
