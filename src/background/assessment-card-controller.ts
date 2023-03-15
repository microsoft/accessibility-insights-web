// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from 'common/base-store';
import { AssessmentCardSelectionMessageCreator } from 'common/message-creators/assessment-card-selection-message-creator';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';

export class AssessmentCardController {
    constructor(
        private readonly assessmentStore: BaseStore<AssessmentStoreData, Promise<void>>,
        private readonly assessmentCardSelectionMessageCreator: AssessmentCardSelectionMessageCreator,
    ) {}

    public initialize(): void {
        this.assessmentStore.addChangedListener(this.onAssessmentStoreChanged);
    }

    private onAssessmentStoreChanged = async (): Promise<void> => {
        const assessmentStoreState = this.assessmentStore.getState();
        console.log(assessmentStoreState);

        this.assessmentCardSelectionMessageCreator.assessmentStoreChanged(assessmentStoreState);
    };
}
