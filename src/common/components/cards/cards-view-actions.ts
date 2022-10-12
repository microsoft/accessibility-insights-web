// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SyncAction } from 'common/flux/sync-action';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';

export interface OpenIssueFilingSettingsDialogPayload {
    onDialogDismissedCallback?: () => void;
    selectedIssueData: CreateIssueDetailsTextData;
}

export class CardsViewActions {
    openIssueFilingSettingsDialog = new SyncAction<OpenIssueFilingSettingsDialogPayload>();
    closeIssueFilingSettingsDialog = new SyncAction();
}
