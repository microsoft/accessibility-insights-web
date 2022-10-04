// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseStore } from 'common/base-store';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { AllFrameRunner } from 'injected/all-frame-runner';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import { isEqual } from 'lodash';

export class TabStopsRequirementResultProcessor {
    private seenTabStopRequirementResults: AutomatedTabStopRequirementResult[] = [];
    private isStopped: boolean = true;

    constructor(
        private readonly tabStopRequirementRunner: AllFrameRunner<
            AutomatedTabStopRequirementResult[]
        >,
        private readonly tabStopRequirementActionMessageCreator: TabStopRequirementActionMessageCreator,
        private readonly visualizationResultsStore: BaseStore<
            VisualizationScanResultData,
            Promise<void>
        >,
    ) {}

    public start = async (): Promise<void> => {
        const state = this.visualizationResultsStore.getState();

        if (!this.isStopped || !state?.tabStops?.needToCollectTabbingResults) {
            return;
        }

        this.visualizationResultsStore.addChangedListener(this.onStateChange);

        this.seenTabStopRequirementResults = [];
        this.tabStopRequirementRunner.topWindowCallback = this.processTabStopRequirementResults;
        await this.tabStopRequirementRunner.start();

        this.isStopped = false;
    };

    private onStateChange = async (): Promise<void> => {
        // Checking state here rather than in stop(), to ensure results are recorded when stop() is
        // called during teardown, when tabbing may not have been completed (i.e. user disables toggle)
        const state = this.visualizationResultsStore.getState();
        if (state.tabStops.tabbingCompleted && state.tabStops.needToCollectTabbingResults) {
            await this.stop();
        }
    };

    public stop = async (): Promise<void> => {
        if (this.isStopped) {
            return;
        }

        await this.tabStopRequirementRunner.stop();
        this.tabStopRequirementActionMessageCreator.automatedTabbingResultsCompleted(
            this.seenTabStopRequirementResults,
        );
        this.tabStopRequirementActionMessageCreator.updateNeedToCollectTabbingResults(false);

        this.visualizationResultsStore.removeChangedListener(this.onStateChange);

        this.isStopped = true;
    };

    private processTabStopRequirementResults = (
        tabStopRequirementResults: AutomatedTabStopRequirementResult[],
    ): void => {
        const filteredResults = [];

        tabStopRequirementResults.forEach(result => {
            const duplicateResult = this.seenTabStopRequirementResults.some(seenResult =>
                isEqual(seenResult, result),
            );

            if (!duplicateResult) {
                filteredResults.push(result);
                this.seenTabStopRequirementResults.push(result);
            }
        });

        if (filteredResults.length === 0) {
            return;
        }

        this.tabStopRequirementActionMessageCreator.addTabStopInstanceArray(filteredResults);
    };
}
