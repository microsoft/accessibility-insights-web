// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseDataBuilder } from './base-data-builder';
import { IAssessmentStoreData, IAssessmentData } from '../../common/types/store-data/iassessment-result-data';
import { IAssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { AssessmentStore } from '../../background/stores/assessment-store';
import { VisualizationType } from '../../common/types/visualization-type';
import { AssessmentDataConverter } from '../../background/assessment-data-converter';

export class AssessmentsStoreDataBuilder extends BaseDataBuilder<IAssessmentStoreData> {
    constructor(provider: IAssessmentsProvider, dataConverter: AssessmentDataConverter) {
        super();
        this.data = new AssessmentStore(null, null, dataConverter, null, provider, null, null).getDefaultState();
    }

    public withAssessment(assessmentName: string, data: IAssessmentData): AssessmentsStoreDataBuilder {
        this.data.assessments[assessmentName] = data;
        return this;
    }

    public withSelectedTestType(type: VisualizationType): AssessmentsStoreDataBuilder {
        this.data.assessmentNavState.selectedTestType = type;
        return this;
    }

    public withSelectedTestStep(step: string): AssessmentsStoreDataBuilder {
        this.data.assessmentNavState.selectedTestStep = step;
        return this;
    }

    public withTargetTab(id: number, url: string, title: string): AssessmentsStoreDataBuilder {
        this.data.targetTab = { id, url, title };
        return this;
    }
}
