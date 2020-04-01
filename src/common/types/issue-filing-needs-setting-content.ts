// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    IssueFilingDialog,
    IssueFilingDialogProps,
} from '../../DetailsView/components/issue-filing-dialog';
import { ReactFCWithDisplayName } from '../react/named-fc';
import { IssueFilingNeedsSettingsHelpTextProps } from './../components/issue-filing-needs-settings-help-text';

export type IssueFilingNeedsSettingsContentProps = IssueFilingDialogProps &
    IssueFilingNeedsSettingsHelpTextProps;

export type IssueFilingNeedsSettingsContentRenderer =
    | ReactFCWithDisplayName<IssueFilingNeedsSettingsContentProps>
    | typeof IssueFilingDialog;
