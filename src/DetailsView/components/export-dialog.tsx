// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { BaseButton, Button } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';

import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';

export interface ExportDialogProps {
    deps: ExportDialogDeps;
    isOpen: boolean;
    description: string;
    html: string;
    onClose: () => void;
    onDescriptionChanged: (value: string) => void;
}

export interface ExportDialogDeps {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
}

export class ExportDialog extends React.Component<ExportDialogProps> {

    constructor(props: ExportDialogProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <Dialog
                hidden={!this.props.isOpen}
                onDismiss={this.onDismiss}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Provide result description',
                    subText: 'Optional: please describe the result (it will be saved in the report).',
                }}
                modalProps={{
                    isBlocking: false,
                    containerClassName: 'insights-dialog-main-override',
                }}
            >
                <TextField
                    multiline
                    autoFocus
                    rows={8}
                    resizable={false}
                    onChanged={this.onDescriptionChanged}
                    value={this.props.description}
                    ariaLabel="Provide result description"
                />
                <DialogFooter>
                    <Link
                        onClick={this.onExportLinkClick}
                        className="download-report-link"
                        download="AssessmentReport.html"
                        href={'data:text/html,' + this.props.html}
                    >
                        Export
                    </Link>
                </DialogFooter>
            </Dialog>
        );
    }

    @autobind
    private onDismiss(
        event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement | BaseButton | Button>,
    ): void {
        this.props.onClose();
    }

    @autobind
    private onExportLinkClick(event: React.MouseEvent<HTMLDivElement>): void {
        const { detailsViewActionMessageCreator } = this.props.deps;
        detailsViewActionMessageCreator.exportAssessmentResultsClicked(this.props.html, event);
        this.props.onClose();
    }

    @autobind
    private onDescriptionChanged(value: string): void {
        this.props.onDescriptionChanged(value);
    }
}


