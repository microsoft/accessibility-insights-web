// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from '../../common/flux/action';
import { BaseActionPayload } from './action-payloads';

export interface SnippetPayload extends BaseActionPayload {
    associatedPath: string;
    showError: boolean;
    snippet: string;
}

export class PathSnippetActions {
    public readonly getCurrentState = new Action<void>();
    public readonly onAddPath = new Action<string>();
    public readonly onAddSnippet = new Action<SnippetPayload>();
    public readonly onClearData = new Action<void>();
}
