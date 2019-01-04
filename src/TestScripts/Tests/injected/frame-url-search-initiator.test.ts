// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock, MockBehavior, Times } from 'typemoq';

import { DevToolState } from '../../../common/types/store-data/idev-tool-state';
import { FrameUrlFinder, ITargetMessage } from '../../../injected/frame-url-finder';
import { FrameUrlSearchInitiator } from '../../../injected/frame-url-search-initiator';
import { StoreMock } from '../../mockHelpers/store-mock';

describe('FrameUrlSearchInitiatorTest', () => {
    test('constructor', () => {
        expect(new FrameUrlSearchInitiator(null, null)).toBeDefined();
    });

    test('listenToStore: state implies to initiate the search for frame url', () => {
        const devToolStoreMock = new StoreMock<DevToolState>();
        const frameUrlFinderMock = Mock.ofInstance({ processRequest: (message: ITargetMessage) => { } }, MockBehavior.Strict);
        const testSubject = new FrameUrlSearchInitiator(devToolStoreMock.getObject(), frameUrlFinderMock.object as FrameUrlFinder);
        const mockState: DevToolState = {
            isOpen: null,
            inspectElement: ['abc', 'def'],
        };

        devToolStoreMock.setupAddChangedListener(1);
        devToolStoreMock.setupGetState(mockState, 1);

        frameUrlFinderMock
            .setup(icm => icm.processRequest(It.isValue({ target: mockState.inspectElement })))
            .verifiable();

        testSubject.listenToStore();
        devToolStoreMock.invokeChangeListener();

        frameUrlFinderMock.verifyAll();
        devToolStoreMock.verifyAll();
    });

    test('listenToStore: frame url is already set; no need to find frame url', () => {
        const devToolStoreMock = new StoreMock<DevToolState>();
        const frameUrlFinderMock = Mock.ofInstance({ processRequest: (message: ITargetMessage) => { } }, MockBehavior.Strict);
        const testSubject = new FrameUrlSearchInitiator(devToolStoreMock.getObject(), frameUrlFinderMock.object as FrameUrlFinder);
        const mockState: DevToolState = {
            isOpen: null,
            inspectElement: ['abc', 'def'],
            frameUrl: 'test',
        };

        devToolStoreMock.setupAddChangedListener(1);
        devToolStoreMock.setupGetState(mockState, 1);

        frameUrlFinderMock
            .setup(icm => icm.processRequest(It.isValue({ target: mockState.inspectElement })))
            .verifiable(Times.never());

        testSubject.listenToStore();
        devToolStoreMock.invokeChangeListener();

        frameUrlFinderMock.verifyAll();
        devToolStoreMock.verifyAll();
    });

    test('listenToStore: element is at root; no need for finding frame url', () => {
        const devToolStoreMock = new StoreMock<DevToolState>();
        const frameUrlFinderMock = Mock.ofInstance({ processRequest: (message: ITargetMessage) => { } }, MockBehavior.Strict);
        const testSubject = new FrameUrlSearchInitiator(devToolStoreMock.getObject(), frameUrlFinderMock.object as FrameUrlFinder);
        const mockState: DevToolState = {
            isOpen: null,
            inspectElement: ['abc'],
        };

        devToolStoreMock.setupAddChangedListener(1);
        devToolStoreMock.setupGetState(mockState, 1);

        frameUrlFinderMock
            .setup(icm => icm.processRequest(It.isValue({ target: mockState.inspectElement })))
            .verifiable(Times.never());

        testSubject.listenToStore();
        devToolStoreMock.invokeChangeListener();

        frameUrlFinderMock.verifyAll();
        devToolStoreMock.verifyAll();
    });
});
