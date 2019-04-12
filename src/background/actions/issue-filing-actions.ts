// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from '../../common/flux/action';
import { OpenIssueFilingSettingsDialogPayload } from './action-payloads';

export class IssueFilingActions {
    public readonly openIssueFilingSettingsDialog = new Action<OpenIssueFilingSettingsDialogPayload>();
    public readonly closeIssueFilingSettingsDialog = new Action();
}
