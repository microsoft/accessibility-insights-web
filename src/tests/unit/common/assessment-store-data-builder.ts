// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IAssessmentsProvider } from '../../../assessments/types/iassessments-provider';
import { AssessmentDataConverter } from '../../../background/assessment-data-converter';
import { AssessmentStore } from '../../../background/stores/assessment-store';
import { IAssessmentData, IAssessmentStoreData } from '../../../common/types/store-data/iassessment-result-data';
import { VisualizationType } from '../../../common/types/visualization-type';
import { BaseDataBuilder } from './base-data-builder';

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
