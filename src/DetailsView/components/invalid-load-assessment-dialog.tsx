// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog, DialogFooter, DialogType, PrimaryButton } from '@fluentui/react';
import { NamedFC } from 'common/react/named-fc';
import * as styles from 'DetailsView/components/invalid-load-assessment-dialog.scss';
import * as React from 'react';

export const invalidLoadAssessmentDialogOkButtonAutomationId =
    'invalid-load-assessment-dialog-ok-button';
export interface InvalidLoadAssessmentDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const InvalidLoadAssessmentDialog = NamedFC<InvalidLoadAssessmentDialogProps>(
    'InvalidLoadAssessmentDialog',
    props => {
        if (!props.isOpen) {
            return null;
        }

        return (
            <Dialog
                hidden={false}
                onDismiss={props.onClose}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Oops! Accessibility Insights can’t open this file.',
                    subText: 'Please select a valid *.a11ywebassessment file',
                }}
                modalProps={{
                    isBlocking: false,
                    containerClassName: styles.invalidLoadAssessmentDialog,
                    onDismissed: props.onClose,
                }}
            >
                <DialogFooter>
                    <PrimaryButton
                        data-automation-id={invalidLoadAssessmentDialogOkButtonAutomationId}
                        onClick={props.onClose}
                    >
                        OK
                    </PrimaryButton>
                </DialogFooter>
            </Dialog>
        );
    },
);
