// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Checkbox, Dialog, DialogFooter, DialogType, PrimaryButton, Stack } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { NamedFC } from 'common/react/named-fc';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import styles from 'DetailsView/components/common-dialog-styles.scss';
import * as React from 'react';

export interface SaveAssessmentButtonDeps {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
}
export interface SaveAssessmentButtonProps {
    download: string;
    href: string;
    deps: SaveAssessmentButtonDeps;
}

export const SaveAssessmentButton = NamedFC<SaveAssessmentButtonProps>(
    'SaveAssessmentButton',
    props => {
        const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
        const [showDialogAgain, { toggle: toggleShowDialogAgain }] = useBoolean(true);

        function handleSaveAssessmentClick() {
            props.deps.detailsViewActionMessageCreator.saveAssessment;

            if (showDialogAgain) {
                toggleHideDialog();
            }
        }

        return (
            <>
                <InsightsCommandButton
                    iconProps={{ iconName: 'Save' }}
                    download={props.download}
                    href={props.href}
                    onClick={handleSaveAssessmentClick}
                >
                    Save assessment
                </InsightsCommandButton>
                <Dialog
                    hidden={hideDialog}
                    onDismiss={toggleHideDialog}
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
                        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                            <Checkbox
                                value={showDialogAgain}
                                label="Don't show again"
                                onChange={toggleShowDialogAgain}
                            />
                            <PrimaryButton onClick={toggleHideDialog} text="Got it" />
                        </Stack>
                    </DialogFooter>
                </Dialog>
            </>
        );
    },
);
