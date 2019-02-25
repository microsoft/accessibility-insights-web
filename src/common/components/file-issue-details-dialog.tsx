// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { autobind } from '@uifabric/utilities';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { FileIssueDetailsHandler } from '../file-issue-details-handler';

export interface FileIssueDetailsDialogProps {
    isOpen: boolean;
    onDismiss: () => void;
    onOpenSettings: (event: React.MouseEvent<HTMLElement>) => void;
    fileIssueDetailsHandler: FileIssueDetailsHandler;
}

export class FileIssueDetailsDialog extends React.Component<FileIssueDetailsDialogProps> {
    @autobind
    private onLayoutDidMount() {
        this.props.fileIssueDetailsHandler.onLayoutDidMount();
    }

    @autobind
    private dismiss(event: React.MouseEvent<any>) {
        this.props.onDismiss();
    }

    @autobind
    private openSettings(event: React.MouseEvent<HTMLDivElement>): void {
        this.props.onOpenSettings(event);
    }

    private renderDialogContent(): JSX.Element {
        return (
            <>
                <p>
                    Issue filing location must be configured before filing issues. Enter in the location information into settings in order
                    to file issues.
                </p>
                <DialogFooter>
                    <PrimaryButton onClick={this.openSettings} text="Go to settings" />
                    <DefaultButton onClick={this.dismiss} text={'Cancel'} />
                </DialogFooter>
            </>
        );
    }

    public render() {
        const layerClassNames = 'insights-dialog-main-override insights-file-issue-details-dialog-override';
        return (
            <Dialog
                hidden={!this.props.isOpen}
                dialogContentProps={{
                    type: DialogType.normal,
                }}
                modalProps={{
                    titleAriaId: 'fileIssueDetailsDialog',
                    isBlocking: false,
                    containerClassName: 'insights-file-issue-details-dialog-container',
                    layerProps: {
                        className: layerClassNames,
                        onLayerDidMount: this.onLayoutDidMount,
                    },
                }}
                onDismiss={this.props.onDismiss}
                title="File Issue"
            >
                {this.renderDialogContent()}
            </Dialog>
        );
    }
}
