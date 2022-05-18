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
    PersistedTabInfo,
} from '../../../../common/types/store-data/assessment-result-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { DictionaryStringTo } from '../../../../types/common-types';
import { CreateTestAssessmentProvider } from '../../common/test-assessment-provider';

describe('InitialAssessmentStoreDataGenerator.generateInitialState', () => {
    const assesssmentsProvider = CreateTestAssessmentProvider();
    const assessments = assesssmentsProvider.all();
    const validTargetTab = { id: 1, url: 'url', title: 'title', detailsViewId: 'fakeId' };
    const knownTestType = assessments[0].visualizationType;
    const unknownTestType = -100 as VisualizationType;
    const knownRequirementIds = flatMap(assessments, test =>
        test.requirements.map(step => step.key),
    );
    const knownRequirement1 = knownRequirementIds[0];
    const unknownRequirement: string = 'unknown-requirement';
    const knownExpandedTestType = assessments[0].visualizationType;
    const unknownExpandedTestType = -100 as VisualizationType;
    const undefinedType = undefined;
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

    it('outputs persistedTabInfo properties as they appeared in persistedData', () => {
        const generatedState = generator.generateInitialState({
            persistedTabInfo: validTargetTab,
            assessmentNavState: null,
            assessments: null,
            resultDescription: '',
        });

        const { detailsViewId, ...tabInfoPropertiesThatShouldPropagate } = validTargetTab;
        expect(generatedState.persistedTabInfo).toMatchObject(tabInfoPropertiesThatShouldPropagate);
    });

    it.each`
        selectedTestSubview   | selectedTestType   | expandedTestType
        ${unknownRequirement} | ${unknownTestType} | ${knownExpandedTestType}
        ${unknownRequirement} | ${knownTestType}   | ${unknownExpandedTestType}
        ${knownRequirement1}  | ${unknownTestType} | ${knownExpandedTestType}
        ${knownRequirement1}  | ${knownTestType}   | ${unknownExpandedTestType}
        ${undefinedType}      | ${undefinedType}   | ${undefinedType}
    `(
        'outputs the assessmentNavState as they appear in persisted state ($selectedTestSubview/$selectedTestType/$expandedTestType)',
        ({ selectedTestSubview, selectedTestType, expandedTestType }) => {
            const generatedState = generator.generateInitialState({
                assessmentNavState: {
                    selectedTestSubview: selectedTestSubview,
                    selectedTestType,
                    expandedTestType,
                },
            } as AssessmentStoreData);

            const expectedNavState = {
                expandedTestType,
                selectedTestSubview:
                    selectedTestSubview ?? defaultState.assessmentNavState.selectedTestSubview,
                selectedTestType:
                    selectedTestType ?? defaultState.assessmentNavState.selectedTestType,
            };
            expect(generatedState.assessmentNavState).toEqual(expectedNavState);
        },
    );

    it('removed depreciated appRefreshed property if present', () => {
        const tabWithAppRefreshed = {
            appRefreshed: false,
            detailsViewId: 'testId',
        } as PersistedTabInfo;
        const generatedState = generator.generateInitialState({
            persistedTabInfo: tabWithAppRefreshed,
            assessmentNavState: null,
            assessments: null,
            resultDescription: '',
        });

        expect(generatedState.persistedTabInfo).toMatchObject({ detailsViewId: 'testId' });
    });
});
