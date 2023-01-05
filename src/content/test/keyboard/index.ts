// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as characterKeyShortcuts from './character-key-shortcuts';
import { guidance } from './guidance';
import { infoAndExamples as keyboardNavigation } from './keyboard-navigation';
import * as noKeyboardTraps from './no-keyboard-traps';
import * as noKeystrokeTimings from './no-keystroke-timings';
import * as onFocus from './on-focus';
import * as onInput from './on-input';

export const keyboard = {
    guidance,
    keyboardNavigation,
    noKeyboardTraps,
    noKeystrokeTimings,
    onFocus,
    onInput,
    characterKeyShortcuts,
};
