// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface PathSnippetStoreData {
    path: string;
    snippetCondition: SnippetCondition;
}

export type SnippetCondition = {
    associatedPath: string;
    showError: boolean;
    snippet: string;
};
