// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { ExportDialogDeps } from 'DetailsView/components/export-dialog';
import { StartOverComponentProps } from 'DetailsView/components/start-over-component';
import { DetailsViewBodyProps } from 'DetailsView/details-view-body';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { IMock, Mock, MockBehavior } from 'typemoq';
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
    let startOverComponentProps: StartOverComponentProps;

    beforeEach(() => {
        featureFlagStoreData = {};
        actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator, MockBehavior.Loose);
        tabStoreData = {
            title: thePageTitle,
            isClosed: false,
        } as TabStoreData;
        reportExportComponentProps = null;
        startOverComponentProps = null;
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

    function getProps(renderStartOver: boolean): DetailsViewCommandBarProps {
        startOverComponentProps = {
            render: renderStartOver,
        } as StartOverComponentProps;

        const CommandBarStub: Readonly<ReactFCWithDisplayName<DetailsViewBodyProps>> = NamedFC<DetailsViewBodyProps>('test', _ => null);
        const LeftNavStub: Readonly<ReactFCWithDisplayName<DetailsViewBodyProps>> = NamedFC<DetailsViewBodyProps>('test', _ => null);
        const switcherNavConfiguration: DetailsViewSwitcherNavConfiguration = {
            CommandBar: CommandBarStub,
            ReportExportComponentPropertyFactory: p => reportExportComponentProps,
            StartOverComponentPropertyFactory: p => startOverComponentProps,
            LeftNav: LeftNavStub,
        } as DetailsViewSwitcherNavConfiguration;

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
            assessmentsProvider: assessmentsProviderMock.object,
            assessmentStoreData,
            rightPanelConfiguration: rightPanelConfig,
            visualizationScanResultData: null,
            cardsViewData: null,
            switcherNavConfiguration: switcherNavConfiguration,
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
        const theHtml = 'this is the HTML';
        let theDescription = null;
        let reportProps: ReportExportComponentProps = null;
        if (givenRenderExportAndStartOver) {
            reportProps = {
                deps: {} as ExportDialogDeps,
                reportGenerator: reportGeneratorMock.object,
                pageTitle: thePageTitle,
                exportResultsType: 'Assessment',
                scanDate: theDate,
                htmlGenerator: description => {
                    theDescription = description;
                    return theHtml;
                },
                updatePersistedDescription: () => null,
                getExportDescription: () => descriptionPlaceholder,
            };
        }
        reportExportComponentProps = reportProps;
        const props = getProps(givenRenderExportAndStartOver);
        const rendered = shallow(<DetailsViewCommandBar {...props} />);

        expect(rendered.debug()).toMatchSnapshot();

        if (givenRenderExportAndStartOver) {
            expect(
                rendered
                    .find(ReportExportComponent)
                    .props()
                    .htmlGenerator(descriptionPlaceholder),
            ).toBe(theHtml);
            expect(theDescription).toBe(descriptionPlaceholder);
        }
    }

    function render(): JSX.Element {
        const testSubject = getTestSubject();

        return testSubject.render();
    }

    function getTestSubject(): DetailsViewCommandBar {
        return new DetailsViewCommandBar(getProps(true));
    }
});
