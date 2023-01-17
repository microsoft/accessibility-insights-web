// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { NamedFC } from 'common/react/named-fc';
import { DataTransferViewController } from 'DetailsView/data-transfer-view-controller';
import * as React from 'react';

export type TransferToAssessmentButtonDeps = {
    dataTransferViewController: DataTransferViewController;
};

export interface TransferToAssessmentButtonProps {
    deps: TransferToAssessmentButtonDeps;
}

export const TransferToAssessmentButton = NamedFC<TransferToAssessmentButtonProps>(
    'TransferToAssessmentButton',
    props => {
        return (
            <InsightsCommandButton
                iconProps={{ iconName: 'fabricMoveToFolder' }}
                onClick={
                    props.deps.dataTransferViewController.showQuickAssessToAssessmentConfirmDialog
                }
            >
                Move to assessment
            </InsightsCommandButton>
        );
    },
);

export const getTransferToAssessmentButton = (props: TransferToAssessmentButtonProps) => {
    return <TransferToAssessmentButton {...props} />;
};
