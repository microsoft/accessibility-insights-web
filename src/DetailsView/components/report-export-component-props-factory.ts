// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlags } from 'common/feature-flags';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { ReportExportComponentProps } from 'DetailsView/components/report-export-component';

export function getReportExportComponentPropsForAssessment(props: CommandBarProps): ReportExportComponentProps {
    const { deps, assessmentStoreData, assessmentsProvider, featureFlagStoreData, tabStoreData } = props;
    const reportGenerator = deps.reportGenerator;
    const htmlGenerator = reportGenerator.generateAssessmentReport.bind(
        reportGenerator,
        assessmentStoreData,
        assessmentsProvider,
        featureFlagStoreData,
        tabStoreData,
    );

    return {
        deps: deps,
        exportResultsType: 'Assessment',
        reportGenerator: reportGenerator,
        pageTitle: tabStoreData.title,
        scanDate: deps.getCurrentDate(),
        htmlGenerator: htmlGenerator,
        updatePersistedDescription: value => props.actionMessageCreator.addResultDescription(value),
        getExportDescription: () => props.assessmentStoreData.resultDescription,
    };
}

export function getReportExportComponentPropsForAutomatedChecks(props: CommandBarProps): ReportExportComponentProps {
    let reportExportComponentProps: ReportExportComponentProps = null;

    if (props.featureFlagStoreData[FeatureFlags.universalCardsUI]) {
        const { deps, visualizationScanResultData, tabStoreData } = props;
        const scanResult = visualizationScanResultData.issues.scanResult;

        if (scanResult != null) {
            const scanDate = deps.getDateFromTimestamp(scanResult.timestamp);
            const reportGenerator = deps.reportGenerator;

            reportExportComponentProps = {
                deps: deps,
                scanDate: scanDate,
                reportGenerator: reportGenerator,
                pageTitle: tabStoreData.title,
                exportResultsType: 'AutomatedChecks',
                htmlGenerator: reportGenerator.generateFastPassAutomateChecksReport.bind(
                    reportGenerator,
                    scanResult,
                    scanDate,
                    tabStoreData.title,
                    tabStoreData.url,
                    props.ruleResultsByStatus,
                ),
                updatePersistedDescription: () => null,
                getExportDescription: () => '',
            };
        }
    }

    return reportExportComponentProps;
}
