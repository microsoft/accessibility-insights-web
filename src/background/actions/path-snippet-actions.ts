// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';

export class PathSnippetActions {
    public readonly getCurrentState = new Action<void>();
    public readonly onAddPath = new Action<string>();
    public readonly onAddSnippet = new Action<string>();
    public readonly onClearData = new Action<void>();
}
