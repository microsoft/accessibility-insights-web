// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { IssueFilingActions } from '../actions/issue-filing-actions';
import { StoreNames } from './../../common/stores/store-names';
import { OpenIssueFilingSettingsDialogPayload } from './../actions/action-payloads';
import { BaseStoreImpl } from './base-store-impl';
import { IssueFilingStoreData } from './issue-filing-store-data';

export class IssueFilingStore extends BaseStoreImpl<IssueFilingStoreData> {
    constructor(private issueFilingActions: IssueFilingActions) {
        super(StoreNames.IssueFilingStore);
    }

    protected addActionListeners(): void {
        this.issueFilingActions.openIssueFilingSettingsDialog.addListener(this.onOpenIssueFilingSettingsDialog);
        this.issueFilingActions.closeIssueFilingSettingsDialog.addListener(this.onCloseIssueFilingSettingsDialog);
    }

    public getDefaultState(): IssueFilingStoreData {
        const data: IssueFilingStoreData = {
            isIssueFilingSettingsDialogOpen: false,
            issueDetailsTextData: null,
        };

        return data;
    }

    @autobind
    private onOpenIssueFilingSettingsDialog(payload: OpenIssueFilingSettingsDialogPayload): void {
        this.state.isIssueFilingSettingsDialogOpen = true;
        this.state.issueDetailsTextData = payload.issueDetailsTextData;

        this.emitChanged();
    }

    @autobind
    private onCloseIssueFilingSettingsDialog(): void {
        this.state.isIssueFilingSettingsDialogOpen = false;

        this.emitChanged();
    }
}
