// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueFilingDialogProps } from '../../DetailsView/components/issue-filing-dialog';
import { IssueFilinigNeedsSettingsHelpTextProps } from '../components/needs-settings-help-text';
import { ReactSFCWithDisplayName } from '../react/named-sfc';

export type IssueFilingNeedsSettingsContentProps = IssueFilingDialogProps & IssueFilinigNeedsSettingsHelpTextProps;

export type IssueFilingNeedsSettingsContentRenderer = ReactSFCWithDisplayName<IssueFilingNeedsSettingsContentProps>;
