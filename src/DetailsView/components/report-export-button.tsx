// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { NamedFC } from 'common/react/named-fc';
import { IButton, IRefObject } from 'office-ui-fabric-react';
import * as React from 'react';

export interface ReportExportButtonProps {
    showReportExportDialog: () => void;
    buttonRef?: IRefObject<IButton>;
}

export const ReportExportButton = NamedFC<ReportExportButtonProps>('ReportExportButton', props => {
    return (
        <InsightsCommandButton
            iconProps={{ iconName: 'Export' }}
            onClick={props.showReportExportDialog}
            componentRef={props.buttonRef}
        >
            Export result
        </InsightsCommandButton>
    );
});
