import { InitialAssessmentStoreDataGenerator } from './../../../background/intial-assessment-store-data-generator';
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from '../../../assessments/types/iassessments-provider';
import { AssessmentDataConverter } from '../../../background/assessment-data-converter';
import { AssessmentStore } from '../../../background/stores/assessment-store';
import { IAssessmentData, IAssessmentStoreData } from '../../../common/types/store-data/iassessment-result-data';
import { VisualizationType } from '../../../common/types/visualization-type';
import { BaseDataBuilder } from './base-data-builder';

export class AssessmentsStoreDataBuilder extends BaseDataBuilder<IAssessmentStoreData> {
    constructor(
        provider: AssessmentsProvider,
        dataConverter: AssessmentDataConverter,
        initialAssessmentStoreDataGenerator?: InitialAssessmentStoreDataGenerator,
    ) {
        super();
        this.data = new AssessmentStore(
            null,
            null,
            dataConverter,
            null,
            provider,
            null,
            null,
            initialAssessmentStoreDataGenerator || new InitialAssessmentStoreDataGenerator(provider.all()),
        ).getDefaultState();
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

    public withTargetTab(id: number, url: string, title: string, appRefreshed: boolean): AssessmentsStoreDataBuilder {
        this.data.persistedTabInfo = { id, url, title, appRefreshed };
        return this;
    }
}
