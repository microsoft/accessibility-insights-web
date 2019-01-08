// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, MockBehavior } from 'typemoq';

import { DevToolActionMessageCreator } from '../../../../common/message-creators/dev-tool-action-message-creator';
import { FrameUrlFinder, IFrameUrlMessage } from '../../../../injected/frame-url-finder';
import { FrameUrlMessageDispatcher } from '../../../../injected/frame-url-message-dispatcher';
import { FrameCommunicator } from '../../../../injected/frameCommunicators/frame-communicator';

describe('FrameUrlMessageDispatcherTest', () => {
    test('constructor', () => {
        expect(new FrameUrlMessageDispatcher(null, null, null)).toBeDefined();
    });


    test('setTargetFrameUrl', () => {
        const devToolActionMessageCreatorMock = Mock.ofType(DevToolActionMessageCreator, MockBehavior.Strict);
        const targetFrameUrlMessage: IFrameUrlMessage = {
            frameUrl: 'testUrl',
        };

        devToolActionMessageCreatorMock
            .setup(acm => acm.setInspectFrameUrl('testUrl'))
            .verifiable();

        const testSubject = new FrameUrlMessageDispatcher(devToolActionMessageCreatorMock.object, null, null);
        testSubject.setTargetFrameUrl(targetFrameUrlMessage);

        devToolActionMessageCreatorMock.verifyAll();
    });


    test('initialize', () => {
        const devToolActionMessageCreatorMock = Mock.ofType(DevToolActionMessageCreator, MockBehavior.Strict);
        const frameUrlFinderMock = Mock.ofType(FrameUrlFinder, MockBehavior.Strict);
        const frameCommunicatorMock = Mock.ofType(FrameCommunicator, MockBehavior.Strict);

        const testSubject = new FrameUrlMessageDispatcher(
            devToolActionMessageCreatorMock.object,
            frameUrlFinderMock.object,
            frameCommunicatorMock.object,
        );

        frameCommunicatorMock
            .setup(fcm => fcm.subscribe(FrameUrlFinder.SetFrameUrlCommand, testSubject.setTargetFrameUrl))
            .verifiable();

        testSubject.initialize();

        frameCommunicatorMock.verifyAll();
    });
});
