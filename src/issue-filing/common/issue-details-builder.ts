// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
export type IssueDetailsBuilder = (
    environmentInfo: EnvironmentInfo,
    data: CreateIssueDetailsTextData,
) => string;
