// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import {
    ScanMetadata,
    TargetAppData,
    ToolData,
} from 'common/types/store-data/unified-data-interface';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    DetailsViewCommandBarDeps,
    DetailsViewCommandBarProps,
} from 'DetailsView/components/details-view-command-bar';
import {
    getReportExportPropsForAssessment,
    getReportExportPropsForFastPass,
} from 'DetailsView/components/report-export-props-factory';
import { ReportGenerator } from 'reports/report-generator';
import { ScanResults } from 'scanner/iruleresults';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('ReportExportPropsFactory', () => {
    const theDate = new Date(2019, 2, 12, 9, 0);
    const theTimestamp = 'test timestamp';
    const theToolData: ToolData = { applicationProperties: { name: 'some app' } } as ToolData;
    const thePageTitle = 'command-bar-test-tab-title';
    const theDescription = 'test description';
    const theGeneratorOutput = 'generator output';
    const thePageUrl = 'test page url';

    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let featureFlagStoreData: FeatureFlagStoreData;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let assessmentStoreData: AssessmentStoreData;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let visualizationScanResultData: VisualizationScanResultData;
    let visualizationStoreData: VisualizationStoreData;
    let cardsViewData: CardsViewModel;
    let scanResult: ScanResults;
    let targetAppInfo: TargetAppData;
    let scanMetadata: ScanMetadata;
    let deps: DetailsViewCommandBarDeps;

    beforeEach(() => {
        featureFlagStoreData = {};
        detailsViewActionMessageCreatorMock = Mock.ofType(
            DetailsViewActionMessageCreator,
            // MockBehavior.Strict,
        );
        assessmentStoreData = {
            resultDescription: theDescription,
        } as AssessmentStoreData;
        targetAppInfo = {
            name: thePageTitle,
            url: thePageUrl,
        };
        scanMetadata = {
            timestamp: theTimestamp,
            toolData: theToolData,
            targetAppInfo: targetAppInfo,
        } as ScanMetadata;
        assessmentsProviderMock = Mock.ofType<AssessmentsProvider>(undefined, MockBehavior.Loose);
        reportGeneratorMock = Mock.ofType<ReportGenerator>(undefined, MockBehavior.Loose);
        cardsViewData = null;
        scanResult = null;
        visualizationStoreData = {} as VisualizationStoreData;
        deps = {
            detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            getCurrentDate: () => theDate,
            reportGenerator: reportGeneratorMock.object,
            getDateFromTimestamp: value => theDate,
        } as DetailsViewCommandBarDeps;
    });

    function getProps(): DetailsViewCommandBarProps {
        visualizationScanResultData = {
            issues: {
                scanResult: scanResult,
            },
        } as VisualizationScanResultData;

        return {
            deps,
            featureFlagStoreData,
            assessmentStoreData,
            assessmentsProvider: assessmentsProviderMock.object,
            visualizationScanResultData,
            visualizationStoreData,
            cardsViewData,
            scanMetadata,
        } as DetailsViewCommandBarProps;
    }

    function setAssessmentReportGenerator(): void {
        reportGeneratorMock
            .setup(reportGenerator =>
                reportGenerator.generateAssessmentReport(
                    assessmentStoreData,
                    assessmentsProviderMock.object,
                    featureFlagStoreData,
                    targetAppInfo,
                    theDescription,
                ),
            )
            .returns(() => theGeneratorOutput)
            .verifiable(Times.once());
    }

    function setAutomatedChecksReportGenerator(): void {
        reportGeneratorMock
            .setup(reportGenerator =>
                reportGenerator.generateFastPassAutomatedChecksReport(
                    theDate,
                    cardsViewData,
                    theDescription,
                    scanMetadata,
                ),
            )
            .returns(() => theGeneratorOutput)
            .verifiable(Times.once());
    }

    function setSelectedFastPassDetailsView(test: VisualizationType): void {
        visualizationStoreData = {
            selectedFastPassDetailsView: test,
        } as VisualizationStoreData;
    }

    function setScanResults(): void {
        scanResult = {} as ScanResults;
    }

    describe('getReportExportPropsForAssessment', () => {
        test('expected properties are set', () => {
            const props = getProps();
            const expectedProps = {
                deps,
                reportExportFormat: 'Assessment',
                pageTitle: thePageTitle,
                scanDate: theDate,
                featureFlagStoreData,
            };

            const reportExportProps = getReportExportPropsForAssessment(props);

            expect(reportExportProps).toBeDefined();
            expect(reportExportProps).toMatchObject(expectedProps);
        });

        test('htmlGenerator calls reportGenerator', () => {
            setAssessmentReportGenerator();
            const props = getProps();

            const reportExportProps = getReportExportPropsForAssessment(props);

            reportExportProps.htmlGenerator(theDescription);

            reportGeneratorMock.verifyAll();
        });

        test('updatePersistedDescription sends addResultDescription message', () => {
            const updatedDescription = 'updated description';
            detailsViewActionMessageCreatorMock
                .setup(d => d.addResultDescription(updatedDescription))
                .verifiable(Times.once());
            const props = getProps();

            const reportExportProps = getReportExportPropsForAssessment(props);

            reportExportProps.updatePersistedDescription(updatedDescription);

            detailsViewActionMessageCreatorMock.verifyAll();
        });

        test('getExportDescription returns description', () => {
            const props = getProps();

            const reportExportProps = getReportExportPropsForAssessment(props);

            const exportDescription = reportExportProps.getExportDescription();
            expect(exportDescription).toEqual(theDescription);
        });
    });

    describe('getReportExportPropsForFastPass', () => {
        test('scanResults is null, props is null', () => {
            const props = getProps();
            const reportExportProps = getReportExportPropsForFastPass(props);

            expect(reportExportProps).toBeNull();
        });

        test('scanResults is not null, test is Tabstop, props is null', () => {
            setScanResults();
            setSelectedFastPassDetailsView(VisualizationType.TabStops);
            const props = getProps();

            const reportExportProps = getReportExportPropsForFastPass(props);

            expect(reportExportProps).toBeNull();
        });

        test('scanResults is not null, test is Issues, properties are set', () => {
            cardsViewData = {} as CardsViewModel;
            setScanResults();
            setSelectedFastPassDetailsView(VisualizationType.Issues);
            const props = getProps();
            const expectedProps = {
                deps,
                reportExportFormat: 'AutomatedChecks',
                pageTitle: thePageTitle,
                scanDate: theDate,
                featureFlagStoreData,
            };

            const reportExportProps = getReportExportPropsForFastPass(props);

            expect(reportExportProps).toMatchObject(expectedProps);
        });

        test('htmlGenerator calls reportGenerator', () => {
            cardsViewData = {} as CardsViewModel;
            setScanResults();
            setSelectedFastPassDetailsView(VisualizationType.Issues);
            setAutomatedChecksReportGenerator();
            const props = getProps();

            const reportExportProps = getReportExportPropsForFastPass(props);
            reportExportProps.htmlGenerator(theDescription);

            reportGeneratorMock.verifyAll();
        });

        test('updatePersistedDescription returns null', () => {
            cardsViewData = {} as CardsViewModel;
            setScanResults();
            setSelectedFastPassDetailsView(VisualizationType.Issues);
            setAutomatedChecksReportGenerator();
            const props = getProps();

            const reportExportProps = getReportExportPropsForFastPass(props);

            expect(reportExportProps.updatePersistedDescription('test string')).toBeNull();
        });

        test('getExportDescription returns empty string', () => {
            cardsViewData = {} as CardsViewModel;
            setScanResults();
            setSelectedFastPassDetailsView(VisualizationType.Issues);
            setAutomatedChecksReportGenerator();
            const props = getProps();
            const expectedDescription = '';

            const reportExportProps = getReportExportPropsForFastPass(props);

            expect(reportExportProps.getExportDescription()).toEqual(expectedDescription);
        });
    });
});
