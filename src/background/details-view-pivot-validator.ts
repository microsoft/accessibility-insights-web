// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStore } from './stores/global/feature-flag-store';
import { Interpreter } from './interpreter';
import { autobind } from '@uifabric/utilities';
import { FeatureFlags } from '../common/feature-flags';
import { Messages } from '../common/messages';
import { DetailsViewPivotType } from '../common/types/details-view-pivot-type';
import { TabStore } from './stores/tab-store';
import { WindowUtils } from '../common/window-utils';
import { IOnDetailsViewPivotSelected } from './actions/action-payloads';

export class DetailsViewPivotValidator {
    private featureFlagStore: FeatureFlagStore;
    private tabStore: TabStore;
    private interpreter: Interpreter;
    private windowUtils: WindowUtils;
    private oldAssessmentExperienceState: boolean;
    private static readonly featureFlagUpdatedWaitTime = 10;

    constructor(featureFlagStore: FeatureFlagStore, interpreter: Interpreter, tabStore: TabStore, windowUtils: WindowUtils) {
        this.featureFlagStore = featureFlagStore;
        this.interpreter = interpreter;
        this.tabStore = tabStore;
        this.windowUtils = windowUtils;
    }

    public initialize(): void {
        this.oldAssessmentExperienceState = this.featureFlagStore.getState()[FeatureFlags.newAssessmentExperience];
        this.featureFlagStore.addChangedListener(this.onFlagChange);
    }

    @autobind
    private onFlagChange(): void {
        const newState = this.featureFlagStore.getState()[FeatureFlags.newAssessmentExperience];

        if (this.wasNewAssessmentExperienceDisabled(newState)) {
            this.windowUtils.setTimeout(() => {
                const payload: IOnDetailsViewPivotSelected = {
                    pivotKey: DetailsViewPivotType.allTest,
                };
                this.interpreter.interpret({
                    type: Messages.Visualizations.DetailsView.PivotSelect,
                    tabId: this.tabStore.getState().id,
                    payload,
                });
            }, DetailsViewPivotValidator.featureFlagUpdatedWaitTime);
        }

        if (this.wasNewAssessmentExperienceEnabled(newState)) {
            this.windowUtils.setTimeout(() => {
                const payload: IOnDetailsViewPivotSelected = {
                    pivotKey: DetailsViewPivotType.fastPass,
                };
                this.interpreter.interpret({
                    type: Messages.Visualizations.DetailsView.PivotSelect,
                    tabId: this.tabStore.getState().id,
                    payload,
                });
            }, DetailsViewPivotValidator.featureFlagUpdatedWaitTime);
        }

        this.oldAssessmentExperienceState = newState;
    }

    private wasNewAssessmentExperienceDisabled(newState: boolean): boolean {
        return newState === false && newState !== this.oldAssessmentExperienceState;
    }

    private wasNewAssessmentExperienceEnabled(newState: boolean): boolean {
        return newState === true && newState !== this.oldAssessmentExperienceState;
    }
}
