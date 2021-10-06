// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import {
    ExportDialogWithLocalState,
    ExportDialogWithLocalStateProps,
} from 'DetailsView/components/export-dialog-with-local-state';
import { ShouldShowReportExportButtonProps } from 'DetailsView/components/should-show-report-export-button';
import * as React from 'react';
import { ReportExportServiceProvider } from 'report-export/report-export-service-provider';

export type ReportExportDialogFactoryDeps = {
    reportExportServiceProvider: ReportExportServiceProvider;
};

export type ReportExportDialogFactoryProps = CommandBarProps & {
    isOpen: boolean;
    dismissExportDialog: () => void;
    afterDialogDismissed: () => void;
    featureFlagStoreData?: FeatureFlagStoreData;
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
    const dialogProps: ExportDialogWithLocalStateProps = {
        deps: deps,
        reportExportFormat: 'Assessment',
        pageTitle: scanMetadata.targetAppInfo.name,
        scanDate: props.deps.getCurrentDate(),
        htmlGenerator: description =>
            reportGenerator.generateAssessmentHTMLReport(
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
    };
    return <ExportDialogWithLocalState {...dialogProps} />;
}

export function getReportExportDialogForFastPass(
    props: ReportExportDialogFactoryProps,
): JSX.Element {
    const shouldShowReportExportButtonProps: ShouldShowReportExportButtonProps = {
        visualizationConfigurationFactory: props.visualizationConfigurationFactory,
        selectedTest: props.selectedTest,
        unifiedScanResultStoreData: props.unifiedScanResultStoreData,
        visualizationStoreData: props.visualizationStoreData,
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

    const dialogProps: ExportDialogWithLocalStateProps = {
        deps: deps,
        pageTitle: props.scanMetadata.targetAppInfo.name,
        scanDate: props.scanMetadata.timespan.scanComplete,
        reportExportFormat: 'AutomatedChecks',
        htmlGenerator: description =>
            reportGenerator.generateFastPassAutomatedChecksReport(
                props.cardsViewData,
                description,
                props.scanMetadata,
            ),
        jsonGenerator: () => null,
        updatePersistedDescription: () => null,
        getExportDescription: () => '',
        featureFlagStoreData: props.featureFlagStoreData,
        isOpen,
        dismissExportDialog,
        afterDialogDismissed,
        reportExportServices: deps.reportExportServiceProvider.servicesForFastPass(),
    };

    return <ExportDialogWithLocalState {...dialogProps} />;
}
