// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDataFormatter } from 'common/assessment-data-formatter';
import { FileURLProvider } from 'common/file-url-provider';
import { FileNameBuilder } from 'common/filename-builder';
import {
    AssessmentStoreData,
    AssessmentData,
} from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import {
    getSaveButtonForAssessment,
    getSaveButtonForFastPass,
    SaveAssessmentButtonFactoryDeps,
    SaveAssessmentButtonFactoryProps,
} from 'DetailsView/components/save-assessment-button-factory';
import { Mock, Times } from 'typemoq';

describe('SaveAssessmentButtonFactory', () => {
    let deps: SaveAssessmentButtonFactoryDeps;
    let props: SaveAssessmentButtonFactoryProps;
    const fileURLProviderMock = Mock.ofType(FileURLProvider);
    const assessmentDataFormatterMock = Mock.ofType(AssessmentDataFormatter);
    const fileNameBuilderMock = Mock.ofType(FileNameBuilder);
    const getCurrentDateStub = () => dateValue;
    const dateValue = new Date(2020, 11, 20);

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
            persistedTabInfo: { title: 'SavedAssessment123' },
        } as AssessmentStoreData;

        const tabStoreData = {
            title: 'title',
        } as TabStoreData;

        deps = {
            assessmentDataFormatter: assessmentDataFormatterMock.object,
            fileURLProvider: fileURLProviderMock.object,
            fileNameBuilder: fileNameBuilderMock.object,
            getCurrentDate: getCurrentDateStub,
        } as SaveAssessmentButtonFactoryDeps;
        props = {
            deps,
            assessmentStoreData,
            tabStoreData,
        } as SaveAssessmentButtonFactoryProps;
    });

    describe('getSaveButtonForAssessment', () => {
        test('renders save assessment button', () => {
            const assessmentData = props.assessmentStoreData;
            const formattedAssessmentData = JSON.stringify(assessmentData);
            const title = props.tabStoreData.title;

            assessmentDataFormatterMock
                .setup(a => a.formatAssessmentData(assessmentData))
                .returns(() => formattedAssessmentData)
                .verifiable(Times.once());

            fileURLProviderMock
                .setup(f => f.provideURL([formattedAssessmentData], 'application/json'))
                .returns(() => 'fileURL')
                .verifiable(Times.once());

            fileNameBuilderMock.setup(f => f.getDateSegment(dateValue)).returns(() => 'date');

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
