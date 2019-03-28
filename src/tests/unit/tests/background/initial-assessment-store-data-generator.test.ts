// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { flatMap } from 'lodash';

import { InitialAssessmentStoreDataGenerator } from '../../../../background/initial-assessment-store-data-generator';
import { IAssessmentStoreData } from '../../../../common/types/store-data/iassessment-result-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { CreateTestAssessmentProvider } from '../../common/test-assessment-provider';

describe('InitialAssessmentStoreDataGenerator.generateInitialState', () => {
    const assesssmentsProvider = CreateTestAssessmentProvider();
    const generator = new InitialAssessmentStoreDataGenerator(assesssmentsProvider.all());

    const validTargetTab = { id: 1, url: 'url', title: 'title', appRefreshed: false };
    const knownTestType = assesssmentsProvider.all()[0].type;
    const unknownTestType = -100 as VisualizationType;
    const knownRequirementIds = flatMap(assesssmentsProvider.all(), test => test.steps.map(step => step.key));
    const knownRequirement1 = knownRequirementIds[0];
    const unknownRequirement: string = 'unknown-requirement';
    let defaultState: IAssessmentStoreData;

    beforeEach(() => {
        defaultState = generator.generateInitialState();
    });

    it('generates the pinned default state from assessmentsProvider data when no persistedData is provided', () => {
        expect(defaultState).toMatchSnapshot();
    });

    it.each([[undefined], [null], [{}]])('outputs default assessment data if persistedData.assessments is %p', persistedAssessments => {
        const generatedState = generator.generateInitialState({
            assessments: persistedAssessments,
        } as IAssessmentStoreData);

        expect(generatedState.assessments).toEqual(defaultState.assessments);
    });

    it.each([[undefined], [null]])('propagates unspecified persistedTabInfo values as-is', persistedTabInfo => {
        const generatedState = generator.generateInitialState({
            persistedTabInfo,
        } as IAssessmentStoreData);

        expect(generatedState.persistedTabInfo).toEqual(persistedTabInfo);
    });

    it.each([[undefined], [true], [false]])(
        'outputs persistedTabInfo.appRefreshed as true even if it was set to %p in input persistedData',
        persistedAppRefreshed => {
            const generatedState = generator.generateInitialState({
                persistedTabInfo: { ...validTargetTab, appRefreshed: persistedAppRefreshed },
                assessmentNavState: null,
                assessments: null,
            });

            expect(generatedState.persistedTabInfo.appRefreshed).toBe(true);
        },
    );

    it('outputs persistedTabInfo properties other than appRefreshed as they appeared in persistedData', () => {
        const generatedState = generator.generateInitialState({
            persistedTabInfo: validTargetTab,
            assessmentNavState: null,
            assessments: null,
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
                    selectedTestStep,
                    selectedTestType,
                },
            } as IAssessmentStoreData);

            expect(generatedState.assessmentNavState).toEqual(defaultState.assessmentNavState);
        },
    );
});
