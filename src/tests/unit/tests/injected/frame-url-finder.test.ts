// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock, MockBehavior } from 'typemoq';

import { HTMLElementUtils } from '../../../../common/html-element-utils';
import { WindowUtils } from '../../../../common/window-utils';
import { FrameUrlFinder, FrameUrlMessage, TargetMessage } from '../../../../injected/frame-url-finder';
import { FrameCommunicator, MessageRequest } from '../../../../injected/frameCommunicators/frame-communicator';

describe('frameUrlFinderTest', () => {
    test('constructor', () => {
        expect(new FrameUrlFinder(null, null, null)).toBeDefined();
    });

    test('initialize', () => {
        const mockFrameCommunicator = Mock.ofType(FrameCommunicator, MockBehavior.Strict);
        const testSubject = new FrameUrlFinder(mockFrameCommunicator.object, null, null);

        mockFrameCommunicator.setup(mfc => mfc.subscribe(FrameUrlFinder.GetTargetFrameUrlCommand, testSubject.processRequest)).verifiable();

        testSubject.initialize();

        mockFrameCommunicator.verifyAll();
    });

    test('processRequest: at target level', () => {
        const mockFrameCommunicator = Mock.ofType(FrameCommunicator, MockBehavior.Strict);
        const mockWindowUtils = Mock.ofType(WindowUtils, MockBehavior.Strict);
        const topWindowStub: any = {};
        const currentWindowStub: any = {
            location: { href: 'testURL' },
        };

        const mockProcessRequestMessage: TargetMessage = {
            target: ['abc'],
        };
        const mockSentMessage: MessageRequest<FrameUrlMessage> = {
            command: FrameUrlFinder.SetFrameUrlCommand,
            win: topWindowStub,
            message: {
                frameUrl: 'testURL',
            },
        };

        mockFrameCommunicator.setup(mfc => mfc.sendMessage(It.isValue(mockSentMessage))).verifiable();

        mockWindowUtils
            .setup(mwu => mwu.getTopWindow())
            .returns(() => {
                return topWindowStub;
            })
            .verifiable();

        mockWindowUtils
            .setup(mwu => mwu.getWindow())
            .returns(() => {
                return currentWindowStub;
            })
            .verifiable();

        const testSubject = new FrameUrlFinder(mockFrameCommunicator.object, mockWindowUtils.object, null);
        testSubject.processRequest(mockProcessRequestMessage);

        mockWindowUtils.verifyAll();
        mockFrameCommunicator.verifyAll();
    });

    test('processRequest: not at target level', () => {
        const mockFrameCommunicator = Mock.ofType(FrameCommunicator, MockBehavior.Strict);
        const mockHtmlUtils = Mock.ofType(HTMLElementUtils, MockBehavior.Strict);
        const frameStub = {} as any;

        const mockProcessRequestMessage: TargetMessage = {
            target: ['abc', 'def'],
        };
        const mockSentMessage: MessageRequest<TargetMessage> = {
            command: FrameUrlFinder.GetTargetFrameUrlCommand,
            frame: frameStub,
            message: {
                target: ['def'],
            },
        };

        mockFrameCommunicator.setup(mfc => mfc.sendMessage(It.isValue(mockSentMessage))).verifiable();

        mockHtmlUtils
            .setup(mhu => mhu.querySelector('abc'))
            .returns(() => {
                return frameStub;
            })
            .verifiable();

        const testSubject = new FrameUrlFinder(mockFrameCommunicator.object, null, mockHtmlUtils.object);
        testSubject.processRequest(mockProcessRequestMessage);

        mockHtmlUtils.verifyAll();
        mockFrameCommunicator.verifyAll();
    });
});
