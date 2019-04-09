// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import * as React from 'react';

import { BugFilingService } from '../../bug-filing/types/bug-filing-service';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { BugServiceProperties } from '../../common/types/store-data/user-configuration-store';
import { ActionAndCancelButtonsComponent } from './action-and-cancel-buttons-component';

export interface IssueFilingDialogProps {
    deps: IssueFilingDialogDeps;
    isOpen: boolean;
    selectedBugFilingService: BugFilingService;
    selectedBugData: CreateIssueDetailsTextData;
    selectedBugFilingServiceData: BugServiceProperties;
    bugFileTelemetryCallback: (ev: React.SyntheticEvent) => void;
}

export interface IssueFilingDialogDeps {}

export interface IssueFilingState {
    isOpen: boolean;
}

const titleLabel = 'Specify issue filing location';

export class IssueFilingDialog extends React.Component<IssueFilingDialogProps, IssueFilingState> {
    constructor(props: IssueFilingDialogProps) {
        super(props);
        this.state = {
            isOpen: true,
        };
    }

    public render(): JSX.Element {
        const { selectedBugFilingService, selectedBugFilingServiceData, selectedBugData, bugFileTelemetryCallback } = this.props;

        return (
            <Dialog
                className={'issue-filing-dialog'}
                hidden={!this.state.isOpen}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: titleLabel,
                    titleId: 'issue-filing-dialog-title',
                    subText: 'This configuration can be changed again in settings.',
                    subTextId: 'issue-filing-dialog-subtext',
                    showCloseButton: false,
                }}
                modalProps={{
                    isBlocking: false,
                    containerClassName: 'insights-dialog-main-override',
                }}
            >
                <DialogFooter>
                    <ActionAndCancelButtonsComponent
                        isHidden={false}
                        primaryButtonDisabled={selectedBugFilingService.isSettingsValid(selectedBugFilingServiceData)}
                        primaryButtonOnClick={bugFileTelemetryCallback}
                        cancelButtonOnClick={this.closeDialog}
                        primaryButtonHref={selectedBugFilingService.createBugFilingUrl(selectedBugFilingServiceData, selectedBugData)}
                        primaryButtonText={'File issue'}
                    />
                </DialogFooter>
            </Dialog>
        );
    }

    private closeDialog = (): void => {
        this.setState({
            isOpen: false,
        });
    };
}
