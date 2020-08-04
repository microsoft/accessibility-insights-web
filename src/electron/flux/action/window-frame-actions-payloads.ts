// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Rectangle } from 'electron';
import { WindowState } from 'electron/flux/types/window-state';

export interface SetSizePayload {
    width: number;
    height: number;
}

export interface WindowBoundsChangedPayload {
    windowState: WindowState;
    windowBounds: Rectangle;
}
