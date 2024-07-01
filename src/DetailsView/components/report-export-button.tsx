// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IButton, IRefObject } from '@fluentui/react';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { ArrowExportRegular } from '@fluentui/react-icons';
import { CommandButtonStyle } from 'DetailsView/components/command-button-styles';

export interface ReportExportButtonProps {
    showReportExportDialog: () => void;
    buttonRef?: IRefObject<IButton>;
}

export const reportExportButtonAutomationId = 'report-export-button';

export const ReportExportButton = NamedFC<ReportExportButtonProps>('ReportExportButton', props => {
    const exportButtonStyles = CommandButtonStyle();

    return (
        <InsightsCommandButton
            insightsCommandButtonIconProps={{ icon: <ArrowExportRegular /> }}
            onClick={props.showReportExportDialog}
            ref={props.buttonRef}
            data-automation-id={reportExportButtonAutomationId}
            className={exportButtonStyles.assessmentButton}
        >Export Result</InsightsCommandButton>
    );
});
