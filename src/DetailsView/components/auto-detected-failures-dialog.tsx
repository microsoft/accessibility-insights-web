// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BlockingDialog } from 'common/components/blocking-dialog';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import * as styles from 'DetailsView/components/common-dialog-styles.scss';
import { DialogFooter, DialogType, PrimaryButton } from 'office-ui-fabric-react';
import * as React from 'react';

export type AutoDetectedFailuresDialogState = {
    dialogEnabled: boolean;
};

export interface AutoDetectedFailuresDialogProps {
    visualizationScanResultData: VisualizationScanResultData;
}

export class AutoDetectedFailuresDialog extends React.Component<
    AutoDetectedFailuresDialogProps,
    AutoDetectedFailuresDialogState
> {
    public constructor(props) {
        super(props);
        this.state = {
            dialogEnabled: false,
        };
    }

    private showAutoDetectedFailuresDialog = () => this.setState({ dialogEnabled: true });

    private dismissAutoDetectedFailuresDialog = () => this.setState({ dialogEnabled: false });

    public componentDidUpdate(prevProps, prevState): void {
        const tabbingJustFinished =
            this.props.visualizationScanResultData.tabStops.tabbingCompleted &&
            !prevProps.visualizationScanResultData.tabStops.tabbingCompleted;
        const autoDetectedFailuresExist =
            this.props.visualizationScanResultData.tabStops.requirements &&
            Object.entries(this.props.visualizationScanResultData.tabStops.requirements).some(
                ([_, data]) => data.instances.length > 0 && data.status === 'fail',
            );
        if (tabbingJustFinished && autoDetectedFailuresExist && !prevState.dialogEnabled) {
            this.showAutoDetectedFailuresDialog();
        }
    }

    public render(): JSX.Element {
        if (!this.state.dialogEnabled) {
            return null;
        }

        return (
            <BlockingDialog
                hidden={false}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Possible failures auto-detected',
                }}
                modalProps={{
                    containerClassName: styles.insightsDialogMainOverride,
                }}
            >
                <div className={styles.dialogBody}>
                    <ul>
                        <li>Review each finding to be sure it's valid</li>
                        <li>Add any more failures you discovered manually</li>
                    </ul>
                </div>
                <DialogFooter>
                    <PrimaryButton
                        onClick={this.dismissAutoDetectedFailuresDialog}
                        text={'Got it'}
                    />
                </DialogFooter>
            </BlockingDialog>
        );
    }
}
