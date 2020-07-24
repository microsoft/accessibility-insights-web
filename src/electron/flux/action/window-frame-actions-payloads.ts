// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Rectangle } from 'electron';

export interface SetSizePayload {
    width: number;
    height: number;
}

export interface WindowBoundsPayload {
    isMaximized: boolean;
    windowBounds?: Rectangle;
}
