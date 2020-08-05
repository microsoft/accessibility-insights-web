// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import {
    ScanMetadata,
    TargetAppData,
    ToolData,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { ScanData, VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { DetailsViewCommandBarDeps } from 'DetailsView/components/details-view-command-bar';
import {
    getReportExportDialogForAssessment,
    getReportExportDialogForFastPass,
    ReportExportDialogFactoryProps,
} from 'DetailsView/components/report-export-dialog-factory';
import { ReportGenerator } from 'reports/report-generator';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('ReportExportDialogFactory', () => {
    const theDate = new Date(Date.UTC(2019, 2, 12, 9, 0));
    const theTimestamp = 'test timestamp';
    const theToolData: ToolData = { applicationProperties: { name: 'some app' } } as ToolData;
    const thePageTitle = 'command-bar-test-tab-title';
    const theDescription = 'test description';
    const theGeneratorOutput = 'generator output';
    const thePageUrl = 'test page url';
    const isOpen: boolean = true;
    const selectedTest = -1;
    const scanDataStub = {} as ScanData;
    const unifiedScanResultStoreData = {} as UnifiedScanResultStoreData;
    const visualizationStoreData = { tests: {} } as VisualizationStoreData;

    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let featureFlagStoreData: FeatureFlagStoreData;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let assessmentStoreData: AssessmentStoreData;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let cardsViewData: CardsViewModel;
    let targetAppInfo: TargetAppData;
    let scanMetadata: ScanMetadata;
    let deps: DetailsViewCommandBarDeps;
    let dismissExportDialogMock: IMock<() => void>;
    let afterDialogDismissedMock: IMock<() => void>;
    let props: ReportExportDialogFactoryProps;
    let visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    let visualizationConfigurationMock: IMock<VisualizationConfiguration>;

    beforeEach(() => {
        featureFlagStoreData = {};
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
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
        reportGeneratorMock = Mock.ofType(ReportGenerator, MockBehavior.Loose);
        dismissExportDialogMock = Mock.ofInstance(() => null);
        afterDialogDismissedMock = Mock.ofInstance(() => null);
        cardsViewData = null;
        deps = {
            detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            getCurrentDate: () => theDate,
            reportGenerator: reportGeneratorMock.object,
            getDateFromTimestamp: value => theDate,
        } as DetailsViewCommandBarDeps;
        visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        visualizationConfigurationMock = Mock.ofType<VisualizationConfiguration>();
        visualizationConfigurationFactoryMock
            .setup(m => m.getConfiguration(selectedTest))
            .returns(() => visualizationConfigurationMock.object);

        props = {
            deps,
            featureFlagStoreData,
            assessmentStoreData,
            assessmentsProvider: assessmentsProviderMock.object,
            cardsViewData,
            scanMetadata,
            isOpen,
            dismissExportDialog: dismissExportDialogMock.object,
            afterDialogDismissed: afterDialogDismissedMock.object,
            visualizationStoreData: visualizationStoreData,
            unifiedScanResultStoreData: unifiedScanResultStoreData,
            visualizationConfigurationFactory: visualizationConfigurationFactoryMock.object,
            selectedTest: selectedTest,
        } as ReportExportDialogFactoryProps;
    });

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

    function setupShouldShowReportExportButton(enabled: boolean, shouldShow: boolean): void {
        visualizationConfigurationMock
            .setup(m => m.getStoreData(visualizationStoreData.tests))
            .returns(() => scanDataStub);
        visualizationConfigurationMock
            .setup(m => m.getTestStatus(scanDataStub))
            .returns(() => enabled);
        visualizationConfigurationMock
            .setup(m => m.shouldShowExportReport(unifiedScanResultStoreData))
            .returns(() => shouldShow);
    }

    describe('getReportExportDialogForAssessment', () => {
        test('expected properties are set', () => {
            const dialog = getReportExportDialogForAssessment(props);

            expect(dialog).toMatchSnapshot();

            reportGeneratorMock.verifyAll();
            detailsViewActionMessageCreatorMock.verifyAll();
        });

        test('htmlGenerator calls reportGenerator', () => {
            setAssessmentReportGenerator();

            const dialog = getReportExportDialogForAssessment(props);

            dialog.props.htmlGenerator(theDescription);

            reportGeneratorMock.verifyAll();
        });

        test('updatePersistedDescription sends addResultDescription message', () => {
            const updatedDescription = 'updated description';
            detailsViewActionMessageCreatorMock
                .setup(d => d.addResultDescription(updatedDescription))
                .verifiable(Times.once());

            const dialog = getReportExportDialogForAssessment(props);

            dialog.props.updatePersistedDescription(updatedDescription);

            detailsViewActionMessageCreatorMock.verifyAll();
        });

        test('getExportDescription returns description', () => {
            const dialog = getReportExportDialogForAssessment(props);

            const exportDescription = dialog.props.getExportDescription();
            expect(exportDescription).toEqual(theDescription);
        });

        test('dismissExportDialog called', () => {
            const dialog = getReportExportDialogForAssessment(props);

            dialog.props.dismissExportDialog();

            dismissExportDialogMock.verify(d => d(), Times.once());
        });

        test('afterDialogDismissed called', () => {
            const dialog = getReportExportDialogForAssessment(props);

            dialog.props.afterDialogDismissed();

            afterDialogDismissedMock.verify(d => d(), Times.once());
        });
    });

    describe('getReportExportDialogForFastPass', () => {
        test.each`
            enabled  | shouldShow
            ${true}  | ${false}
            ${false} | ${true}
            ${false} | ${false}
        `(
            'renders as null when shouldShowReportExportButton returns false with test enabled = $enabled and shouldShowExportReport = $shouldShow',
            ({ enabled, shouldShow }) => {
                setupShouldShowReportExportButton(enabled, shouldShow);
                const dialog = getReportExportDialogForFastPass(props);

                expect(dialog).toBeNull();
            },
        );

        test('expected properties are set', () => {
            setupShouldShowReportExportButton(true, true);
            const dialog = getReportExportDialogForFastPass(props);
            expect(dialog).toMatchSnapshot();
        });

        test('htmlGenerator calls reportGenerator', () => {
            setupShouldShowReportExportButton(true, true);
            const dialog = getReportExportDialogForFastPass(props);

            dialog.props.htmlGenerator(theDescription);

            reportGeneratorMock.verifyAll();
        });

        test('updatePersistedDescription returns null', () => {
            setupShouldShowReportExportButton(true, true);
            const dialog = getReportExportDialogForFastPass(props);

            expect(dialog.props.updatePersistedDescription('test string')).toBeNull();
        });

        test('getExportDescription returns empty string', () => {
            setupShouldShowReportExportButton(true, true);
            const expectedDescription = '';

            const dialog = getReportExportDialogForFastPass(props);
            expect(dialog.props.getExportDescription()).toEqual(expectedDescription);
        });

        test('dismissExportDialog called', () => {
            setupShouldShowReportExportButton(true, true);

            const dialog = getReportExportDialogForFastPass(props);

            dialog.props.dismissExportDialog();

            dismissExportDialogMock.verify(d => d(), Times.once());
        });

        test('afterDialogDismissed called', () => {
            const dialog = getReportExportDialogForAssessment(props);

            dialog.props.afterDialogDismissed();

            afterDialogDismissedMock.verify(d => d(), Times.once());
        });
    });
});
