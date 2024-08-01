// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { FluentUIV9Icon } from 'common/icons/fluentui-v9-icons';
import { NamedFC } from 'common/react/named-fc';
import { useCommandButtonStyle } from 'DetailsView/components/command-button-styles';
import * as React from 'react';

export interface ReportExportButtonProps {
    showReportExportDialog: () => void;
    buttonRef?: React.RefObject<HTMLButtonElement>;
}

export const reportExportButtonAutomationId = 'report-export-button';

export const ReportExportButton = NamedFC<ReportExportButtonProps>('ReportExportButton', props => {
    const exportButtonStyles = useCommandButtonStyle();

    return (
        <InsightsCommandButton
            insightsCommandButtonIconProps={{
                icon: <FluentUIV9Icon iconName="ArrowExportRegular" />,
            }}
            onClick={props.showReportExportDialog}
            ref={props.buttonRef}
            data-automation-id={reportExportButtonAutomationId}
            className={exportButtonStyles.assessmentButton}
        >
            Export result
        </InsightsCommandButton>
    );
});
