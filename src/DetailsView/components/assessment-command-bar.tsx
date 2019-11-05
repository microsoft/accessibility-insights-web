// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { ReportExportComponentProps } from 'DetailsView/components/report-export-component';
import { getReportExportComponentPropsForAssessment } from 'DetailsView/components/report-export-component-props-factory';
import { CommandBarProps } from './details-view-command-bar';
import { DetailsViewCommandBar } from './details-view-command-bar';

export const AssessmentCommandBar = NamedFC<CommandBarProps>('AssessmentCommandBar', props => {
    const reportExportComponentProps: ReportExportComponentProps = getReportExportComponentPropsForAssessment(props);
    return <DetailsViewCommandBar reportExportComponentProps={reportExportComponentProps} renderStartOver={true} {...props} />;
});
