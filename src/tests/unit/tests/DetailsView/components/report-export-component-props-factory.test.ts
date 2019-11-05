// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { CardRuleResultsByStatus } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { DetailsViewCommandBarDeps, DetailsViewCommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { ReportExportComponentProps } from 'DetailsView/components/report-export-component';
import {
    getReportExportComponentPropsForAssessment,
    getReportExportComponentPropsForAutomatedChecks,
} from 'DetailsView/components/report-export-component-props-factory';
import { ReportGenerator } from 'reports/report-generator';
import { ScanResults } from 'scanner/iruleresults';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('ReportExportComponentPropsFactory', () => {
    const theDate = new Date(2019, 2, 12, 9, 0);
    const theTimestamp = 'test timestamp';
    const thePageTitle = 'command-bar-test-tab-title';
    const theDescription = 'test description';
    const theGeneratorOutput = 'generator output';
    const thePageUrl = 'test page url';

    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let featureFlagStoreData: FeatureFlagStoreData;
    let actionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let tabStoreData: TabStoreData;
    let assessmentStoreData: AssessmentStoreData;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let renderStartOver: boolean;
    let visualizationScanResultData: VisualizationScanResultData;
    let cardRuleResultsByStatus: CardRuleResultsByStatus;
    let scanResult: ScanResults;

    beforeEach(() => {
        featureFlagStoreData = {};
        actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator, MockBehavior.Strict);
        tabStoreData = {
            title: thePageTitle,
            url: thePageUrl,
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
        cardRuleResultsByStatus = null;
        scanResult = null;
    });

    function getProps(): DetailsViewCommandBarProps {
        const deps = {
            detailsViewActionMessageCreator: actionMessageCreatorMock.object,
            getCurrentDate: () => theDate,
            reportGenerator: reportGeneratorMock.object,
            getDateFromTimestamp: value => theDate,
        } as DetailsViewCommandBarDeps;

        visualizationScanResultData = {
            issues: {
                scanResult: scanResult,
            },
        } as VisualizationScanResultData;

        return {
            deps,
            featureFlagStoreData,
            actionMessageCreator: actionMessageCreatorMock.object,
            assessmentsProvider: assessmentsProviderMock.object,
            tabStoreData,
            renderStartOver,
            assessmentStoreData,
            visualizationScanResultData,
            ruleResultsByStatus: cardRuleResultsByStatus,
        } as DetailsViewCommandBarProps;
    }

    function setAssessmentReportGenerator(): void {
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
    }

    function setAutomatedChecksReportGenerator(): void {
        reportGeneratorMock
            .setup(x =>
                x.generateFastPassAutomateChecksReport(
                    scanResult,
                    theDate,
                    tabStoreData.title,
                    tabStoreData.url,
                    cardRuleResultsByStatus,
                    theDescription,
                ),
            )
            .returns(() => theGeneratorOutput);
    }

    function setCardsUiFlag(flag: boolean): void {
        featureFlagStoreData['universalCardsUI'] = true;
    }

    test('getReportExportComponentPropsForAssessment expected properties are set', () => {
        setAssessmentReportGenerator();
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

    test('getReportExportComponentPropsForAutomatedChecks, CardsUI is false, props is null', () => {
        const props = getProps();
        const rendered: ReportExportComponentProps = getReportExportComponentPropsForAutomatedChecks(props);

        expect(rendered).toBeNull();
    });

    test('getReportExportComponentPropsForAutomatedChecks, CardsUI is true, scanResults is null, props is null', () => {
        setCardsUiFlag(true);
        const props = getProps();
        const rendered: ReportExportComponentProps = getReportExportComponentPropsForAutomatedChecks(props);

        expect(rendered).toBeNull();
    });

    test('getReportExportComponentPropsForAutomatedChecks, CardsUI is true, scanResults is not null, expected properties are set', () => {
        scanResult = {
            timestamp: theTimestamp,
        } as ScanResults;
        cardRuleResultsByStatus = {} as CardRuleResultsByStatus;

        setCardsUiFlag(true);
        setAutomatedChecksReportGenerator();
        const props = getProps();
        const rendered: ReportExportComponentProps = getReportExportComponentPropsForAutomatedChecks(props);

        expect(rendered.exportResultsType).toBe('AutomatedChecks');
        expect(rendered.getExportDescription()).toBe('');
        expect(rendered.pageTitle).toBe(thePageTitle);
        expect(rendered.scanDate).toBe(theDate);
        expect(rendered.reportGenerator).toBe(reportGeneratorMock.object);
        expect(rendered.htmlGenerator(theDescription)).toBe(theGeneratorOutput);

        reportGeneratorMock.verifyAll();
        actionMessageCreatorMock.verifyAll();
    });
});
