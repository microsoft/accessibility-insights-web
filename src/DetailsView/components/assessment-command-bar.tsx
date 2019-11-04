// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { ReportExportComponentProps } from 'DetailsView/components/report-export-component';
import { CommandBarProps } from './details-view-command-bar';
import { DetailsViewCommandBar } from './details-view-command-bar';

export const AssessmentCommandBar = NamedFC<CommandBarProps>('AssessmentCommandBar', props => {
    const { deps, assessmentStoreData, assessmentsProvider, featureFlagStoreData, tabStoreData } = props;
    const reportGenerator = deps.reportGenerator;
    const htmlGenerator = reportGenerator.generateAssessmentReport.bind(
        reportGenerator,
        assessmentStoreData,
        assessmentsProvider,
        featureFlagStoreData,
        tabStoreData,
    );

    const reportExportComponentProps: ReportExportComponentProps = {
        deps: deps,
        exportResultsType: 'Assessment',
        reportGenerator: reportGenerator,
        pageTitle: tabStoreData.title,
        scanDate: deps.getCurrentDate(),
        htmlGenerator: htmlGenerator,
        updatePersistedDescription: value => props.actionMessageCreator.addResultDescription(value),
        getExportDescription: () => props.assessmentStoreData.resultDescription,
    };

    return <DetailsViewCommandBar reportExportComponentProps={reportExportComponentProps} renderStartOver={true} {...props} />;
});
