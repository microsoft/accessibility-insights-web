// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as contrast from './contrast';
import { guidance } from './guidance';
import * as hoverFocusContent from './hover-focus-content';
import * as orientation from './orientation';
import { infoAndExamples as reflow } from './reflow';
import * as resizeText from './resize-text';
import * as textSpacing from './text-spacing';

export const adaptableContent = {
    guidance,
    contrast,
    resizeText,
    orientation,
    reflow,
    textSpacing,
    hoverFocusContent,
};
