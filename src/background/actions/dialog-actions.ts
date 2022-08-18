// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AsyncAction } from 'common/flux/async-action';

export class DialogActions {
    openIssueFilingSettingsDialog = new AsyncAction();
    closeIssueFilingSettingsDialog = new AsyncAction();
}
