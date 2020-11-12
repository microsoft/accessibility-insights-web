// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { AssessmentDataFormatter } from 'common/assessment-data-formatter';
import { FileURLProvider } from 'common/file-url-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import {
    getSaveButtonForAssessment,
    getSaveButtonForFastPass,
    SaveAssessmentFactoryDeps,
    SaveAssessmentFactoryProps,
} from 'DetailsView/components/save-assessment-factory';

describe('SaveAssessmentFactory', () => {
    let deps: SaveAssessmentFactoryDeps;
    let props: SaveAssessmentFactoryProps;

    beforeEach(() => {
        const fileURLProviderMock: IMock<FileURLProvider> = Mock.ofType(FileURLProvider);
        const assessmentDataFormatterMock: IMock<AssessmentDataFormatter> = Mock.ofType(
            AssessmentDataFormatter,
        );

        const assessmentStoreData = {
            assessments: null,
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
            const rendered = getSaveButtonForAssessment(props);
            expect(rendered).toMatchSnapshot();
        });
    });

    describe('getSaveButtonForFastPass', () => {
        test('renders save assessment button as null', () => {
            const rendered = getSaveButtonForFastPass(props);
            expect(rendered).toBeNull();
        });
    });
});
