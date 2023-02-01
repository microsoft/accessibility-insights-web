// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';

export type IssueDetailsBuilderOptions = {
    isLengthConstrained?: boolean; // default: false
};
export type IssueDetailsBuilder = (
    toolData: ToolData,
    data: CreateIssueDetailsTextData,
    options?: IssueDetailsBuilderOptions,
) => string;
