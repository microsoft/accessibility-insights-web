// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface PathSnippetStoreData {
    path: string;
    snippetCondition: SnippetCondition;
}

export type SnippetCondition = {
    showError: boolean;
    snippet: string;
};
