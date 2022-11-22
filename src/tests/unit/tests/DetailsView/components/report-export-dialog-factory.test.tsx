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
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { DetailsViewCommandBarDeps } from 'DetailsView/components/details-view-command-bar';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import {
    getReportExportDialogForAssessment,
    getReportExportDialogForFastPass,
    ReportExportDialogFactoryProps,
} from 'DetailsView/components/report-export-dialog-factory';
import {
    ShouldShowReportExportButton,
    ShouldShowReportExportButtonProps,
} from 'DetailsView/components/should-show-report-export-button';
import { ReportExportServiceProvider } from 'report-export/report-export-service-provider';
import { ReportGenerator } from 'reports/report-generator';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('ReportExportDialogFactory', () => {
    const scanCompleteDate = new Date(Date.UTC(2019, 2, 12, 9, 0));
    const currentDate = new Date(Date.UTC(2021, 1, 7, 5, 2));
    const theToolData: ToolData = { applicationProperties: { name: 'some app' } } as ToolData;
    const thePageTitle = 'command-bar-test-tab-title';
    const theDescription = 'test description';
    const theGeneratorOutput = 'generator output';
    const thePageUrl = 'test page url';
    const isOpen: boolean = true;

    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let featureFlagStoreData: FeatureFlagStoreData;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let assessmentActionMessageCreatorMock: IMock<AssessmentActionMessageCreator>;
    let assessmentStoreData: AssessmentStoreData;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let cardsViewData: CardsViewModel;
    let tabStopRequirementData: TabStopRequirementState;
    let targetAppInfo: TargetAppData;
    let scanMetadata: ScanMetadata;
    let deps: DetailsViewCommandBarDeps;
    let dismissExportDialogMock: IMock<() => void>;
    let shouldShowReportExportButtonMock: IMock<ShouldShowReportExportButton>;
    let afterDialogDismissedMock: IMock<() => void>;
    let props: ReportExportDialogFactoryProps;
    let shouldShowReportExportButtonProps: ShouldShowReportExportButtonProps;
    let reportExportServiceProviderMock: IMock<ReportExportServiceProvider>;

    beforeEach(() => {
        featureFlagStoreData = {};
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        assessmentActionMessageCreatorMock = Mock.ofType(AssessmentActionMessageCreator);
        assessmentStoreData = {
            resultDescription: theDescription,
        } as AssessmentStoreData;
        targetAppInfo = {
            name: thePageTitle,
            url: thePageUrl,
        };
        scanMetadata = {
            timespan: { scanComplete: scanCompleteDate },
            toolData: theToolData,
            targetAppInfo: targetAppInfo,
        } as ScanMetadata;
        assessmentsProviderMock = Mock.ofType<AssessmentsProvider>(undefined, MockBehavior.Loose);
        reportGeneratorMock = Mock.ofType(ReportGenerator, MockBehavior.Loose);
        reportExportServiceProviderMock = Mock.ofType(ReportExportServiceProvider);
        dismissExportDialogMock = Mock.ofInstance(() => null);
        afterDialogDismissedMock = Mock.ofInstance(() => null);
        shouldShowReportExportButtonMock = Mock.ofInstance(() => true);
        cardsViewData = null;
        tabStopRequirementData = null;
        deps = {
            detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            assessmentActionMessageCreator: assessmentActionMessageCreatorMock.object,
            getCurrentDate: () => currentDate,
            reportGenerator: reportGeneratorMock.object,
            getDateFromTimestamp: value => scanCompleteDate,
            reportExportServiceProvider: reportExportServiceProviderMock.object,
        } as DetailsViewCommandBarDeps;
        const switcherNavConfiguration = {
            shouldShowReportExportButton: shouldShowReportExportButtonMock.object,
        } as DetailsViewSwitcherNavConfiguration;

        props = {
            deps,
            featureFlagStoreData,
            assessmentStoreData,
            assessmentsProvider: assessmentsProviderMock.object,
            automatedChecksCardsViewData: cardsViewData,
            needsReviewCardsViewData: cardsViewData,
            tabStopRequirementData,
            scanMetadata,
            switcherNavConfiguration,
            isOpen,
            dismissExportDialog: dismissExportDialogMock.object,
            afterDialogDismissed: afterDialogDismissedMock.object,
        } as ReportExportDialogFactoryProps;

        shouldShowReportExportButtonProps = {
            visualizationConfigurationFactory: props.visualizationConfigurationFactory,
            selectedTest: props.selectedTest,
            tabStoreData: props.tabStoreData,
        } as ShouldShowReportExportButtonProps;
    });

    function setFastPassReportGenerator(): void {
        reportGeneratorMock
            .setup(reportGenerator =>
                reportGenerator.generateFastPassHtmlReport({
                    description: theDescription,
                    targetPage: scanMetadata.targetAppInfo,
                    results: {
                        automatedChecks: cardsViewData,
                        tabStops: tabStopRequirementData,
                    },
                }),
            )
            .returns(() => theGeneratorOutput)
            .verifiable(Times.once());
    }

    function setAssessmentReportGenerator(): void {
        reportGeneratorMock
            .setup(reportGenerator =>
                reportGenerator.generateAssessmentHtmlReport(
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

    function setReportExportServiceProviderForAssessment(): void {
        reportExportServiceProviderMock
            .setup(r => r.servicesForAssessment())
            .returns(() => [
                { key: 'html', generateMenuItem: null },
                { key: 'json', generateMenuItem: null },
                { key: 'codepen', generateMenuItem: null },
            ])
            .verifiable(Times.once());
    }

    function setReportExportServiceProviderForFastPass(): void {
        reportExportServiceProviderMock
            .setup(r => r.servicesForFastPass())
            .returns(() => [
                { key: 'html', generateMenuItem: null },
                { key: 'codepen', generateMenuItem: null },
            ])
            .verifiable(Times.once());
    }

    function setupShouldShowReportExportButton(showReportExportButton: boolean): void {
        shouldShowReportExportButtonMock
            .setup(s => s(shouldShowReportExportButtonProps))
            .returns(() => showReportExportButton);
    }

    describe('getReportExportDialogForAssessment', () => {
        test('expected properties are set', () => {
            setReportExportServiceProviderForAssessment();
            const dialog = getReportExportDialogForAssessment(props);

            expect(dialog).toMatchSnapshot();

            reportGeneratorMock.verifyAll();
            detailsViewActionMessageCreatorMock.verifyAll();
            reportExportServiceProviderMock.verifyAll();
        });

        test('htmlGenerator calls reportGenerator', () => {
            setAssessmentReportGenerator();

            const dialog = getReportExportDialogForAssessment(props);

            dialog.props.htmlGenerator(theDescription);

            reportGeneratorMock.verifyAll();
        });

        test('updatePersistedDescription sends addResultDescription message', () => {
            const updatedDescription = 'updated description';
            assessmentActionMessageCreatorMock
                .setup(d => d.addResultDescription(updatedDescription))
                .verifiable(Times.once());

            const dialog = getReportExportDialogForAssessment(props);

            dialog.props.updatePersistedDescription(updatedDescription);

            assessmentActionMessageCreatorMock.verifyAll();
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

        test('exportResultsClickedTelemetry sends exportResultsClicked message', () => {
            const reportExportFormat = 'Assessment';
            const selectedServiceKey = 'html';

            detailsViewActionMessageCreatorMock
                .setup(d => d.exportResultsClicked(reportExportFormat, selectedServiceKey, null))
                .verifiable(Times.once());

            const dialog = getReportExportDialogForAssessment(props);

            dialog.props.exportResultsClickedTelemetry(
                reportExportFormat,
                selectedServiceKey,
                null,
            );

            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });

    describe('getReportExportDialogForFastPass', () => {
        test('renders as null when shouldShowReportExportButton returns falls', () => {
            setupShouldShowReportExportButton(false);
            const dialog = getReportExportDialogForFastPass(props);

            expect(dialog).toBeNull();
        });

        test('expected properties are set', () => {
            setReportExportServiceProviderForFastPass();
            setupShouldShowReportExportButton(true);

            const dialog = getReportExportDialogForFastPass(props);

            expect(dialog).toMatchSnapshot();
            reportExportServiceProviderMock.verifyAll();
        });

        test('htmlGenerator calls reportGenerator', () => {
            setFastPassReportGenerator();
            setupShouldShowReportExportButton(true);
            const dialog = getReportExportDialogForFastPass(props);

            dialog.props.htmlGenerator(theDescription);

            reportGeneratorMock.verifyAll();
        });

        test('updatePersistedDescription returns null', () => {
            setupShouldShowReportExportButton(true);
            const dialog = getReportExportDialogForFastPass(props);

            expect(dialog.props.updatePersistedDescription('test string')).toBeNull();
        });

        test('getExportDescription returns empty string', () => {
            setupShouldShowReportExportButton(true);
            const expectedDescription = '';

            const dialog = getReportExportDialogForFastPass(props);
            expect(dialog.props.getExportDescription()).toEqual(expectedDescription);
        });

        test('dismissExportDialog called', () => {
            setupShouldShowReportExportButton(true);

            const dialog = getReportExportDialogForFastPass(props);

            dialog.props.dismissExportDialog();

            dismissExportDialogMock.verify(d => d(), Times.once());
        });

        test('afterDialogDismissed called', () => {
            const dialog = getReportExportDialogForAssessment(props);

            dialog.props.afterDialogDismissed();

            afterDialogDismissedMock.verify(d => d(), Times.once());
        });

        test('exportResultsClickedTelemetry sends exportResultsClickedFastPass message', () => {
            setupShouldShowReportExportButton(true);

            const reportExportFormat = 'FastPass';
            const selectedServiceKey = 'html';

            detailsViewActionMessageCreatorMock
                .setup(d =>
                    d.exportResultsClickedFastPass(
                        props.tabStopRequirementData,
                        false,
                        reportExportFormat,
                        selectedServiceKey,
                        null,
                    ),
                )
                .verifiable(Times.once());

            const dialog = getReportExportDialogForFastPass(props);

            dialog.props.exportResultsClickedTelemetry(
                reportExportFormat,
                selectedServiceKey,
                null,
            );

            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });
});
