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
        private readonly tabStopRequirementRunner: AllFrameRunner<AutomatedTabStopRequirementResult>,
        private readonly tabStopRequirementActionMessageCreator: TabStopRequirementActionMessageCreator,
        private readonly visualizationResultsStore: BaseStore<VisualizationScanResultData>,
    ) {}

    public start = (): void => {
        if (!this.isStopped) {
            return;
        }

        this.seenTabStopRequirementResults = [];
        this.tabStopRequirementRunner.topWindowCallback = this.processTabStopRequirementResults;
        this.tabStopRequirementRunner.start();

        this.isStopped = false;
    };

    public listenToStore(): void {
        this.visualizationResultsStore.addChangedListener(this.onStateChange);
        this.onStateChange();
    }

    private onStateChange = (): void => {
        this.stop();
    };

    public stop = (): void => {
        if (this.isStopped) {
            return;
        }

        const state = this.visualizationResultsStore.getState();
        if (state.tabStops.tabbingCompleted && state.tabStops.needToCollectTabbingResults) {
            this.tabStopRequirementRunner.stop();
            this.tabStopRequirementActionMessageCreator.automatedTabbingResultsCompleted(
                this.seenTabStopRequirementResults,
            );
            this.tabStopRequirementActionMessageCreator.updateNeedToCollectTabbingResults(false);
            this.isStopped = true;
        }
    };

    private processTabStopRequirementResults = (
        tabStopRequirementResult: AutomatedTabStopRequirementResult,
    ): void => {
        const duplicateResult = this.seenTabStopRequirementResults.some(r =>
            isEqual(r, tabStopRequirementResult),
        );

        if (!duplicateResult) {
            this.tabStopRequirementActionMessageCreator.addTabStopInstance({
                description: tabStopRequirementResult.description,
                requirementId: tabStopRequirementResult.requirementId,
                selector: tabStopRequirementResult.selector,
                html: tabStopRequirementResult.html,
            });
            this.seenTabStopRequirementResults.push(tabStopRequirementResult);
        }
    };
}
