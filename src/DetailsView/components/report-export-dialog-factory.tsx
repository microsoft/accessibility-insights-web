// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReportExportFormat } from 'common/extension-telemetry-events';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import {
    ReportExportComponent,
    ReportExportComponentDeps,
    ReportExportComponentProps,
} from 'DetailsView/components/report-export-component';
import { ShouldShowReportExportButtonProps } from 'DetailsView/components/should-show-report-export-button';
import * as React from 'react';
import { ReportExportServiceProvider } from 'report-export/report-export-service-provider';
import { ReportExportServiceKey } from 'report-export/types/report-export-service';
import { FastPassReportModel } from 'reports/fast-pass-report-html-generator';

export type ReportExportDialogFactoryDeps = {
    reportExportServiceProvider: ReportExportServiceProvider;
} & ReportExportComponentDeps;

export type ReportExportDialogFactoryProps = CommandBarProps & {
    isOpen: boolean;
    dismissExportDialog: () => void;
    afterDialogDismissed: () => void;
    featureFlagStoreData?: FeatureFlagStoreData;
    tabStopRequirementData: TabStopRequirementState;
};

export function getReportExportDialogForAssessment(
    props: ReportExportDialogFactoryProps,
): JSX.Element {
    const {
        deps,
        assessmentStoreData,
        assessmentsProvider,
        featureFlagStoreData,
        scanMetadata,
        isOpen,
        dismissExportDialog,
        afterDialogDismissed,
    } = props;
    const reportGenerator = deps.reportGenerator;
    const dialogProps: ReportExportComponentProps = {
        deps: deps,
        reportExportFormat: 'Assessment',
        pageTitle: scanMetadata.targetAppInfo.name,
        scanDate: props.deps.getCurrentDate(),
        htmlGenerator: description =>
            reportGenerator.generateAssessmentHtmlReport(
                assessmentStoreData,
                assessmentsProvider,
                featureFlagStoreData,
                scanMetadata.targetAppInfo,
                description,
            ),
        jsonGenerator: description =>
            reportGenerator.generateAssessmentJsonExport(
                assessmentStoreData,
                assessmentsProvider,
                featureFlagStoreData,
                scanMetadata.targetAppInfo,
                description,
            ),
        updatePersistedDescription: value =>
            props.deps.detailsViewActionMessageCreator.addResultDescription(value),
        getExportDescription: () => props.assessmentStoreData.resultDescription,
        featureFlagStoreData: props.featureFlagStoreData,
        isOpen,
        dismissExportDialog,
        afterDialogDismissed,
        reportExportServices: deps.reportExportServiceProvider.servicesForAssessment(),
        exportResultsClickedTelemetry: (reportExportFormat, selectedServiceKey, event) =>
            deps.detailsViewActionMessageCreator.exportResultsClicked(
                reportExportFormat,
                selectedServiceKey,
                event,
            ),
    };
    return <ReportExportComponent {...dialogProps} />;
}

export function getReportExportDialogForMediumPass(props: ReportExportDialogFactoryProps): JSX.Element {
    return null;
}

export function getReportExportDialogForFastPass(
    props: ReportExportDialogFactoryProps,
): JSX.Element {
    const shouldShowReportExportButtonProps: ShouldShowReportExportButtonProps = {
        visualizationConfigurationFactory: props.visualizationConfigurationFactory,
        selectedTest: props.selectedTest,
        tabStoreData: props.tabStoreData,
    };

    if (
        props.switcherNavConfiguration.shouldShowReportExportButton(
            shouldShowReportExportButtonProps,
        ) !== true
    ) {
        return null;
    }

    const { deps, isOpen, dismissExportDialog, afterDialogDismissed } = props;

    const reportGenerator = deps.reportGenerator;
    const reportModelExceptDescription: Omit<FastPassReportModel, 'description'> = {
        results: {
            automatedChecks: props.automatedChecksCardsViewData,
            tabStops: props.tabStopRequirementData,
        },
        targetPage: props.scanMetadata.targetAppInfo,
    };
    const generateReportFromDescription = description =>
        reportGenerator.generateFastPassHtmlReport({
            ...reportModelExceptDescription,
            description,
        });

    const exportResultsClickedTelemetry = (
        reportExportFormat: ReportExportFormat,
        selectedServiceKey: ReportExportServiceKey,
        event: React.MouseEvent<HTMLElement>,
    ) => {
        deps.detailsViewActionMessageCreator.exportResultsClickedFastPass(
            props.tabStopRequirementData,
            props.automatedChecksCardsViewData !== null,
            reportExportFormat,
            selectedServiceKey,
            event,
        );
    };

    const dialogProps: ReportExportComponentProps = {
        deps: deps,
        pageTitle: props.scanMetadata.targetAppInfo.name,
        scanDate: props.scanMetadata.timespan.scanComplete,
        reportExportFormat: 'FastPass',
        htmlGenerator: generateReportFromDescription,
        jsonGenerator: () => null,
        updatePersistedDescription: () => null,
        getExportDescription: () => '',
        featureFlagStoreData: props.featureFlagStoreData,
        isOpen,
        dismissExportDialog,
        afterDialogDismissed,
        reportExportServices: deps.reportExportServiceProvider.servicesForFastPass(),
        exportResultsClickedTelemetry,
    };

    return <ReportExportComponent {...dialogProps} />;
}
