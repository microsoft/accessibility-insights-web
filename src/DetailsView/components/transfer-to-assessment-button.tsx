// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { FluentUIV9Icon } from 'common/icons/fluentui-v9-icons';
import { NamedFC } from 'common/react/named-fc';
import { useCommandButtonStyle } from 'DetailsView/components/command-button-styles';
import { MyFunctionType } from 'DetailsView/components/details-view-command-bar';
import { DataTransferViewController } from 'DetailsView/data-transfer-view-controller';
import * as React from 'react';

export type TransferToAssessmentButtonDeps = {
    dataTransferViewController: DataTransferViewController;
};
export interface TransferToAssessmentButtonProps {
    deps: TransferToAssessmentButtonDeps;
    buttonRef?: MyFunctionType;
    isNarrowMode?: boolean;
}

export const transferToAssessmentButtonAutomationId = 'transfer-to-assessment-button';

export const TransferToAssessmentButton = NamedFC<TransferToAssessmentButtonProps>(
    'TransferToAssessmentButton',
    props => {
        const saveAssessmentStyles = useCommandButtonStyle();
        return (
            <InsightsCommandButton
                className={saveAssessmentStyles.assessmentButton}
                data-automation-id={transferToAssessmentButtonAutomationId}
                insightsCommandButtonIconProps={{
                    icon: <FluentUIV9Icon iconName="FolderArrowRightRegular" />,
                }}
                onClick={
                    props.deps.dataTransferViewController.showQuickAssessToAssessmentConfirmDialog
                }
                ref={props.buttonRef}
            >
                Move to assessment
            </InsightsCommandButton>
        );
    },
);

export const getTransferToAssessmentButton = (props: TransferToAssessmentButtonProps) => {
    return <TransferToAssessmentButton {...props} />;
};
