// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { TargetPageStoreData } from '../../../../injected/client-store-listener';
import { FocusChangeHandler } from '../../../../injected/focus-change-handler';
import {
    ScrollingController,
    ScrollingWindowMessage,
} from '../../../../injected/frameCommunicators/scrolling-controller';
import { TargetPageActionMessageCreator } from '../../../../injected/target-page-action-message-creator';

describe('FocusChangeHandler', () => {
    let targetPageActionMessageCreatorMock: IMock<TargetPageActionMessageCreator>;
    let scrollingControllerMock: IMock<ScrollingController>;
    let testSubject: FocusChangeHandler;
    let sampleTarget: string[];
    let sampleMessage: ScrollingWindowMessage;
    let sampleUid: string;

    beforeEach(() => {
        targetPageActionMessageCreatorMock = Mock.ofType<TargetPageActionMessageCreator>();
        scrollingControllerMock = Mock.ofType<ScrollingController>();
        sampleTarget = ['some', 'target'];
        sampleMessage = {
            focusedTarget: sampleTarget,
        };
        sampleUid = 'some uid';

        testSubject = new FocusChangeHandler(
            targetPageActionMessageCreatorMock.object,
            scrollingControllerMock.object,
        );
    });

    test('onStoreChange: no target in visualizationStoreData, cardSelectionStoreData, or needsReviewCardSelectionStoreData', async () => {
        const storeData: TargetPageStoreData = {
            visualizationStoreData: {
                focusedTarget: null,
            },
            unifiedScanResultStoreData: {
                results: [{}],
            },
            cardSelectionStoreData: {
                focusedResultUid: null,
            },
            needsReviewScanResultStoreData: {
                results: [{}],
            },
            needsReviewCardSelectionStoreData: {
                focusedResultUid: null,
            },
        } as TargetPageStoreData;

        targetPageActionMessageCreatorMock
            .setup(acm => acm.scrollRequested())
            .verifiable(Times.never());
        scrollingControllerMock
            .setup(scm => scm.processRequest(It.isAny()))
            .verifiable(Times.never());

        await testSubject.handleFocusChangeWithStoreData(storeData);

        targetPageActionMessageCreatorMock.verifyAll();
        scrollingControllerMock.verifyAll();
    });

    test('onStoreChange: new target from visualization store data is not null and different from old target', async () => {
        const storeData: TargetPageStoreData = {
            visualizationStoreData: {
                focusedTarget: sampleTarget,
            },
            unifiedScanResultStoreData: {
                results: [],
            },
        } as TargetPageStoreData;

        targetPageActionMessageCreatorMock
            .setup(acm => acm.scrollRequested())
            .verifiable(Times.once());
        scrollingControllerMock
            .setup(scm => scm.processRequest(sampleMessage))
            .verifiable(Times.once());

        await testSubject.handleFocusChangeWithStoreData(storeData);

        targetPageActionMessageCreatorMock.verifyAll();
        scrollingControllerMock.verifyAll();
    });

    test('onStoreChange: new target from card selection is not null, matches a result, and different from old target', async () => {
        const storeData: TargetPageStoreData = {
            visualizationStoreData: {
                focusedTarget: null,
            },
            unifiedScanResultStoreData: {
                results: [
                    {
                        uid: sampleUid,
                        identifiers: {
                            identifier: sampleTarget.join(';'),
                        },
                    },
                ],
            },
            cardSelectionStoreData: {
                focusedResultUid: sampleUid,
            },
        } as TargetPageStoreData;

        targetPageActionMessageCreatorMock
            .setup(acm => acm.scrollRequested())
            .verifiable(Times.once());
        scrollingControllerMock
            .setup(scm => scm.processRequest(sampleMessage))
            .verifiable(Times.once());

        await testSubject.handleFocusChangeWithStoreData(storeData);

        targetPageActionMessageCreatorMock.verifyAll();
        scrollingControllerMock.verifyAll();
    });

    test('onStoreChange: new target from card selection is not null, does not match a result and different from old target', async () => {
        const storeData: TargetPageStoreData = {
            visualizationStoreData: {
                focusedTarget: null,
            },
            unifiedScanResultStoreData: {
                results: [
                    {
                        uid: 'some other id',
                    },
                ],
            },
            cardSelectionStoreData: {
                focusedResultUid: sampleUid,
            },
        } as TargetPageStoreData;

        await expect(testSubject.handleFocusChangeWithStoreData(storeData)).rejects.toThrowError(
            'focused result was not found',
        );
    });

    test('onStoreChange: new target and old target are same', async () => {
        const storeData: TargetPageStoreData = {
            visualizationStoreData: {
                focusedTarget: sampleTarget,
            },
            unifiedScanResultStoreData: {
                results: [],
            },
        } as TargetPageStoreData;

        targetPageActionMessageCreatorMock
            .setup(acm => acm.scrollRequested())
            .verifiable(Times.once());
        scrollingControllerMock
            .setup(scm => scm.processRequest(sampleMessage))
            .verifiable(Times.once());

        await testSubject.handleFocusChangeWithStoreData(storeData);

        targetPageActionMessageCreatorMock.verifyAll();
        scrollingControllerMock.verifyAll();

        targetPageActionMessageCreatorMock.reset();
        scrollingControllerMock.reset();

        targetPageActionMessageCreatorMock
            .setup(acm => acm.scrollRequested())
            .verifiable(Times.never());
        scrollingControllerMock
            .setup(scm => scm.processRequest(It.isAny()))
            .verifiable(Times.never());

        await testSubject.handleFocusChangeWithStoreData(storeData);

        targetPageActionMessageCreatorMock.verifyAll();
        scrollingControllerMock.verifyAll();
    });

    test('onStoreChange: new target from needs review card selection is not null, matches a result, and different from old target', async () => {
        const storeData: TargetPageStoreData = {
            visualizationStoreData: {
                focusedTarget: null,
            },
            unifiedScanResultStoreData: {
                results: [
                    {
                        uid: sampleUid,
                        identifiers: {
                            identifier: sampleTarget.join(';'),
                        },
                    },
                ],
            },
            cardSelectionStoreData: {
                focusedResultUid: null,
            },
            needsReviewScanResultStoreData: {
                results: [
                    {
                        uid: sampleUid,
                        identifiers: {
                            identifier: sampleTarget.join(';'),
                        },
                    },
                ],
            },
            needsReviewCardSelectionStoreData: {
                focusedResultUid: sampleUid,
            },
        } as TargetPageStoreData;

        targetPageActionMessageCreatorMock
            .setup(acm => acm.scrollRequested())
            .verifiable(Times.once());
        scrollingControllerMock
            .setup(scm => scm.processRequest(sampleMessage))
            .verifiable(Times.once());

        await testSubject.handleFocusChangeWithStoreData(storeData);

        targetPageActionMessageCreatorMock.verifyAll();
        scrollingControllerMock.verifyAll();
    });
});
