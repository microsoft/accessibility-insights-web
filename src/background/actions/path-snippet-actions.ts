// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SyncAction } from 'common/flux/sync-action';

export class PathSnippetActions {
    public readonly getCurrentState = new SyncAction<void>();
    public readonly onAddPath = new SyncAction<string>();
    public readonly onAddSnippet = new SyncAction<string>();
    public readonly onClearData = new SyncAction<void>();
}
