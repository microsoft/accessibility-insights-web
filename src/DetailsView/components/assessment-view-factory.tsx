// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AssessmentDefaultMessageGenerator } from '../../assessments/assessment-default-message-generator';
import { IAssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { AssessmentTestResult } from '../../common/assessment/assessment-test-result';
import { IAssessmentStoreData } from '../../common/types/store-data/iassessment-result-data';
import { ITabStoreData } from '../../common/types/store-data/itab-store-data';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { AssessmentInstanceTableHandler } from '../handlers/assessment-instance-table-handler';
import { AssessmentView, AssessmentViewDeps } from './assessment-view';

export class AssessmentViewFactory {
    private provider: IAssessmentsProvider;
    private assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator;

    constructor(assessmentProvider: IAssessmentsProvider, assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator) {
        this.provider = assessmentProvider;
        this.assessmentDefaultMessageGenerator = assessmentDefaultMessageGenerator;
    }

    public create(
        deps: AssessmentViewDeps,
        assessmentInstanceTableHandler: AssessmentInstanceTableHandler,
        assessmentStoreData: IAssessmentStoreData,
        tabStoreData: ITabStoreData,
        isEnabled: boolean,
        isScanning: boolean,
    ): JSX.Element {
        const assessment = this.provider.forType(assessmentStoreData.assessmentNavState.selectedTestType);
        const configuration = assessment.getVisualizationConfiguration();
        const assessmentData = configuration.getAssessmentData(assessmentStoreData);
        const prevTarget = assessmentStoreData.targetTab;
        const currentTarget = {
            id: tabStoreData.id,
            url: tabStoreData.url,
            title: tabStoreData.title,
        };

        const assessmentTestResult = new AssessmentTestResult(
            this.provider,
            assessmentStoreData.assessmentNavState.selectedTestType,
            assessmentData);

        return (<AssessmentView
            deps={deps}
            isScanning={isScanning}
            isEnabled={isEnabled}
            assessmentNavState={assessmentStoreData.assessmentNavState}
            assessmentInstanceTableHandler={assessmentInstanceTableHandler}
            assessmentProvider={this.provider}
            assessmentData={assessmentData}
            currentTarget={currentTarget}
            prevTarget={prevTarget}
            assessmentDefaultMessageGenerator={this.assessmentDefaultMessageGenerator}
            assessmentTestResult={assessmentTestResult}
        />);
    }
}
