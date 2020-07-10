// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export interface ReportExportButtonProps {
    isHidden: boolean;
    showReportExportDialog: () => void;
}

export const ReportExportButton = NamedFC<ReportExportButtonProps>('ReportExportButton', props => {
    if (props.isHidden === true) {
        return null;
    }

    return (
        <InsightsCommandButton
            iconProps={{ iconName: 'Export' }}
            onClick={props.showReportExportDialog}
        >
            Export result
        </InsightsCommandButton>
    );
});
