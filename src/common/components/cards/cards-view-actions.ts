// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SyncAction } from 'common/flux/sync-action';

export class CardsViewActions {
    openIssueFilingSettingsDialog = new SyncAction();
    closeIssueFilingSettingsDialog = new SyncAction();
}
