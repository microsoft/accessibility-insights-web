// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { autobind } from '@uifabric/utilities';
import { IButton, DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { FileIssueDetailsHandler } from '../file-issue-details-handler';

export interface FileIssueDetailsDialogProps {
    isOpen: boolean;
    onDismiss: () => void;
    buttonRef: React.RefObject<IButton>;
    getSettingsPanel: () => HTMLElement | null;
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
        this.focusHack();
    }

    private focusHack(): void {
        let timedOut = false;
        setTimeout(() => (timedOut = true), 1000);
        const tryHack = () => {
            const settingsPanel = this.props.getSettingsPanel();
            if (!settingsPanel && !timedOut) {
                requestAnimationFrame(tryHack);
                return;
            }
            if (!settingsPanel && timedOut) {
                return;
            }

            settingsPanel.addEventListener('focusout', (event: Event) => {
                const focusEvent = event as FocusEvent;
                // Is null when panel is closed
                if (focusEvent.relatedTarget) {
                    return;
                }

                this.props.buttonRef.current.focus();
            });
        };
        tryHack();
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
