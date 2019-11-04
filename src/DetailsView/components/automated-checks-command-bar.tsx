// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { FeatureFlags } from 'common/feature-flags';
import { NamedFC } from 'common/react/named-fc';
import { ReportExportComponentProps } from 'DetailsView/components/report-export-component';
import { CommandBarProps } from './details-view-command-bar';
import { DetailsViewCommandBar } from './details-view-command-bar';

export const AutomatedChecksCommandBar = NamedFC<CommandBarProps>('AutomatedChecksCommandBar', props => {
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

    return (
        <DetailsViewCommandBar
            reportExportComponentProps={reportExportComponentProps}
            renderStartOver={props.featureFlagStoreData[FeatureFlags.universalCardsUI]}
            {...props}
        />
    );
});
