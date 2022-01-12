// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { NamedFC } from 'common/react/named-fc';
import { IButton, IRefObject } from '@fluentui/react';
import * as React from 'react';

export interface ReportExportButtonProps {
    showReportExportDialog: () => void;
    buttonRef?: IRefObject<IButton>;
}

export const reportExportButtonAutomationId = 'report-export-button';

export const ReportExportButton = NamedFC<ReportExportButtonProps>('ReportExportButton', props => {
    return (
        <InsightsCommandButton
            iconProps={{ iconName: 'Export' }}
            onClick={props.showReportExportDialog}
            componentRef={props.buttonRef}
            data-automation-id={reportExportButtonAutomationId}
        >
            Export result
        </InsightsCommandButton>
    );
});
