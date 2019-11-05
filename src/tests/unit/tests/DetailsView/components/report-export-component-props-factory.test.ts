// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { DetailsViewCommandBarDeps, DetailsViewCommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { ReportExportComponentProps } from 'DetailsView/components/report-export-component';
import { getReportExportComponentPropsForAssessment } from 'DetailsView/components/report-export-component-props-factory';
import { ReportGenerator } from 'reports/report-generator';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('ReportExportComponentPropsFactory', () => {
    const theDate = new Date(2019, 2, 12, 9, 0);
    const thePageTitle = 'command-bar-test-tab-title';
    const theDescription = 'test description';
    const theGeneratorOutput = 'generator output';

    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let featureFlagStoreData: FeatureFlagStoreData;
    let actionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let tabStoreData: TabStoreData;
    let assessmentStoreData: AssessmentStoreData;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let renderStartOver: boolean;

    beforeEach(() => {
        featureFlagStoreData = {};
        actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator, MockBehavior.Strict);
        tabStoreData = {
            title: thePageTitle,
        } as TabStoreData;
        renderStartOver = true;
        assessmentStoreData = {
            assessmentNavState: {
                selectedTestType: -1,
            },
            resultDescription: theDescription,
        } as AssessmentStoreData;
        assessmentsProviderMock = Mock.ofType<AssessmentsProvider>(undefined, MockBehavior.Loose);
        reportGeneratorMock = Mock.ofType<ReportGenerator>(undefined, MockBehavior.Strict);
        reportGeneratorMock
            .setup(x =>
                x.generateAssessmentReport(
                    assessmentStoreData,
                    assessmentsProviderMock.object,
                    featureFlagStoreData,
                    tabStoreData,
                    theDescription,
                ),
            )
            .returns(() => theGeneratorOutput);
    });

    function getProps(): DetailsViewCommandBarProps {
        const deps = {
            detailsViewActionMessageCreator: actionMessageCreatorMock.object,
            getCurrentDate: () => theDate,
            reportGenerator: reportGeneratorMock.object,
        } as DetailsViewCommandBarDeps;

        return {
            deps,
            featureFlagStoreData,
            actionMessageCreator: actionMessageCreatorMock.object,
            assessmentsProvider: assessmentsProviderMock.object,
            tabStoreData,
            renderStartOver,
            assessmentStoreData,
        } as DetailsViewCommandBarProps;
    }

    test('getReportExportComponentPropsForAssessment expected properties are set', () => {
        const props = getProps();
        const rendered: ReportExportComponentProps = getReportExportComponentPropsForAssessment(props);

        expect(rendered.exportResultsType).toBe('Assessment');
        expect(rendered.getExportDescription()).toBe(theDescription);
        expect(rendered.pageTitle).toBe(thePageTitle);
        expect(rendered.scanDate).toBe(theDate);
        expect(rendered.reportGenerator).toBe(reportGeneratorMock.object);
        expect(rendered.htmlGenerator(theDescription)).toBe(theGeneratorOutput);

        reportGeneratorMock.verifyAll();
        actionMessageCreatorMock.verifyAll();
    });
});
