// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { autobind } from '@uifabric/utilities';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { FileIssueDetailsHandler } from '../file-issue-details-handler';
import { ActionAndCancelButtonsComponent } from '../../DetailsView/components/action-and-cancel-buttons-component';

export interface FileIssueDetailsModalProps {
    isOpen: boolean;
    onDismiss: () => void;
    onOpenSettings: (event: React.MouseEvent<HTMLElement>) => void;
    fileIssueDetailsHandler: FileIssueDetailsHandler;
}

export class FileIssueDetailsModal extends React.Component<FileIssueDetailsModalProps> {
    @autobind
    private onLayoutDidMount() {
        this.props.fileIssueDetailsHandler.onLayoutDidMount();
    }

    public render() {
        return (
            <Modal
                titleAriaId="fileIssueDetailsModal"
                isOpen={this.props.isOpen}
                onDismiss={this.props.onDismiss}
                isBlocking={false}
                containerClassName="ms-file-issue-details-modal-container"
                layerProps={{
                    className: 'ms-file-issue-details-modal-override',
                    onLayerDidMount: this.onLayoutDidMount,
                }}
            >
                <h2>File Issue</h2>
                <p>
                    Issue filing location must be configured before filing bugs. Enter in the location information into settings in order to
                    file issues.
                </p>
                <ActionAndCancelButtonsComponent
                    isHidden={false}
                    primaryButtonText="Go to settings"
                    primaryButtonDisabled={false}
                    primaryButtonOnClick={this.props.onOpenSettings}
                    cancelButtonOnClick={this.props.onDismiss}
                />
            </Modal>
        );
    }
}
