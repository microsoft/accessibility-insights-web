// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IButton, IRefObject } from '@fluentui/react';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export interface ReportExportButtonProps {
    showReportExportDialog: () => void;
    buttonRef?: IRefObject<IButton>;
    iconComponent: any;
}

export const reportExportButtonAutomationId = 'report-export-button';

export const ReportExportButton = NamedFC<ReportExportButtonProps>('ReportExportButton', props => {
    return (
        <InsightsCommandButton
            iconName="ArrowExportRegular"
            onClick={props.showReportExportDialog}
            text="Export Result"
            componentRef={props.buttonRef}
            data-automation-id={reportExportButtonAutomationId}
        />
    );
});
