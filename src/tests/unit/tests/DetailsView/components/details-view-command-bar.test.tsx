// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { FileURLProvider } from '../../../../../common/file-url-provider';
import { AssessmentStoreData } from '../../../../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import { TabStoreData } from '../../../../../common/types/store-data/tab-store-data';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import {
    DetailsViewCommandBar,
    DetailsViewCommandBarDeps,
    DetailsViewCommandBarProps,
} from '../../../../../DetailsView/components/details-view-command-bar';
import { DetailsRightPanelConfiguration } from '../../../../../DetailsView/components/details-view-right-panel';
import { ReportExportComponent, ReportExportComponentProps } from '../../../../../DetailsView/components/report-export-component';

describe('DetailsViewCommandBar', () => {
    const theDate = new Date(2019, 2, 12, 9, 0);
    const thePageTitle = 'command-bar-test-tab-title';

    let featureFlagStoreData: FeatureFlagStoreData;
    let actionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let tabStoreData: TabStoreData;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let assessmentStoreData: AssessmentStoreData;
    let rightPanelConfig: DetailsRightPanelConfiguration;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let descriptionPlaceholder: string;
    let reportExportComponentProps: ReportExportComponentProps;
    let renderStartOver: boolean;

    beforeEach(() => {
        featureFlagStoreData = {};
        actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator, MockBehavior.Loose);
        tabStoreData = {
            title: thePageTitle,
            isClosed: false,
        } as TabStoreData;
        reportExportComponentProps = null;
        renderStartOver = true;
        assessmentsProviderMock = Mock.ofType<AssessmentsProvider>(AssessmentsProviderImpl);
        assessmentStoreData = {
            assessmentNavState: {
                selectedTestType: -1,
            },
            resultDescription: 'test description',
        } as AssessmentStoreData;
        rightPanelConfig = {} as DetailsRightPanelConfiguration;
        assessmentsProviderMock
            .setup(provider => provider.forType(-1))
            .returns(() => {
                return {
                    title: 'test title',
                } as Assessment;
            });
        reportGeneratorMock = Mock.ofType<ReportGenerator>(undefined, MockBehavior.Loose);

        descriptionPlaceholder = '7efdac3c-8c94-4e00-a765-6fc8c59a232b';
    });

    function getProps(): DetailsViewCommandBarProps {
        const deps: DetailsViewCommandBarDeps = {
            detailsViewActionMessageCreator: actionMessageCreatorMock.object,
            fileURLProvider: Mock.ofType<FileURLProvider>().object,
            outcomeTypeSemanticsFromTestStatus: { stub: 'outcomeTypeSemanticsFromTestStatus' } as any,
            getCurrentDate: () => theDate,
            reportGenerator: reportGeneratorMock.object,
            getDateFromTimestamp: () => theDate,
        };

        return {
            deps,
            featureFlagStoreData,
            actionMessageCreator: actionMessageCreatorMock.object,
            tabStoreData,
            reportExportComponentProps,
            renderStartOver,
            assessmentsProvider: assessmentsProviderMock.object,
            assessmentStoreData,
            rightPanelConfiguration: rightPanelConfig,
            visualizationScanResultData: null,
            ruleResultsByStatus: null,
        };
    }

    test('renders with export button and dialog', () => {
        testOnPivot(true);
    });

    test('renders without export button and dialog', () => {
        testOnPivot(false);
    });

    test('renders null when tab closed', () => {
        tabStoreData.isClosed = true;

        expect(render()).toBeNull();
    });

    function testOnPivot(givenRenderExportAndStartOver: boolean): void {
        // TODO : Build these props!
        reportExportComponentProps = null;
        renderStartOver = givenRenderExportAndStartOver;
        const props = getProps();
        const rendered = shallow(<DetailsViewCommandBar {...props} />);

        expect(rendered.debug()).toMatchSnapshot();

        // TODO : Split these up
        if (reportExportComponentProps || renderStartOver) {
            reportGeneratorMock
                .setup(rgm =>
                    rgm.generateAssessmentReport(
                        props.assessmentStoreData,
                        props.assessmentsProvider,
                        props.featureFlagStoreData,
                        props.tabStoreData,
                        descriptionPlaceholder,
                    ),
                )
                .verifiable(Times.once());

            rendered
                .find(ReportExportComponent)
                .props()
                .htmlGenerator(descriptionPlaceholder);

            reportGeneratorMock.verifyAll();
        }
    }

    function render(): JSX.Element {
        const testSubject = getTestSubject();

        return testSubject.render();
    }

    function getTestSubject(): DetailsViewCommandBar {
        return new DetailsViewCommandBar(getProps());
    }
});
