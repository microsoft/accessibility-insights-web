// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { NamedFC } from 'common/react/named-fc';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import * as React from 'react';

export type ReportExportButtonDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface ReportExportButtonProps {
    deps: ReportExportButtonDeps;
}

export const ReportExportButton = NamedFC<ReportExportButtonProps>('ReportExportButton', props => {
    const onExportButtonClick = () => {
        props.deps.detailsViewActionMessageCreator.showReportExportDialog();
    };

    return (
        <InsightsCommandButton iconProps={{ iconName: 'Export' }} onClick={onExportButtonClick}>
            Export result
        </InsightsCommandButton>
    );
});
