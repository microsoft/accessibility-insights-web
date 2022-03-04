// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationScanResultStore } from 'background/stores/visualization-scan-result-store';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { AllFrameRunner } from 'injected/all-frame-runner';
import { TabStopsRequirementResultProcessor } from 'injected/analyzers/tab-stops-requirement-result-processor';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

describe('TabStopsRequirementResultProcessor', () => {
    let tabStopRequirementRunnerMock: IMock<AllFrameRunner<AutomatedTabStopRequirementResult>>;
    let requirementResultRunnerCallback: (
        requirementResult: AutomatedTabStopRequirementResult,
    ) => void;
    let tabStopRequirementActionMessageCreatorMock: IMock<TabStopRequirementActionMessageCreator>;
    let visualizationScanResultsStoreMock: IMock<VisualizationScanResultStore>;
    let testSubject: TabStopsRequirementResultProcessor;

    beforeEach(() => {
        tabStopRequirementRunnerMock = Mock.ofInstance({
            topWindowCallback: null,
            start: () => {},
            stop: () => {},
            initialize: () => {},
        } as AllFrameRunner<AutomatedTabStopRequirementResult>);
        tabStopRequirementActionMessageCreatorMock =
            Mock.ofType<TabStopRequirementActionMessageCreator>();
        visualizationScanResultsStoreMock = Mock.ofType<VisualizationScanResultStore>();

        testSubject = new TabStopsRequirementResultProcessor(
            tabStopRequirementRunnerMock.object,
            tabStopRequirementActionMessageCreatorMock.object,
            visualizationScanResultsStoreMock.object,
        );
    });

    it('initializes with expected state', () => {
        const openTestSubject = testSubject as any;

        expect(openTestSubject.seenTabStopRequirementResults).toEqual([]);
        expect(openTestSubject.isStopped).toEqual(true);
        expect(openTestSubject.tabStopRequirementRunner).toEqual(
            tabStopRequirementRunnerMock.object,
        );
        expect(openTestSubject.tabStopRequirementActionMessageCreator).toEqual(
            tabStopRequirementActionMessageCreatorMock.object,
        );
        expect(openTestSubject.visualizationResultsStore).toEqual(
            visualizationScanResultsStoreMock.object,
        );
    });

    it('start adds expected listener', () => {
        visualizationScanResultsStoreMock
            .setup(m => m.addChangedListener(It.is(isFunction)))
            .verifiable(Times.once());
        setupVisualizationScanResultStoreMock({
            tabStops: { needToCollectTabbingResults: true },
        } as VisualizationScanResultData);

        testSubject.start();

        verifyAll();
    });

    it('start does not do anything when already started', () => {
        visualizationScanResultsStoreMock
            .setup(m => m.addChangedListener(It.is(isFunction)))
            .verifiable(Times.once());
        tabStopRequirementRunnerMock.setup(m => m.start()).verifiable(Times.once());
        setupVisualizationScanResultStoreMock({
            tabStops: { needToCollectTabbingResults: true },
        } as VisualizationScanResultData);

        testSubject.start();
        testSubject.start();

        verifyAll();
    });

    it('start does not do anything when needToCollectTabbingResults is false', () => {
        visualizationScanResultsStoreMock
            .setup(m => m.addChangedListener(It.is(isFunction)))
            .verifiable(Times.never());
        tabStopRequirementRunnerMock.setup(m => m.start()).verifiable(Times.never());
        setupVisualizationScanResultStoreMock({
            tabStops: { needToCollectTabbingResults: false },
        } as VisualizationScanResultData);

        testSubject.start();

        verifyAll();
    });

    it('start adds unique tab stop instances when processing tab stops requirement result', async () => {
        const requirementResult: AutomatedTabStopRequirementResult = {
            requirementId: 'keyboard-navigation',
            description: 'some description',
            selector: ['some', 'selector'],
            html: 'some html',
        } as AutomatedTabStopRequirementResult;
        const secondRequirementResult = {
            ...requirementResult,
            html: 'new html',
        };

        setupTabStopRequirementRunner();
        tabStopRequirementActionMessageCreatorMock
            .setup(m => m.addTabStopInstance(It.isValue(requirementResult)))
            .verifiable(Times.once());
        tabStopRequirementActionMessageCreatorMock
            .setup(m => m.addTabStopInstance(It.isValue(secondRequirementResult)))
            .verifiable(Times.once());
        setupVisualizationScanResultStoreMock({
            tabStops: { needToCollectTabbingResults: true },
        } as VisualizationScanResultData);

        testSubject.start();

        // send 1 duplicate and 2 unique results
        requirementResultRunnerCallback(requirementResult);
        requirementResultRunnerCallback(requirementResult);
        requirementResultRunnerCallback(secondRequirementResult);

        verifyAll();
    });

    describe('onStateChange', () => {
        it('sends message when tabbing is completed', () => {
            const visualizationScanResultsStoreState = {
                tabStops: { tabbingCompleted: true, needToCollectTabbingResults: true },
            } as VisualizationScanResultData;

            setupVisualizationScanResultStoreMock(visualizationScanResultsStoreState);
            tabStopRequirementActionMessageCreatorMock
                .setup(m => m.updateNeedToCollectTabbingResults(false))
                .verifiable(Times.once());

            let visualizationResultsListener;
            visualizationScanResultsStoreMock
                .setup(m => m.addChangedListener(It.is(isFunction)))
                .callback(listener => {
                    visualizationResultsListener = listener;
                })
                .verifiable(Times.once());

            testSubject.start();
            visualizationResultsListener();

            verifyAll();
        });

        it('does not send message when tabbing is not completed', () => {
            tabStopRequirementActionMessageCreatorMock
                .setup(m => m.updateNeedToCollectTabbingResults(It.isAny()))
                .verifiable(Times.never());

            let visualizationResultsListener;
            visualizationScanResultsStoreMock
                .setup(m => m.addChangedListener(It.is(isFunction)))
                .returns(listener => {
                    visualizationResultsListener = listener;
                })
                .verifiable(Times.once());

            setupVisualizationScanResultStoreMock({
                tabStops: { needToCollectTabbingResults: true },
            } as VisualizationScanResultData);
            testSubject.start();
            visualizationScanResultsStoreMock.reset();

            const visualizationScanResultsStoreState = {
                tabStops: { tabbingCompleted: false, needToCollectTabbingResults: false },
            } as VisualizationScanResultData;
            setupVisualizationScanResultStoreMock(visualizationScanResultsStoreState);

            visualizationResultsListener();

            verifyAll();
        });
    });

    it('stop runs only when not already in a stopped state', () => {
        tabStopRequirementRunnerMock.setup(t => t.stop()).verifiable(Times.once());
        tabStopRequirementActionMessageCreatorMock
            .setup(t => t.automatedTabbingResultsCompleted([]))
            .verifiable(Times.once());
        tabStopRequirementActionMessageCreatorMock
            .setup(t => t.updateNeedToCollectTabbingResults(false))
            .verifiable(Times.once());
        visualizationScanResultsStoreMock
            .setup(m => m.removeChangedListener(It.is(isFunction)))
            .verifiable(Times.once());
        setupVisualizationScanResultStoreMock({
            tabStops: { needToCollectTabbingResults: true },
        } as VisualizationScanResultData);

        testSubject.start();
        testSubject.stop();
        testSubject.stop();

        verifyAll();
    });

    function verifyAll(): void {
        visualizationScanResultsStoreMock.verifyAll();
        tabStopRequirementRunnerMock.verifyAll();
        tabStopRequirementActionMessageCreatorMock.verifyAll();
    }

    function setupVisualizationScanResultStoreMock(
        visualizationScanResultsStoreState: VisualizationScanResultData,
    ): void {
        visualizationScanResultsStoreMock
            .setup(sm => sm.getState())
            .returns(() => visualizationScanResultsStoreState)
            .verifiable(Times.atLeastOnce());
    }

    function setupTabStopRequirementRunner(): void {
        tabStopRequirementRunnerMock
            .setup(t => (t.topWindowCallback = It.is(isFunction)))
            .callback(cb => (requirementResultRunnerCallback = cb))
            .verifiable(Times.once());
        tabStopRequirementRunnerMock.setup(t => t.start()).verifiable(Times.once());
    }
});
