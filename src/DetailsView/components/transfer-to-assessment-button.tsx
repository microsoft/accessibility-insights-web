// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IRefObject, IButton } from '@fluentui/react';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { NamedFC } from 'common/react/named-fc';
import { DataTransferViewController } from 'DetailsView/data-transfer-view-controller';
import * as React from 'react';

export type TransferToAssessmentButtonDeps = {
    dataTransferViewController: DataTransferViewController;
};

export interface TransferToAssessmentButtonProps {
    deps: TransferToAssessmentButtonDeps;
    buttonRef?: IRefObject<IButton>;
}

export const transferToAssessmentButtonAutomationId = 'transfer-to-assessment-button';

export const TransferToAssessmentButton = NamedFC<TransferToAssessmentButtonProps>(
    'TransferToAssessmentButton',
    props => {
        return (
            <InsightsCommandButton
                data-automation-id={transferToAssessmentButtonAutomationId}
                iconName={'FolderArrowRightRegular'}
                onClick={
                    props.deps.dataTransferViewController.showQuickAssessToAssessmentConfirmDialog
                }
                componentRef={props.buttonRef}
                text="Move to assessment"
            />
        );
    },
);

export const getTransferToAssessmentButton = (props: TransferToAssessmentButtonProps) => {
    return <TransferToAssessmentButton {...props} />;
};
