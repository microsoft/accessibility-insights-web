// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from 'common/types/visualization-type';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { ExportDialogWithLocalStateProps } from 'DetailsView/components/export-dialog-with-local-state';

export type ReportExportProps = Omit<
    ExportDialogWithLocalStateProps,
    'isOpen' | 'dismissExportDialog'
>;

export function getReportExportPropsForAssessment(props: CommandBarProps): ReportExportProps {
    const {
        deps,
        assessmentStoreData,
        assessmentsProvider,
        featureFlagStoreData,
        scanMetadata,
    } = props;
    const reportGenerator = deps.reportGenerator;
    return {
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
    };
}

export function getReportExportPropsForFastPass(props: CommandBarProps): ReportExportProps {
    const scanResult = props.visualizationScanResultData.issues.scanResult;

    if (!scanResult) {
        return null;
    }

    const selectedTest = props.visualizationStoreData.selectedFastPassDetailsView;

    if (selectedTest !== VisualizationType.Issues) {
        return null;
    }

    const { deps } = props;
    const scanDate = deps.getDateFromTimestamp(props.scanMetadata.timestamp);
    const reportGenerator = deps.reportGenerator;

    return {
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
    };
}
