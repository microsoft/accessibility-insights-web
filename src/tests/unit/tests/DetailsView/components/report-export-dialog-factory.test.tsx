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
    let assessmentStoreData: AssessmentStoreData;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let cardsViewData: CardsViewModel;
    let targetAppInfo: TargetAppData;
    let scanMetadata: ScanMetadata;
    let deps: DetailsViewCommandBarDeps;
    let dismissExportDialogMock: IMock<() => void>;
    let shouldShowReportExportButtonMock: IMock<ShouldShowReportExportButton>;
    let afterDialogDismissedMock: IMock<() => void>;
    let props: ReportExportDialogFactoryProps;
    let shouldShowReportExportButtonProps: ShouldShowReportExportButtonProps;

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
            timespan: { scanComplete: scanCompleteDate },
            toolData: theToolData,
            targetAppInfo: targetAppInfo,
        } as ScanMetadata;
        assessmentsProviderMock = Mock.ofType<AssessmentsProvider>(undefined, MockBehavior.Loose);
        reportGeneratorMock = Mock.ofType(ReportGenerator, MockBehavior.Loose);
        dismissExportDialogMock = Mock.ofInstance(() => null);
        afterDialogDismissedMock = Mock.ofInstance(() => null);
        shouldShowReportExportButtonMock = Mock.ofInstance(() => true);
        cardsViewData = null;
        deps = {
            detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            getCurrentDate: () => currentDate,
            reportGenerator: reportGeneratorMock.object,
            getDateFromTimestamp: value => scanCompleteDate,
        } as DetailsViewCommandBarDeps;
        const switcherNavConfiguration = {
            shouldShowReportExportButton: shouldShowReportExportButtonMock.object,
        } as DetailsViewSwitcherNavConfiguration;

        props = {
            deps,
            featureFlagStoreData,
            assessmentStoreData,
            assessmentsProvider: assessmentsProviderMock.object,
            cardsViewData,
            scanMetadata,
            switcherNavConfiguration,
            isOpen,
            dismissExportDialog: dismissExportDialogMock.object,
            afterDialogDismissed: afterDialogDismissedMock.object,
        } as ReportExportDialogFactoryProps;

        shouldShowReportExportButtonProps = {
            visualizationConfigurationFactory: props.visualizationConfigurationFactory,
            selectedTest: props.selectedTest,
            unifiedScanResultStoreData: props.unifiedScanResultStoreData,
            visualizationStoreData: props.visualizationStoreData,
        } as ShouldShowReportExportButtonProps;
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

    function setupShouldShowReportExportButton(showReportExportButton: boolean): void {
        shouldShowReportExportButtonMock
            .setup(s => s(shouldShowReportExportButtonProps))
            .returns(() => showReportExportButton);
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
        test('renders as null when shouldShowReportExportButton returns falls', () => {
            setupShouldShowReportExportButton(false);
            const dialog = getReportExportDialogForFastPass(props);

            expect(dialog).toBeNull();
        });

        test('expected properties are set', () => {
            setupShouldShowReportExportButton(true);
            const dialog = getReportExportDialogForFastPass(props);
            expect(dialog).toMatchSnapshot();
        });

        test('htmlGenerator calls reportGenerator', () => {
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
    });
});
