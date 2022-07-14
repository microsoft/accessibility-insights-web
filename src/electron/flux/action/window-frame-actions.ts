// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SyncAction } from 'common/flux/sync-action';
import { Rectangle } from 'electron';
import { SetSizePayload } from 'electron/flux/action/window-frame-actions-payloads';

export class WindowFrameActions {
    public readonly enterFullScreen = new SyncAction<void>();
    public readonly maximize = new SyncAction<void>();
    public readonly minimize = new SyncAction<void>();
    public readonly restore = new SyncAction<void>();
    public readonly close = new SyncAction<void>();
    public readonly setWindowSize = new SyncAction<SetSizePayload>();
    public readonly setWindowBounds = new SyncAction<Rectangle>();
}
