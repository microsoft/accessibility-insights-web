// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlags } from 'common/feature-flags';
import { VisualizationType } from 'common/types/visualization-type';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { ReportExportComponent, ReportExportComponentProps } from 'DetailsView/components/report-export-component';
import * as React from 'react';

export function getReportExportComponentForAssessment(props: CommandBarProps): JSX.Element {
    const { deps, assessmentStoreData, assessmentsProvider, featureFlagStoreData, tabStoreData } = props;
    const reportGenerator = deps.reportGenerator;
    const reportExportComponentProps: ReportExportComponentProps = {
        deps: deps,
        exportResultsType: 'Assessment',
        reportGenerator: reportGenerator,
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
        updatePersistedDescription: value => props.actionMessageCreator.addResultDescription(value),
        getExportDescription: () => props.assessmentStoreData.resultDescription,
    };

    return <ReportExportComponent {...reportExportComponentProps} />;
}

export function getReportExportComponentForFastPass(props: CommandBarProps): JSX.Element {
    if (!props.featureFlagStoreData[FeatureFlags.universalCardsUI]) {
        return null;
    }

    const scanResult = props.visualizationScanResultData.issues.scanResult;

    if (!scanResult) {
        return null;
    }

    const selectedTest = props.visualizationStoreData.selectedFastPassDetailsView;

    if (selectedTest !== VisualizationType.Issues) {
        return null;
    }

    const { deps, tabStoreData } = props;
    const scanDate = deps.getDateFromTimestamp(scanResult.timestamp);
    const reportGenerator = deps.reportGenerator;

    const reportExportComponentProps: ReportExportComponentProps = {
        deps: deps,
        scanDate: scanDate,
        reportGenerator: reportGenerator,
        pageTitle: tabStoreData.title,
        exportResultsType: 'AutomatedChecks',
        htmlGenerator: description =>
            reportGenerator.generateFastPassAutomateChecksReport(
                scanResult,
                scanDate,
                tabStoreData.title,
                tabStoreData.url,
                props.cardsViewData,
                description,
            ),
        updatePersistedDescription: () => null,
        getExportDescription: () => '',
    };

    return <ReportExportComponent {...reportExportComponentProps} />;
}
