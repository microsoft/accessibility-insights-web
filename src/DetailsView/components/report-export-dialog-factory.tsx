// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import {
    ExportDialogWithLocalState,
    ExportDialogWithLocalStateProps,
} from 'DetailsView/components/export-dialog-with-local-state';
import * as React from 'react';

export type ReportExportDialogFactoryProps = CommandBarProps & {
    isOpen: boolean;
    dismissExportDialog: () => void;
    afterDialogDismissed: () => void;
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
        scanDate: deps.getCurrentDate(),
        htmlGenerator: description =>
            reportGenerator.generateAssessmentReport(
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
    };
    return <ExportDialogWithLocalState {...dialogProps} />;
}

export function getReportExportDialogForFastPass(
    props: ReportExportDialogFactoryProps,
): JSX.Element {
    if (props.switcherNavConfiguration.shouldShowReportExportButton(props) !== true) {
        return null;
    }

    const { deps, isOpen, dismissExportDialog, afterDialogDismissed } = props;
    const scanDate = deps.getDateFromTimestamp(props.scanMetadata.timestamp);
    const reportGenerator = deps.reportGenerator;

    const dialogProps: ExportDialogWithLocalStateProps = {
        deps: deps,
        scanDate: scanDate,
        pageTitle: props.scanMetadata.targetAppInfo.name,
        reportExportFormat: 'AutomatedChecks',
        htmlGenerator: description =>
            reportGenerator.generateFastPassAutomatedChecksReport(
                scanDate,
                props.cardsViewData,
                description,
                props.scanMetadata,
            ),
        updatePersistedDescription: () => null,
        getExportDescription: () => '',
        featureFlagStoreData: props.featureFlagStoreData,
        isOpen,
        dismissExportDialog,
        afterDialogDismissed,
    };

    return <ExportDialogWithLocalState {...dialogProps} />;
}
