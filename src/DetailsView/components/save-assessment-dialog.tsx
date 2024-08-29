// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Checkbox, Dialog, DialogFooter, DialogType, PrimaryButton, Stack } from '@fluentui/react';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import styles from 'DetailsView/components/common-dialog-styles.scss';
import * as React from 'react';

export type SaveAssessmentDialogDeps = {
    getAssessmentActionMessageCreator: () => AssessmentActionMessageCreator;
    userConfigMessageCreator: UserConfigMessageCreator;
};

export const saveAssessmentDialogLoadButtonAutomationId = 'save-assessment-dialog-load-button';
export interface SaveAssessmentDialogProps {
    deps: SaveAssessmentDialogDeps;
    isOpen: boolean;
    onClose: () => void;
    userConfigurationStoreData: UserConfigurationStoreData;
}

export const SaveAssessmentDialog = NamedFC<SaveAssessmentDialogProps>(
    'SaveAssessmentDialog',
    props => {
        function handleDontShowAgainClick(event: React.MouseEvent<any>, checked?: boolean) {
            if (checked === undefined) return;
            props.deps.userConfigMessageCreator.setSaveAssessmentDialogState(!checked);
        }
        return (
            <>
                <Dialog
                    hidden={!props.isOpen}
                    onDismiss={props.onClose}
                    dialogContentProps={{
                        type: DialogType.normal,
                        title: 'Assessment saved',
                    }}
                    modalProps={{
                        isBlocking: false,
                        containerClassName: styles.insightsDialogMainOverride,
                    }}
                >
                    <div className={styles.dialogBody}>
                        To load this assessment, use the <strong>Load assessment</strong> button in
                        the Accessibility Insights Assessment command bar.
                    </div>
                    <DialogFooter>
                        <Stack
                            horizontal
                            horizontalAlign="space-between"
                            wrap
                            verticalAlign="center"
                            tokens={{ childrenGap: 6 }}
                        >
                            <Stack.Item grow disableShrink>
                                <Checkbox
                                    checked={
                                        !props.userConfigurationStoreData.showSaveAssessmentDialog
                                    }
                                    label="Don't show again"
                                    onChange={handleDontShowAgainClick}
                                />
                            </Stack.Item>
                            <Stack.Item grow>
                                <PrimaryButton onClick={props.onClose} text="Got it" />
                            </Stack.Item>
                        </Stack>
                    </DialogFooter>
                </Dialog>
            </>
        );
    },
);
