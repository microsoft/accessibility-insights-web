// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueFilingButtonDeps } from '../common/components/issue-filing-button';
import { UserConfigMessageCreator } from '../common/message-creators/user-config-message-creator';

export type TargetPageIssueFilingButtonDeps = Pick<
    IssueFilingButtonDeps,
    Exclude<keyof IssueFilingButtonDeps, keyof { userConfigMessageCreator: UserConfigMessageCreator }>
>;
