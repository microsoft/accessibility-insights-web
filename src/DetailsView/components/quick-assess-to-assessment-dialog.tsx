// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Dialog, DialogFooter, IDialogProps } from '@fluentui/react';
import { Button } from '@fluentui/react-components';
import * as Markup from 'assessments/markup';
import { NamedFC } from 'common/react/named-fc';
import styles from 'common/styles/button.scss';
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
    afterDialogDismissed: () => void;
}

export const continueToAssessmentButtonAutomationId = 'continue-to-assessment-button';

export const QuickAssessToAssessmentDialog = NamedFC<QuickAssessToAssessmentDialogProps>(
    'QuickAssessToAssessmentConfirmDialog',
    props => {
        const { dataTransferViewController, detailsViewActionMessageCreator } = props.deps;
        const dialogProps: IDialogProps = {
            hidden: !props.isShown,
            title: 'Continue to Assessment',
            onDismiss: dataTransferViewController.hideQuickAssessToAssessmentConfirmDialog,
            modalProps: {
                onDismissed: props.afterDialogDismissed,
                containerClassName: commonDialogStyles.insightsDialogMainOverride,
            },
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
                    <div className={styles.buttonsComponent}>
                        <div className={styles.buttonCol}>
                            <Button
                                className={styles.defaultButton}
                                onClick={async () =>
                                    await dataTransferViewController.hideQuickAssessToAssessmentConfirmDialog()
                                }
                            >
                                {' '}
                                Cancel{' '}
                            </Button>
                        </div>
                        <div className={styles.buttonCol}>
                            <Button
                                className={styles.primaryButtonEnabled}
                                onClick={async ev => {
                                    detailsViewActionMessageCreator.confirmDataTransferToAssessment(
                                        ev,
                                    );
                                    detailsViewActionMessageCreator.sendPivotItemClicked(
                                        DetailsViewPivotType[DetailsViewPivotType.assessment],
                                    );
                                    detailsViewActionMessageCreator.changeRightContentPanel(
                                        'Overview',
                                    );
                                    await dataTransferViewController.hideQuickAssessToAssessmentConfirmDialog();
                                }}
                                data-automation-id={continueToAssessmentButtonAutomationId}
                                autoFocus={true}
                            >
                                {' '}
                                Continue to Assessment{' '}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </Dialog>
        );
    },
);
