// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlags } from 'common/feature-flags';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { ReportExportComponentProps } from 'DetailsView/components/report-export-component';

export function getReportExportComponentPropsForAssessment(props: CommandBarProps): ReportExportComponentProps {
    const { deps, assessmentStoreData, assessmentsProvider, featureFlagStoreData, tabStoreData } = props;
    const reportGenerator = deps.reportGenerator;

    return {
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
        }
    }

    return reportExportComponentProps;
}
