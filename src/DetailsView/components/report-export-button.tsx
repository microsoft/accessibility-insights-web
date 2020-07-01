// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { ReportExportFormat } from 'common/extension-telemetry-events';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';

import { NamedFC } from 'common/react/named-fc';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';

export type ReportExportButtonDeps = {
    reportGenerator: ReportGenerator;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface ReportExportButtonProps {
    deps: ReportExportButtonDeps;
    reportExportFormat: ReportExportFormat;
    pageTitle: string;
    scanDate: Date;
    htmlGenerator: (descriptionPlaceholder: string) => string;
    getExportDescription: () => string;
}

export const ReportExportButton = NamedFC<ReportExportButtonProps>('ReportExportButton', props => {
    const generateReportName = () => {
        const { reportExportFormat, scanDate, pageTitle } = props;
        return props.deps.reportGenerator.generateName(reportExportFormat, scanDate, pageTitle);
    };

    const onExportButtonClick = () => {
        const exportName = generateReportName();
        const exportDescription = props.getExportDescription();
        const exportData = props.htmlGenerator(exportDescription);
        props.deps.detailsViewActionMessageCreator.showReportExportDialog(
            exportName,
            exportDescription,
            exportData,
        );
    };

    return (
        <InsightsCommandButton iconProps={{ iconName: 'Export' }} onClick={onExportButtonClick}>
            Export result
        </InsightsCommandButton>
    );
});
