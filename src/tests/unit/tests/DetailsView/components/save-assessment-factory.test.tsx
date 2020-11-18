// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';
import { AssessmentDataFormatter } from 'common/assessment-data-formatter';
import { FileURLProvider } from 'common/file-url-provider';
import { FileNameBuilder } from 'common/filename-builder';
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
    const fileNameBuilderMock = Mock.ofType(FileNameBuilder);

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
            persistedTabInfo: { title: 'SavedAssesment123' },
        } as AssessmentStoreData;

        deps = {
            assessmentDataFormatter: assessmentDataFormatterMock.object,
            fileURLProvider: fileURLProviderMock.object,
            fileNameBuilder: fileNameBuilderMock.object,
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
            const currentDate = new Date();
            const title = props.assessmentStoreData.persistedTabInfo.title;

            assessmentDataFormatterMock
                .setup(a => a.formatAssessmentData(assessmentData))
                .returns(() => formattedAssessmentData)
                .verifiable(Times.once());

            fileURLProviderMock
                .setup(f => f.provideURL([formattedAssessmentData], 'application/json'))
                .returns(() => 'fileURL')
                .verifiable(Times.once());

            fileNameBuilderMock.setup(f => f.getDateSegment(currentDate)).returns(() => 'date');

            fileNameBuilderMock.setup(f => f.getTitleSegment(title)).returns(() => 'title');

            const rendered = getSaveButtonForAssessment(props);
            expect(rendered).toMatchSnapshot();
            assessmentDataFormatterMock.verifyAll();
            fileURLProviderMock.verifyAll();
            fileNameBuilderMock.verifyAll();
        });
    });

    describe('getSaveButtonForFastPass', () => {
        test('renders save assessment button as null', () => {
            const rendered = getSaveButtonForFastPass(props);
            expect(rendered).toBeNull();
        });
    });
});
