// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Checkbox, Dialog, DialogFooter, DialogType, PrimaryButton, Stack } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import styles from 'DetailsView/components/common-dialog-styles.scss';
import * as React from 'react';

export interface SaveAssessmentButtonDeps {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    userConfigMessageCreator: UserConfigMessageCreator;
}
export interface SaveAssessmentButtonProps {
    download: string;
    href: string;
    deps: SaveAssessmentButtonDeps;
    userConfigurationStoreData: UserConfigurationStoreData;
}

export const SaveAssessmentButton = NamedFC<SaveAssessmentButtonProps>(
    'SaveAssessmentButton',
    ({ userConfigurationStoreData, deps, download, href }) => {
        const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
        const [showDialogAgain, { toggle: toggleShowDialogAgain }] = useBoolean(
            userConfigurationStoreData.showSaveAssessmentDialog,
        );

        function handleSaveAssessmentClick(event: React.MouseEvent<any>) {
            deps.detailsViewActionMessageCreator.saveAssessment(event);
            if (!showDialogAgain) return;
            toggleHideDialog();
        }

        function handleDontShowAgainClick(event: React.MouseEvent<any>, checked?: boolean) {
            if (checked === undefined) return;
            toggleShowDialogAgain();
            deps.userConfigMessageCreator.setSaveAssessmentDialogState(!checked);
        }

        return (
            <>
                <InsightsCommandButton
                    iconProps={{ iconName: 'Save' }}
                    download={download}
                    href={href}
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
                                value={!showDialogAgain}
                                label="Don't show again"
                                onChange={handleDontShowAgainClick}
                            />
                            <PrimaryButton onClick={toggleHideDialog} text="Got it" />
                        </Stack>
                    </DialogFooter>
                </Dialog>
            </>
        );
    },
);
