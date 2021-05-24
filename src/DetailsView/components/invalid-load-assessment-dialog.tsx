// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { Dialog, DialogFooter, DialogType, PrimaryButton } from 'office-ui-fabric-react';
import * as styles from 'DetailsView/components/invalid-load-assessment-dialog.scss';
import * as React from 'react';

export interface InvalidLoadAssessmentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onOkClick: () => void;
}

export const InvalidLoadAssessmentDialog = NamedFC<InvalidLoadAssessmentDialogProps>('InvalidLoadAssessmentDialog', props => {
    const onDismiss = (): void => {
        props.onClose();
    };
    return (
        <Dialog
            hidden={!props.isOpen}
            //JG note: clean this up and sub in onClose if we don't have something to add on line 15
            onDismiss={onDismiss}
            dialogContentProps={{
                type: DialogType.normal,
                title: 'Oops! Accessibility Insights can’t open this file. Please select a valid *.a11yAssessment file',
            }}
            modalProps={{
                isBlocking: true,
                containerClassName: styles.invalidLoadAssessmentDialog,
                onDismissed: props.onClose,
            }}
        >
            <DialogFooter>
                <PrimaryButton
                        onClick={props.onOkClick}
                    >
                        OK
                </PrimaryButton>
            </DialogFooter>
        </Dialog>
    );
 });
