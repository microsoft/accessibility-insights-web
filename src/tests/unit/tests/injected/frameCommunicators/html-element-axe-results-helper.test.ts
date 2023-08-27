// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock } from 'typemoq';

import { HTMLElementUtils } from '.././../../../../common/html-element-utils';
import { Logger } from '../../../../../common/logging/logger';
import {
    AxeResultsWithFrameLevel,
    HtmlElementAxeResultsHelper,
} from '../../../../../injected/frameCommunicators/html-element-axe-results-helper';
import { HTMLCollectionOfBuilder } from '../../../common/html-collection-of-builder';

describe('HtmlElementAxeResultsHelperTest', () => {
    let testSubject: HtmlElementAxeResultsHelper;
    let mockDocumentElementUtils: IMock<HTMLElementUtils>;

    beforeEach(() => {
        mockDocumentElementUtils = Mock.ofType(HTMLElementUtils);
        const loggerMock = Mock.ofType<Logger>();
        testSubject = new HtmlElementAxeResultsHelper(
            mockDocumentElementUtils.object,
            loggerMock.object,
        );
    });

    afterEach(() => {
        mockDocumentElementUtils.verifyAll();
    });

    test('splitResultsByFrame_ShouldIncludeResultsForMissingFrames', () => {
        const framesInWindow = HTMLCollectionOfBuilder.create([
            document.createElement('iframe'),
            document.createElement('iframe'),
        ]);

        mockDocumentElementUtils
            .setup(x => x.getAllElementsByTagName('iframe'))
            .returns(() => framesInWindow);
        const resultsByFrame = testSubject.splitResultsByFrame([]);

        expect(resultsByFrame.length).toEqual(3);
        expect(resultsByFrame.filter(result => result.frame == null).length).toEqual(1);
        expect(resultsByFrame.filter(result => result.frame === framesInWindow[0]).length).toEqual(
            1,
        );
        expect(resultsByFrame.filter(result => result.frame === framesInWindow[1]).length).toEqual(
            1,
        );
        expect(resultsByFrame.filter(result => result.elementResults.length === 0).length).toEqual(
            3,
        );
    });

    test('splitResultsByFrame_ShouldNotUpdateSelectorForCurrentFrame', () => {
        const framesInWindow = HTMLCollectionOfBuilder.create([]);
        const currentFrameResultInstance1: AxeResultsWithFrameLevel = {
            ruleResults: {},
            target: ['#id1'],
            targetIndex: 0,
        };
        const currentFrameResultInstance2: AxeResultsWithFrameLevel = {
            ruleResults: 'something' as any,
            target: ['#id2'],
            targetIndex: 0,
        };

        mockDocumentElementUtils
            .setup(x => x.getAllElementsByTagName('iframe'))
            .returns(() => framesInWindow)
            .verifiable();

        const resultsByFrame = testSubject.splitResultsByFrame([
            currentFrameResultInstance1,
            currentFrameResultInstance2,
        ]);

        expect(resultsByFrame.length).toEqual(1);
        expect(resultsByFrame[0].frame).toBeNull();
        expect(resultsByFrame[0].elementResults).toMatchObject([
            currentFrameResultInstance1,
            currentFrameResultInstance2,
        ]);
    });

    test('splitResultsByFrame_WithUndefinedTargetIndex_ShouldIncrementTargetIndexByOne', () => {
        const frame1 = document.createElement('iframe');
        const framesInWindow = HTMLCollectionOfBuilder.create([frame1]);
        const frameResult: AxeResultsWithFrameLevel = {
            ruleResults: {},
            target: ['#frame1', '#elementID'],
            targetIndex: undefined,
        };

        const expectedFrameResult: AxeResultsWithFrameLevel = {
            ruleResults: {},
            target: ['#frame1', '#elementID'],
            targetIndex: 1,
        };

        mockDocumentElementUtils
            .setup(x => x.getAllElementsByTagName('iframe'))
            .returns(() => framesInWindow)
            .verifiable();
        mockDocumentElementUtils
            .setup(x => x.querySelector('#frame1'))
            .returns(() => frame1)
            .verifiable();

        const resultsByFrame = testSubject.splitResultsByFrame([frameResult]);

        expect(resultsByFrame.length).toEqual(2);

        const resultsForTargetFrame = resultsByFrame.filter(result => result.frame === frame1)[0];
        expect(resultsForTargetFrame.elementResults).toMatchObject([expectedFrameResult]);
    });

    test('splitResultsByFrame_ShoulNotCrashIfSelectorIsEmpty', () => {
        const frame1 = document.createElement('iframe');
        const framesInWindow = HTMLCollectionOfBuilder.create([frame1]);
        const frameResult: AxeResultsWithFrameLevel = {
            ruleResults: {},
            target: [],
        };

        mockDocumentElementUtils
            .setup(x => x.getAllElementsByTagName('iframe'))
            .returns(() => framesInWindow)
            .verifiable();

        const resultsByFrame = testSubject.splitResultsByFrame([frameResult]);
        const resultsForTargetFrame = resultsByFrame.filter(result => result.frame === frame1)[0];
        const resultsForMainWindow = resultsByFrame.filter(result => result.frame === frame1)[0];

        expect(resultsByFrame.length).toEqual(2);
        expect(resultsForTargetFrame.elementResults).toMatchObject([]);
        expect(resultsForMainWindow.elementResults).toMatchObject([]);
    });

    test('splitResultsByFrame_ShouldNotAddResultsIfFrameDoesntExistAnymore', () => {
        const framesInWindow = HTMLCollectionOfBuilder.create([]);
        const frameResult: AxeResultsWithFrameLevel = {
            ruleResults: {},
            target: ['#frame1', '#elementID'],
        };

        mockDocumentElementUtils
            .setup(x => x.getAllElementsByTagName('iframe'))
            .returns(() => framesInWindow)
            .verifiable();
        mockDocumentElementUtils
            .setup(x => x.querySelector('#frame1'))
            .returns(() => null)
            .verifiable();

        const resultsByFrame = testSubject.splitResultsByFrame([frameResult]);

        expect(resultsByFrame.length).toEqual(1);
        expect(resultsByFrame[0].frame).toBeNull();
        expect(resultsByFrame[0].elementResults).toMatchObject([]);
    });

    test('splitResultsByFrame: Invalid targetIndex', () => {
        const frame1 = document.createElement('iframe');
        const framesInWindow = HTMLCollectionOfBuilder.create([frame1]);
        const frameResult: AxeResultsWithFrameLevel = {
            ruleResults: {},
            target: [],
            targetIndex: 5,
        };

        mockDocumentElementUtils
            .setup(x => x.getAllElementsByTagName('iframe'))
            .returns(() => framesInWindow);

        const resultsByFrame = testSubject.splitResultsByFrame([frameResult]);
        const resultsForTargetFrame = resultsByFrame.filter(result => result.frame === frame1)[0];
        const resultsForMainWindow = resultsByFrame.filter(result => result.frame === frame1)[0];

        expect(resultsForTargetFrame.elementResults).toMatchObject([]);
        expect(resultsForMainWindow.elementResults).toMatchObject([]);
    });
});
