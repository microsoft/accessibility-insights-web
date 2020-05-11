// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from 'common/types/visualization-type';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import {
    ReportExportComponent,
    ReportExportComponentProps,
} from 'DetailsView/components/report-export-component';
import * as React from 'react';

export function getReportExportComponentForAssessment(props: CommandBarProps): JSX.Element {
    const {
        deps,
        assessmentStoreData,
        assessmentsProvider,
        featureFlagStoreData,
        scanMetadata,
    } = props;
    const reportGenerator = deps.reportGenerator;
    const reportExportComponentProps: ReportExportComponentProps = {
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

    return <ReportExportComponent {...reportExportComponentProps} />;
}

export function getReportExportComponentForFastPass(props: CommandBarProps): JSX.Element {
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

    const reportExportComponentProps: ReportExportComponentProps = {
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

    return <ReportExportComponent {...reportExportComponentProps} />;
}
