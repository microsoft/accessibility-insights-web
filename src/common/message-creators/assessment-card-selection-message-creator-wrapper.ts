// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseStore } from 'common/base-store';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { AssessmentCardSelectionMessageCreator } from 'common/message-creators/assessment-card-selection-message-creator';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';

export const NO_ASSESSMENT_STORE_DATA_ERROR = 'no assessment store data';

export class AssessmentCardSelectionMessageCreatorWrapper implements CardSelectionMessageCreator {
    constructor(
        private assessmentCardSelectionMessageCreator: AssessmentCardSelectionMessageCreator,
        private visualizationFactory: VisualizationConfigurationFactory,
        private assessmentStore: BaseStore<AssessmentStoreData, Promise<void>>,
    ) {}

    public toggleVisualHelper = (event: SupportedMouseEvent) => {
        const testKey = this.getSelectedTestKey();
        return this.assessmentCardSelectionMessageCreator.toggleVisualHelper(event, testKey);
    };

    public expandAllRules = (event: SupportedMouseEvent) => {
        const testKey = this.getSelectedTestKey();
        return this.assessmentCardSelectionMessageCreator.toggleVisualHelper(event, testKey);
    };

    public collapseAllRules = (event: SupportedMouseEvent) => {
        const testKey = this.getSelectedTestKey();
        return this.assessmentCardSelectionMessageCreator.toggleVisualHelper(event, testKey);
    };

    public toggleCardSelection = (
        ruleId: string,
        resultInstanceUid: string,
        event: React.SyntheticEvent,
    ) => {
        const testKey = this.getSelectedTestKey();
        return this.assessmentCardSelectionMessageCreator.toggleCardSelection(
            ruleId,
            resultInstanceUid,
            event,
            testKey,
        );
    };

    public toggleRuleExpandCollapse = (ruleId: string, event: React.SyntheticEvent) => {
        const testKey = this.getSelectedTestKey();
        return this.assessmentCardSelectionMessageCreator.toggleRuleExpandCollapse(
            ruleId,
            event,
            testKey,
        );
    };

    private getSelectedTestKey = () => {
        const assessmentStoreState = this.assessmentStore.getState();

        if (assessmentStoreState == null) {
            throw NO_ASSESSMENT_STORE_DATA_ERROR;
        }

        const selectedTest = this.assessmentStore.getState().assessmentNavState.selectedTestType;
        const testKey = this.visualizationFactory.getConfiguration(selectedTest).key;
        return testKey;
    };
}
