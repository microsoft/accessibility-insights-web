// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Rectangle } from 'electron';
import { WindowFrameActions } from 'electron/flux/action/window-frame-actions';
import { SetSizePayload } from 'electron/flux/action/window-frame-actions-payloads';

export class WindowFrameActionCreator {
    constructor(private readonly windowFrameActions: WindowFrameActions) {}

    public setWindowSize(size: SetSizePayload): void {
        this.windowFrameActions.setWindowSize.invoke(size);
    }

    public setWindowBounds(windowBounds: Rectangle): void {
        this.windowFrameActions.setWindowBounds.invoke(windowBounds);
    }

    public enterFullScreen(): void {
        this.windowFrameActions.enterFullScreen.invoke();
    }

    public maximize(): void {
        this.windowFrameActions.maximize.invoke();
    }

    public minimize(): void {
        this.windowFrameActions.minimize.invoke();
    }
    public restore(): void {
        this.windowFrameActions.restore.invoke();
    }

    public close(): void {
        this.windowFrameActions.close.invoke();
    }
}
