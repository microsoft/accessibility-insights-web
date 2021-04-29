// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DevToolActionMessageCreator } from 'common/message-creators/dev-tool-action-message-creator';
import { DevToolStoreData } from 'common/types/store-data/dev-tool-store-data';
import { FrameUrlController } from 'injected/frame-url-controller';
import { FrameUrlFinder } from 'injected/frame-url-finder';
import { tick } from 'tests/unit/common/tick';
import { StoreMock } from 'tests/unit/mock-helpers/store-mock';
import { IMock, It, Mock, Times } from 'typemoq';

describe(FrameUrlController, () => {
    let devToolStoreMock: StoreMock<DevToolStoreData>;
    let mockActionMessageCreator: IMock<DevToolActionMessageCreator>;
    let mockFrameUrlFinder: IMock<FrameUrlFinder>;
    let testSubject: FrameUrlController;
    beforeEach(() => {
        devToolStoreMock = new StoreMock<DevToolStoreData>();
        mockActionMessageCreator = Mock.ofType<DevToolActionMessageCreator>();
        mockFrameUrlFinder = Mock.ofType<FrameUrlFinder>();
        devToolStoreMock.setupAddChangedListener(1);
        testSubject = new FrameUrlController(
            devToolStoreMock.getObject(),
            mockActionMessageCreator.object,
            mockFrameUrlFinder.object,
        );
    });

    it('uses frameUrlFinder to send an frameUrl message when store changes to a state with no frameUrl and a multi-layer inspectElement', async () => {
        const stubInspectElement = ['#iframe', '#child-in-iframe'];
        const stubFrameUrl = 'http://frame.com';
        devToolStoreMock.setupGetState({
            inspectElement: stubInspectElement,
            frameUrl: null,
        } as DevToolStoreData);

        mockFrameUrlFinder
            .setup(f => f.getTargetFrameUrl(stubInspectElement))
            .returns(() => Promise.resolve(stubFrameUrl));

        testSubject.listenToStore();
        devToolStoreMock.invokeChangeListener();
        await tick();

        mockActionMessageCreator.verify(m => m.setInspectFrameUrl(stubFrameUrl), Times.once());
    });

    it.each`
        inspectElement        | frameUrl
        ${null}               | ${null}
        ${['single-layer']}   | ${null}
        ${['multi', 'layer']} | ${'http://already.found'}
    `(
        'ignores store changes to irrelevant state { inspectElement: $inspectElement, frameUrl: $frameUrl }',
        async ({ inspectElement, frameUrl }) => {
            devToolStoreMock.setupGetState({
                inspectElement,
                frameUrl,
            } as DevToolStoreData);

            testSubject.listenToStore();
            devToolStoreMock.invokeChangeListener();
            await tick();

            mockFrameUrlFinder.verify(f => f.getTargetFrameUrl(It.isAny()), Times.never());
            mockActionMessageCreator.verify(m => m.setInspectFrameUrl(It.isAny()), Times.never());
        },
    );
});
