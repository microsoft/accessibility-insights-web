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
        tabStoreData,
    } = props;
    const reportGenerator = deps.reportGenerator;
    const reportExportComponentProps: ReportExportComponentProps = {
        deps: deps,
        exportResultsType: 'Assessment',
        pageTitle: tabStoreData.title,
        scanDate: deps.getCurrentDate(),
        htmlGenerator: description =>
            reportGenerator.generateAssessmentReport(
                assessmentStoreData,
                assessmentsProvider,
                featureFlagStoreData,
                tabStoreData,
                description,
            ),
        updatePersistedDescription: value =>
            props.deps.detailsViewActionMessageCreator.addResultDescription(value),
        getExportDescription: () => props.assessmentStoreData.resultDescription,
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

    const { deps, tabStoreData } = props;
    const scanDate = deps.getDateFromTimestamp(props.scanMetaData.timestamp);
    const reportGenerator = deps.reportGenerator;

    const reportExportComponentProps: ReportExportComponentProps = {
        deps: deps,
        scanDate: scanDate,
        pageTitle: tabStoreData.title,
        exportResultsType: 'AutomatedChecks',
        htmlGenerator: description =>
            reportGenerator.generateFastPassAutomatedChecksReport(
                scanDate,
                tabStoreData.title,
                tabStoreData.url,
                props.cardsViewData,
                description,
                props.scanMetaData.toolData,
            ),
        updatePersistedDescription: () => null,
        getExportDescription: () => '',
    };

    return <ReportExportComponent {...reportExportComponentProps} />;
}
