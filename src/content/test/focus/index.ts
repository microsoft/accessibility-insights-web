// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as closingContent from './closing-content';
import * as focusNotObscured from './focus-not-obscured';
import { infoAndExamples as focusOrder } from './focus-order';
import { guidance } from './guidance';
import * as modalDialogs from './modal-dialogs';
import * as revealingContent from './revealing-content';
import * as visibleFocus from './visible-focus';

export const focus = {
    guidance,
    visibleFocus,
    revealingContent,
    modalDialogs,
    closingContent,
    focusOrder,
    focusNotObscured,
};
