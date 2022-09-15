// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Checkbox, Dialog, DialogFooter, DialogType, PrimaryButton, Stack } from '@fluentui/react';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import styles from 'DetailsView/components/common-dialog-styles.scss';
import * as React from 'react';

export type AutoDetectedFailuresDialogState = {
    dialogEnabled: boolean;
    isDisableBoxChecked: boolean;
};

export interface AutoDetectedFailuresDialogProps {
    deps: AutoDetectedFailuresDialogDeps;
    visualizationScanResultData: VisualizationScanResultData;
    userConfigurationStoreData: UserConfigurationStoreData;
}

export type AutoDetectedFailuresDialogDeps = {
    userConfigMessageCreator: UserConfigMessageCreator;
};

export class AutoDetectedFailuresDialog extends React.Component<
    AutoDetectedFailuresDialogProps,
    AutoDetectedFailuresDialogState
> {
    public constructor(props) {
        super(props);
        this.state = {
            dialogEnabled: false,
            isDisableBoxChecked: false,
        };
    }

    private showAutoDetectedFailuresDialog = () => this.setState({ dialogEnabled: true });

    private dismissAutoDetectedFailuresDialog = () => this.setState({ dialogEnabled: false });

    private disableAutoDetectedFailuresDialog = (ev?, checked?: boolean) => {
        if (checked === undefined) {
            return;
        }
        this.props.deps.userConfigMessageCreator.setAutoDetectedFailuresDialogState(!checked);
        this.setState({ isDisableBoxChecked: checked });
    };

    public componentDidUpdate(prevProps, prevState): void {
        const tabbingJustFinished =
            this.props.visualizationScanResultData.tabStops.tabbingCompleted &&
            !this.props.visualizationScanResultData.tabStops.needToCollectTabbingResults &&
            prevProps.visualizationScanResultData.tabStops.needToCollectTabbingResults;
        const autoDetectedFailuresExist =
            this.props.visualizationScanResultData.tabStops.requirements &&
            Object.entries(this.props.visualizationScanResultData.tabStops.requirements).some(
                ([_, data]) => data.instances.length > 0 && data.status === 'fail',
            );
        const showAgainSetting =
            this.props.userConfigurationStoreData.showAutoDetectedFailuresDialog;
        if (
            tabbingJustFinished &&
            autoDetectedFailuresExist &&
            !prevState.dialogEnabled &&
            showAgainSetting
        ) {
            this.setState({ isDisableBoxChecked: false });
            this.showAutoDetectedFailuresDialog();
        }
    }

    public render(): JSX.Element | null {
        if (!this.state.dialogEnabled) {
            return null;
        }

        return (
            <Dialog
                hidden={false}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Possible failures auto-detected',
                }}
                modalProps={{
                    containerClassName: styles.insightsDialogMainOverride,
                }}
                onDismiss={this.dismissAutoDetectedFailuresDialog}
            >
                <div className={styles.dialogBody}>
                    <ul>
                        <li>Review each finding to be sure it's valid</li>
                        <li>Add any more failures you discovered manually</li>
                    </ul>
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
                                label={"Don't show again"}
                                onChange={this.disableAutoDetectedFailuresDialog}
                                checked={this.state.isDisableBoxChecked}
                            />
                        </Stack.Item>
                        <Stack.Item grow>
                            <PrimaryButton
                                onClick={this.dismissAutoDetectedFailuresDialog}
                                text={'Got it'}
                            />
                        </Stack.Item>
                    </Stack>
                </DialogFooter>
            </Dialog>
        );
    }
}
