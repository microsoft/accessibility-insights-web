// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DefaultButton, Dialog, DialogFooter, IDialogProps, PrimaryButton } from '@fluentui/react';
import * as Markup from 'assessments/markup';
import { NamedFC } from 'common/react/named-fc';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import commonDialogStyles from 'DetailsView/components/common-dialog-styles.scss';
import { DataTransferViewController } from 'DetailsView/data-transfer-view-controller';
import * as React from 'react';

export type QuickAssessToAssessmentDialogDeps = {
    dataTransferViewController: DataTransferViewController;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};
export interface QuickAssessToAssessmentDialogProps {
    deps: QuickAssessToAssessmentDialogDeps;
    isShown: boolean;
}

export const continueToAssessmentButtonAutomationId = 'continue-to-assessment-button';

export const QuickAssessToAssessmentDialog = NamedFC<QuickAssessToAssessmentDialogProps>(
    'QuickAssessToAssessmentConfirmDialog',
    props => {
        const { dataTransferViewController, detailsViewActionMessageCreator } = props.deps;
        const dialogProps: IDialogProps = {
            hidden: !props.isShown,
            title: 'Continue to assessment',
            onDismiss: dataTransferViewController.hideQuickAssessToAssessmentConfirmDialog,
            containerClassName: commonDialogStyles.insightsDialogMainOverride,
        };

        const descriptionText =
            'This will allow you to continue accessibility testing with additional tests and requirements in Assessment. All your existing data in Quick Assess will be transferred into Assessment.';

        const noteText =
            'If you have an Assessment in progress, the current Quick Assess evaluation data will replace the Assessment evaluation and previous progress will be lost.';
        return (
            <Dialog {...dialogProps}>
                <div>{descriptionText}</div>
                <p>
                    <Markup.Term>Note</Markup.Term>: {noteText}
                </p>
                <DialogFooter>
                    <DefaultButton
                        onClick={async () =>
                            await dataTransferViewController.hideQuickAssessToAssessmentConfirmDialog()
                        }
                        text={'Cancel'}
                    />
                    <PrimaryButton
                        onClick={async ev => {
                            detailsViewActionMessageCreator.confirmDataTransferToAssessment(ev);
                            detailsViewActionMessageCreator.sendPivotItemClicked(
                                DetailsViewPivotType[DetailsViewPivotType.assessment],
                            );
                            detailsViewActionMessageCreator.changeRightContentPanel('Overview');
                            await dataTransferViewController.hideQuickAssessToAssessmentConfirmDialog();
                        }}
                        data-automation-id={continueToAssessmentButtonAutomationId}
                        text={'Continue to assessment'}
                        autoFocus={true}
                    />
                </DialogFooter>
            </Dialog>
        );
    },
);
