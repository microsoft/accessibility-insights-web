// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Action } from 'common/flux/action';
import { Rectangle } from 'electron';
import { SetSizePayload } from 'electron/flux/action/window-frame-actions-payloads';

export class WindowFrameActions {
    public readonly enterFullScreen = new Action<void>();
    public readonly maximize = new Action<void>();
    public readonly minimize = new Action<void>();
    public readonly restore = new Action<void>();
    public readonly close = new Action<void>();
    public readonly setWindowSize = new Action<SetSizePayload>();
    public readonly setWindowBounds = new Action<Rectangle>();
}
