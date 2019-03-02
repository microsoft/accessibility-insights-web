// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as audioControl from './audio-control';
import * as autoUpdatingContent from './auto-updating-content';
import { guidance } from './guidance';
import * as movingContent from './moving-content';
import * as timeLimits from './time-limits';

export const timedEvents = {
    guidance,
    timeLimits,
    movingContent,
    autoUpdatingContent,
    audioControl,
};
