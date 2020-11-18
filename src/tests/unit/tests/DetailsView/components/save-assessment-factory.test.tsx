// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';
import { AssessmentDataFormatter } from 'common/assessment-data-formatter';
import { FileURLProvider } from 'common/file-url-provider';
import {
    AssessmentStoreData,
    AssessmentData,
} from 'common/types/store-data/assessment-result-data';
import {
    getSaveButtonForAssessment,
    getSaveButtonForFastPass,
    SaveAssessmentFactoryDeps,
    SaveAssessmentFactoryProps,
} from 'DetailsView/components/save-assessment-factory';

describe('SaveAssessmentFactory', () => {
    let deps: SaveAssessmentFactoryDeps;
    let props: SaveAssessmentFactoryProps;
    const fileURLProviderMock = Mock.ofType(FileURLProvider);
    const assessmentDataFormatterMock = Mock.ofType(AssessmentDataFormatter);

    beforeEach(() => {
        const assessmentStoreData = {
            assessments: {
                ['assessment-1']: {
                    fullAxeResultsMap: null,
                    generatedAssessmentInstancesMap: null,
                    manualTestStepResultMap: {
                        ['assessment-1-step-1']: {
                            instances: [],
                            status: 2,
                            id: 'assessment-1-step-1',
                        },
                        ['removed-step']: {
                            instances: [],
                            status: 2,
                            id: '123',
                        },
                    },
                    testStepStatus: {},
                },
            } as { [key: string]: AssessmentData },
        } as AssessmentStoreData;

        deps = {
            assessmentDataFormatter: assessmentDataFormatterMock.object,
            fileURLProvider: fileURLProviderMock.object,
        } as SaveAssessmentFactoryDeps;
        props = {
            deps,
            assessmentStoreData,
        } as SaveAssessmentFactoryProps;
    });

    describe('getSaveButtonForAssessment', () => {
        test('renders save assessment button', () => {
            const assessmentData = props.assessmentStoreData.assessments;
            const formattedAssessmentData = JSON.stringify(assessmentData);

            assessmentDataFormatterMock
                .setup(a => a.formatAssessmentData(assessmentData))
                .returns(() => formattedAssessmentData)
                .verifiable(Times.once());

            fileURLProviderMock
                .setup(f => f.provideURL([formattedAssessmentData], 'application/json'))
                .returns(() => 'fileURL')
                .verifiable(Times.once());

            const rendered = getSaveButtonForAssessment(props);
            expect(rendered).toMatchSnapshot();
            assessmentDataFormatterMock.verifyAll();
            fileURLProviderMock.verifyAll();
        });
    });

    describe('getSaveButtonForFastPass', () => {
        test('renders save assessment button as null', () => {
            const rendered = getSaveButtonForFastPass(props);
            expect(rendered).toBeNull();
        });
    });
});
