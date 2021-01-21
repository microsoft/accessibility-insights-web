// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Assessment } from 'assessments/types/iassessment';
import { InitialDataCreator } from 'background/create-initial-assessment-test-data';
import { InitialAssessmentStoreDataGenerator } from 'background/initial-assessment-store-data-generator';
import { flatMap } from 'lodash';
import { IMock, Mock, MockBehavior } from 'typemoq';
import {
    AssessmentData,
    AssessmentStoreData,
} from '../../../../common/types/store-data/assessment-result-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { DictionaryStringTo } from '../../../../types/common-types';
import { CreateTestAssessmentProvider } from '../../common/test-assessment-provider';

describe('InitialAssessmentStoreDataGenerator.generateInitialState', () => {
    const assesssmentsProvider = CreateTestAssessmentProvider();
    const assessments = assesssmentsProvider.all();
    const validTargetTab = { id: 1, url: 'url', title: 'title', appRefreshed: false };
    const knownTestType = assessments[0].visualizationType;
    const unknownTestType = -100 as VisualizationType;
    const knownRequirementIds = flatMap(assessments, test =>
        test.requirements.map(step => step.key),
    );
    const knownRequirement1 = knownRequirementIds[0];
    const unknownRequirement: string = 'unknown-requirement';
    const assessmentDataStub = {} as AssessmentData;
    let defaultState: AssessmentStoreData;
    let initialDataCreatorMock: IMock<InitialDataCreator>;
    let generator: InitialAssessmentStoreDataGenerator;

    beforeEach(() => {
        initialDataCreatorMock = Mock.ofInstance(() => null, MockBehavior.Strict);
        assessments.forEach(assessment => {
            (assessment as Assessment).initialDataCreator = initialDataCreatorMock.object;
            initialDataCreatorMock
                .setup(mock => mock(assessment, null))
                .returns(() => assessmentDataStub);
        });
        generator = new InitialAssessmentStoreDataGenerator(assessments);
        defaultState = generator.generateInitialState();
    });

    it('generates the pinned default state from assessmentsProvider data when no persistedData is provided', () => {
        expect(defaultState).toMatchSnapshot();
    });

    it.each([[undefined], [null]])(
        'passes nulled persisted data to initial data creator if persistedData.assessments is %p',
        persistedAssessments => {
            const generatedState = generator.generateInitialState({
                assessments: persistedAssessments,
            } as AssessmentStoreData);

            expect(generatedState.assessments).toEqual(defaultState.assessments);
        },
    );

    it('passes persisted data to initial data creator if persistedData.assessments is non-nullable', () => {
        const persistedAssessments: DictionaryStringTo<AssessmentData> = {};

        assessments.forEach(assessment => {
            persistedAssessments[assessment.key] = {} as AssessmentData;
            (assessment as Assessment).initialDataCreator = initialDataCreatorMock.object;
            initialDataCreatorMock
                .setup(mock => mock(assessment, persistedAssessments[assessment.key]))
                .returns(() => assessmentDataStub);
        });

        const generatedState = generator.generateInitialState({
            assessments: persistedAssessments,
        } as AssessmentStoreData);

        expect(generatedState.assessments).toEqual(defaultState.assessments);
    });

    it('passes persisted result description data to initial data creator if persistedData.resultDescription exists', () => {
        const persistedDescription = 'persistent description';

        const generatedState = generator.generateInitialState({
            resultDescription: persistedDescription,
        } as AssessmentStoreData);

        expect(generatedState.resultDescription).toEqual(persistedDescription);
    });

    it.each([[undefined], [null]])(
        'propagates unspecified persistedTabInfo values as-is',
        persistedTabInfo => {
            const generatedState = generator.generateInitialState({
                persistedTabInfo,
            } as AssessmentStoreData);

            expect(generatedState.persistedTabInfo).toEqual(persistedTabInfo);
        },
    );

    it.each([[undefined], [true], [false]])(
        'outputs persistedTabInfo.appRefreshed as true even if it was set to %p in input persistedData',
        persistedAppRefreshed => {
            const generatedState = generator.generateInitialState({
                persistedTabInfo: { ...validTargetTab, appRefreshed: persistedAppRefreshed },
                assessmentNavState: null,
                assessments: null,
                resultDescription: '',
            });

            expect(generatedState.persistedTabInfo.appRefreshed).toBe(true);
        },
    );

    it('outputs persistedTabInfo properties other than appRefreshed as they appeared in persistedData', () => {
        const generatedState = generator.generateInitialState({
            persistedTabInfo: validTargetTab,
            assessmentNavState: null,
            assessments: null,
            resultDescription: '',
        });

        const { appRefreshed, ...tabInfoPropertiesThatShouldPropagate } = validTargetTab;
        expect(generatedState.persistedTabInfo).toMatchObject(tabInfoPropertiesThatShouldPropagate);
    });

    it.each`
        selectedTestStep      | selectedTestType
        ${unknownRequirement} | ${unknownTestType}
        ${unknownRequirement} | ${knownTestType}
        ${knownRequirement1}  | ${unknownTestType}
        ${knownRequirement1}  | ${knownTestType}
    `(
        'outputs the first test/step for assessmentNavState regardless of the persisted state ($selectedTestStep/$selectedTestType)',
        ({ selectedTestStep, selectedTestType }) => {
            const generatedState = generator.generateInitialState({
                assessmentNavState: {
                    selectedTestSubview: selectedTestStep,
                    selectedTestType,
                },
            } as AssessmentStoreData);

            expect(generatedState.assessmentNavState).toEqual(defaultState.assessmentNavState);
        },
    );
});
