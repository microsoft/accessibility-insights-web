// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Checkbox, Dialog, DialogFooter, DialogType, PrimaryButton, Stack } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { FluentUIV9Icon } from 'common/icons/fluentui-v9-icons';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { useCommandButtonStyle } from 'DetailsView/components/command-button-styles';
import styles from 'DetailsView/components/common-dialog-styles.scss';

import * as React from 'react';

export interface SaveAssessmentButtonDeps {
    getAssessmentActionMessageCreator: () => AssessmentActionMessageCreator;
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
    props => {
        const [dialogHidden, { setTrue: hideDialog, setFalse: showDialog }] = useBoolean(true);
        const saveAssessmentStyles: any = useCommandButtonStyle();
        function handleSaveAssessmentClick(event: React.MouseEvent<any>) {
            props.deps.getAssessmentActionMessageCreator().saveAssessment(event);
            if (props.userConfigurationStoreData.showSaveAssessmentDialog) {
                showDialog();
            }
        }

        function handleDontShowAgainClick(event: React.MouseEvent<any>, checked?: boolean) {
            if (checked === undefined) return;
            props.deps.userConfigMessageCreator.setSaveAssessmentDialogState(!checked);
        }

        return (
            <>
                <InsightsCommandButton
                    as="a"
                    className={saveAssessmentStyles?.assessmentButton}
                    download={props.download}
                    href={props.href}
                    onClick={handleSaveAssessmentClick}
                    insightsCommandButtonIconProps={{
                        icon: <FluentUIV9Icon iconName="SaveRegular" />,
                    }}
                >
                    Save assessment
                </InsightsCommandButton>

                <Dialog
                    hidden={dialogHidden}
                    onDismiss={hideDialog}
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
                                <PrimaryButton onClick={hideDialog} text="Got it" />
                            </Stack.Item>
                        </Stack>
                    </DialogFooter>
                </Dialog>
            </>
        );
    },
);
