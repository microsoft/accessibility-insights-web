// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { guidance } from './guidance';
import * as motionOperation from './motion-operation';
import * as pointerCancellation from './pointer-cancellation';
import * as pointerGestures from './pointer-gestures';
import * as targetSize from './target-size';

export const pointerMotion = {
    guidance,
    pointerCancellation,
    pointerGestures,
    motionOperation,
    targetSize,
};
