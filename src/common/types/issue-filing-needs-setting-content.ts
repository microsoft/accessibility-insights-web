// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueFilingDialogProps, IssueFilingDialogState, IssueFilingDialog } from '../../DetailsView/components/issue-filing-dialog';
import { ReactSFCWithDisplayName } from '../react/named-sfc';
import { IssueFilingNeedsSettingsHelpTextProps } from './../components/issue-filing-needs-settings-help-text';

export type IssueFilingNeedsSettingsContentProps = IssueFilingDialogProps & IssueFilingNeedsSettingsHelpTextProps;

export type IssueFilingNeedsSettingsContentRenderer =
    | ReactSFCWithDisplayName<IssueFilingNeedsSettingsContentProps>
    | typeof IssueFilingDialog;
