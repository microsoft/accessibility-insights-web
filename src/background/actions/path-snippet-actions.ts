// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AsyncAction } from 'common/flux/async-action';

export class PathSnippetActions {
    public readonly getCurrentState = new AsyncAction<void>();
    public readonly onAddPath = new AsyncAction<string>();
    public readonly onAddSnippet = new AsyncAction<string>();
    public readonly onClearData = new AsyncAction<void>();
}
